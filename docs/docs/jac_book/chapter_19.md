# Chapter 19: Deployment Strategies

In this chapter, we'll explore how to deploy Jac applications to production environments. We'll take our weather API from development to production using various deployment strategies including Docker, Kubernetes, and cloud platforms.

!!! info "What You'll Learn"
    - Local vs cloud deployment strategies
    - Containerizing Jac applications with Docker
    - Kubernetes deployment patterns
    - Configuration management for production
    - Monitoring and observability setup
    - CI/CD pipeline implementation

---

## Local vs Cloud Deployment

Understanding the deployment landscape is crucial for taking your Jac applications from development to production. Each environment has different requirements and considerations.

!!! success "Deployment Benefits"
    - **Environment Consistency**: Same application behavior across all environments
    - **Scalability**: Handle increased load automatically
    - **Reliability**: High availability and fault tolerance
    - **Security**: Production-grade security configurations
    - **Monitoring**: Comprehensive observability and alerting

### Traditional vs Jac Deployment

!!! example "Deployment Comparison"
    === "Traditional Approach"
        ```python
        # app.py - Complex deployment setup
        from flask import Flask, jsonify, request
        import os
        import logging
        from prometheus_client import Counter, generate_latest

        app = Flask(__name__)

        # Manual configuration management
        DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///weather.db')
        PORT = int(os.getenv('PORT', 5000))
        DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

        # Manual logging setup
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)

        # Manual metrics
        weather_requests = Counter('weather_requests_total', 'Total weather requests')

        @app.route('/weather/<city>')
        def get_weather(city):
            weather_requests.inc()
            logger.info(f"Weather request for city: {city}")

            # Weather logic
            return jsonify({
                "city": city,
                "temperature": "25°C",
                "condition": "Sunny"
            })

        @app.route('/health')
        def health_check():
            return jsonify({"status": "healthy"})

        @app.route('/metrics')
        def metrics():
            return generate_latest()

        if __name__ == '__main__':
            app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
        ```

    === "Jac Production Ready"
        <div class="code-block">
        ```jac
        # weather_api.jac - Production ready out of the box
        import from os { getenv }
        import from datetime { datetime }

        node WeatherData {
            has city: str;
            has temperature: float;
            has condition: str;
            has last_updated: str;
        }

        walker get_weather {
            has city: str;

            can fetch_weather with `root entry {
                # Check cache first
                cached = [-->](`?WeatherData)(?city == self.city);

                if cached {
                    weather = cached[0];
                    report {
                        "city": weather.city,
                        "temperature": f"{weather.temperature}°C",
                        "condition": weather.condition,
                        "cached": true,
                        "last_updated": weather.last_updated
                    };
                } else {
                    # Simulate weather API call
                    new_weather = WeatherData(
                        city=self.city,
                        temperature=25.0,
                        condition="Sunny",
                        last_updated=datetime.now().isoformat()
                    );
                    here ++> new_weather;

                    report {
                        "city": self.city,
                        "temperature": "25.0°C",
                        "condition": "Sunny",
                        "cached": false,
                        "last_updated": new_weather.last_updated
                    };
                }
            }
        }

        walker health_check {
            can check_health with `root entry {
                report {
                    "status": "healthy",
                    "timestamp": datetime.now().isoformat(),
                    "service": "weather-api"
                };
            }
        }
        ```
        </div>

---

## Containerizing with Docker

Docker provides a consistent environment for running your Jac applications across different platforms and deployment environments.

### Basic Docker Setup

!!! example "Docker Configuration"
    === "Dockerfile"
        ```dockerfile
        # Dockerfile
        FROM python:3.11-slim

        # Set working directory
        WORKDIR /app

        # Install system dependencies
        RUN apt-get update && apt-get install -y \
            gcc \
            && rm -rf /var/lib/apt/lists/*

        # Copy requirements first for better caching
        COPY requirements.txt .
        RUN pip install --no-cache-dir -r requirements.txt

        # Copy application code
        COPY . .

        # Create non-root user
        RUN useradd -m -u 1000 jacuser && chown -R jacuser:jacuser /app
        USER jacuser

        # Expose port
        EXPOSE 8000

        # Health check
        HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
            CMD curl -f http://localhost:8000/walker/health_check || exit 1

        # Run the application
        CMD ["jac", "serve", "weather_api.jac", "--host", "0.0.0.0", "--port", "8000"]
        ```

    === "requirements.txt"
        ```txt
        jaclang>=0.7.15
        fastapi>=0.104.1
        uvicorn[standard]>=0.24.0
        python-dotenv>=1.0.0
        psycopg2-binary>=2.9.7
        redis>=5.0.0
        ```

    === "docker-compose.yml"
        ```yaml
        version: '3.8'

        services:
          weather-api:
            build: .
            ports:
              - "8000:8000"
            environment:
              - DATABASE_URL=postgresql://user:password@db:5432/weather
              - REDIS_URL=redis://redis:6379
              - DEBUG=false
            depends_on:
              - db
              - redis
            volumes:
              - ./logs:/app/logs

          db:
            image: postgres:15
            environment:
              POSTGRES_USER: user
              POSTGRES_PASSWORD: password
              POSTGRES_DB: weather
            volumes:
              - postgres_data:/var/lib/postgresql/data
            ports:
              - "5432:5432"

          redis:
            image: redis:7-alpine
            ports:
              - "6379:6379"

        volumes:
          postgres_data:
        ```

### Building and Running

```bash
# Build the Docker image
docker build -t weather-api:latest .

# Run with docker-compose
docker-compose up -d

# Test the deployment
curl -X POST http://localhost:8000/walker/get_weather \
  -H "Content-Type: application/json" \
  -d '{"city": "New York"}'

# Check health
curl -X POST http://localhost:8000/walker/health_check \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Kubernetes Deployment

Kubernetes provides orchestration, scaling, and management capabilities for containerized applications in production.

### Kubernetes Manifests

!!! example "Kubernetes Configuration"
    === "deployment.yaml"
        ```yaml
        # deployment.yaml
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: weather-api
          labels:
            app: weather-api
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: weather-api
          template:
            metadata:
              labels:
                app: weather-api
            spec:
              containers:
              - name: weather-api
                image: weather-api:latest
                ports:
                - containerPort: 8000
                env:
                - name: DATABASE_URL
                  valueFrom:
                    secretKeyRef:
                      name: weather-secrets
                      key: database-url
                - name: DEBUG
                  value: "false"
                resources:
                  requests:
                    memory: "256Mi"
                    cpu: "250m"
                  limits:
                    memory: "512Mi"
                    cpu: "500m"
                livenessProbe:
                  httpGet:
                    path: /walker/health_check
                    port: 8000
                  initialDelaySeconds: 30
                  periodSeconds: 10
                readinessProbe:
                  httpGet:
                    path: /walker/health_check
                    port: 8000
                  initialDelaySeconds: 5
                  periodSeconds: 5
        ```

    === "service.yaml"
        ```yaml
        # service.yaml
        apiVersion: v1
        kind: Service
        metadata:
          name: weather-api-service
        spec:
          selector:
            app: weather-api
          ports:
            - protocol: TCP
              port: 80
              targetPort: 8000
          type: LoadBalancer
        ```

    === "secrets.yaml"
        ```yaml
        # secrets.yaml
        apiVersion: v1
        kind: Secret
        metadata:
          name: weather-secrets
        type: Opaque
        data:
          database-url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc3dvcmRAZGI6NTQzMi93ZWF0aGVy
        ```

### Deployment Commands

```bash
# Create namespace
kubectl create namespace weather-app

# Apply configurations
kubectl apply -f secrets.yaml -n weather-app
kubectl apply -f deployment.yaml -n weather-app
kubectl apply -f service.yaml -n weather-app

# Check deployment status
kubectl get pods -n weather-app
kubectl get services -n weather-app

# Scale the deployment
kubectl scale deployment weather-api --replicas=5 -n weather-app

# View logs
kubectl logs -f deployment/weather-api -n weather-app
```

---

## Configuration Management

Production applications require sophisticated configuration management to handle different environments and sensitive data.

### Environment Configuration

!!! example "Production Configuration"
    === "Jac Configuration"
        <div class="code-block">
        ```jac
        # config.jac
        import from os { getenv }

        enum Environment {
            DEVELOPMENT = "development",
            STAGING = "staging",
            PRODUCTION = "production"
        }

        obj Config {
            has environment: Environment;
            has database_url: str;
            has redis_url: str;
            has debug: bool;
            has log_level: str;
            has max_connections: int;

            can __init__() {
                env_str = getenv("ENVIRONMENT", "development");
                self.environment = Environment(env_str);

                self.database_url = getenv(
                    "DATABASE_URL",
                    "sqlite:///./weather.db"
                );

                self.redis_url = getenv(
                    "REDIS_URL",
                    "redis://localhost:6379"
                );

                self.debug = getenv("DEBUG", "false").lower() == "true";
                self.log_level = getenv("LOG_LEVEL", "INFO");
                self.max_connections = int(getenv("MAX_CONNECTIONS", "100"));
            }

            can is_production() -> bool {
                return self.environment == Environment.PRODUCTION;
            }
        }

        # Global config instance
        glob app_config = Config();
        ```
        </div>

    === "Python Equivalent"
        ```python
        # config.py
        import os
        from enum import Enum

        class Environment(Enum):
            DEVELOPMENT = "development"
            STAGING = "staging"
            PRODUCTION = "production"

        class Config:
            def __init__(self):
                env_str = os.getenv("ENVIRONMENT", "development")
                self.environment = Environment(env_str)

                self.database_url = os.getenv(
                    "DATABASE_URL",
                    "sqlite:///./weather.db"
                )

                self.redis_url = os.getenv(
                    "REDIS_URL",
                    "redis://localhost:6379"
                )

                self.debug = os.getenv("DEBUG", "false").lower() == "true"
                self.log_level = os.getenv("LOG_LEVEL", "INFO")
                self.max_connections = int(os.getenv("MAX_CONNECTIONS", "100"))

            def is_production(self):
                return self.environment == Environment.PRODUCTION

        # Global config instance
        app_config = Config()
        ```

### Environment Files

!!! example "Environment Configuration Files"
    === ".env.development"
        ```bash
        # .env.development
        ENVIRONMENT=development
        DATABASE_URL=sqlite:///./weather_dev.db
        REDIS_URL=redis://localhost:6379
        DEBUG=true
        LOG_LEVEL=DEBUG
        MAX_CONNECTIONS=10
        ```

    === ".env.production"
        ```bash
        # .env.production
        ENVIRONMENT=production
        DATABASE_URL=postgresql://user:pass@prod-db:5432/weather
        REDIS_URL=redis://prod-redis:6379
        DEBUG=false
        LOG_LEVEL=INFO
        MAX_CONNECTIONS=100
        SECRET_KEY=your-production-secret-key
        ```

---

## Monitoring and Observability

Production systems require comprehensive monitoring to ensure reliability and performance.

### Built-in Monitoring

!!! example "Monitoring Walker"
    <div class="code-block">
    ```jac
    # monitoring.jac
    import from datetime { datetime }
    import from time { time }

    node MetricEntry {
        has name: str;
        has value: float;
        has timestamp: str;
        has labels: dict = {};
    }

    walker record_metric {
        has metric_name: str;
        has value: float;
        has labels: dict = {};

        can record_metric_entry with `root entry {
            metric = MetricEntry(
                name=self.metric_name,
                value=self.value,
                timestamp=datetime.now().isoformat(),
                labels=self.labels
            );
            here ++> metric;

            report {
                "metric": self.metric_name,
                "value": self.value,
                "recorded_at": metric.timestamp
            };
        }
    }

    walker get_metrics {
        has metric_name: str = "";
        has limit: int = 100;

        can fetch_metrics with `root entry {
            all_metrics = [-->](`?MetricEntry);

            if self.metric_name {
                filtered_metrics = [
                    m for m in all_metrics
                    if m.name == self.metric_name
                ];
            } else {
                filtered_metrics = all_metrics;
            }

            recent_metrics = filtered_metrics[-self.limit:];

            report {
                "metrics": [
                    {
                        "name": m.name,
                        "value": m.value,
                        "timestamp": m.timestamp,
                        "labels": m.labels
                    }
                    for m in recent_metrics
                ],
                "total": len(filtered_metrics)
            };
        }
    }

    # Enhanced weather walker with metrics
    walker get_weather_with_metrics {
        has city: str;

        can fetch_weather_with_monitoring with `root entry {
            start_time = time();

            # Record request metric
            record_metric(
                metric_name="weather_requests_total",
                value=1.0,
                labels={"city": self.city}
            ) spawn here;

            # Get weather data
            cached = [-->](`?WeatherData)(?city == self.city);

            if cached {
                weather = cached[0];
                cache_hit = true;
            } else {
                weather = WeatherData(
                    city=self.city,
                    temperature=25.0,
                    condition="Sunny",
                    last_updated=datetime.now().isoformat()
                );
                here ++> weather;
                cache_hit = false;
            }

            # Record response time
            response_time = time() - start_time;
            record_metric(
                metric_name="weather_response_time_seconds",
                value=response_time,
                labels={"city": self.city, "cache_hit": str(cache_hit)}
            ) spawn here;

            # Record cache hit/miss
            record_metric(
                metric_name="weather_cache_hit_total" if cache_hit else "weather_cache_miss_total",
                value=1.0,
                labels={"city": self.city}
            ) spawn here;

            report {
                "city": weather.city,
                "temperature": f"{weather.temperature}°C",
                "condition": weather.condition,
                "cached": cache_hit,
                "response_time_ms": round(response_time * 1000, 2)
            };
        }
    }
    ```
    </div>

---

## CI/CD Patterns

Continuous Integration and Deployment automate the process of testing and deploying your applications.

### GitHub Actions Pipeline

!!! example "CI/CD Configuration"
    === ".github/workflows/deploy.yml"
        ```yaml
        # .github/workflows/deploy.yml
        name: Deploy Weather API

        on:
          push:
            branches: [main]
          pull_request:
            branches: [main]

        jobs:
          test:
            runs-on: ubuntu-latest

            steps:
            - uses: actions/checkout@v3

            - name: Set up Python
              uses: actions/setup-python@v4
              with:
                python-version: '3.11'

            - name: Install dependencies
              run: |
                pip install -r requirements.txt
                pip install pytest

            - name: Run tests
              run: |
                jac test weather_api.jac
                pytest tests/

            - name: Lint code
              run: |
                jac check weather_api.jac

          build:
            needs: test
            runs-on: ubuntu-latest
            if: github.ref == 'refs/heads/main'

            steps:
            - uses: actions/checkout@v3

            - name: Build Docker image
              run: |
                docker build -t weather-api:${{ github.sha }} .
                docker tag weather-api:${{ github.sha }} weather-api:latest

            - name: Push to registry
              run: |
                echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
                docker push weather-api:${{ github.sha }}
                docker push weather-api:latest

          deploy:
            needs: build
            runs-on: ubuntu-latest
            if: github.ref == 'refs/heads/main'

            steps:
            - uses: actions/checkout@v3

            - name: Deploy to Kubernetes
              run: |
                echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
                export KUBECONFIG=kubeconfig

                # Update image in deployment
                kubectl set image deployment/weather-api \
                  weather-api=weather-api:${{ github.sha }} \
                  -n weather-app

                # Wait for rollout
                kubectl rollout status deployment/weather-api -n weather-app
        ```

    === "tests/test_weather.py"
        ```python
        # tests/test_weather.py
        import pytest
        import subprocess
        import json

        def test_health_check():
            """Test the health check endpoint"""
            result = subprocess.run([
                'jac', 'run', 'weather_api.jac',
                '--walker', 'health_check'
            ], capture_output=True, text=True)

            assert result.returncode == 0
            response = json.loads(result.stdout)
            assert response['status'] == 'healthy'

        def test_weather_endpoint():
            """Test weather data retrieval"""
            result = subprocess.run([
                'jac', 'run', 'weather_api.jac',
                '--walker', 'get_weather',
                '--ctx', '{"city": "London"}'
            ], capture_output=True, text=True)

            assert result.returncode == 0
            response = json.loads(result.stdout)
            assert response['city'] == 'London'
            assert 'temperature' in response
            assert 'condition' in response
        ```

### Deployment Commands

```bash
# Local testing
jac test weather_api.jac
pytest tests/

# Build and test locally
docker build -t weather-api:test .
docker run -d -p 8000:8000 weather-api:test

# Test the deployed container
curl -X POST http://localhost:8000/walker/health_check \
  -H "Content-Type: application/json" \
  -d '{}'

# Production deployment (automated via CI/CD)
git add .
git commit -m "Deploy weather API v1.2.0"
git push origin main
```

---

## Key Takeaways

!!! summary "What We've Learned"
    - **Environment Strategy**: Different configurations for development, staging, and production
    - **Containerization**: Docker provides consistent deployment environments
    - **Orchestration**: Kubernetes handles scaling and management
    - **Configuration Management**: Environment variables and secrets for flexibility
    - **Monitoring**: Built-in metrics and observability patterns
    - **Automation**: CI/CD pipelines for reliable deployments

### Next Steps

In the upcoming chapters, we'll explore:
- **Chapter 20**: Performance optimization for production workloads
- **Chapter 21**: Building complete real-world applications
- **Chapter 22**: Advanced monitoring and troubleshooting

!!! tip "Try It Yourself"
    Deploy your own weather API by:
    - Setting up a local Docker environment
    - Creating a simple Kubernetes cluster
    - Implementing basic monitoring
    - Setting up a CI/CD pipeline

    Remember: Start simple and add complexity gradually as your application grows!

---

*Ready to optimize for performance? Continue to [Chapter 20: Performance Optimization](chapter_20.md)!*
