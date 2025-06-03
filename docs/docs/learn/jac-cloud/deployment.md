# Cloud Deployment Guide

## What is Kubernetes Deployment?

Kubernetes deployment allows you to run your Jac applications in a cloud environment, providing benefits like:

- **Scalability**: Run multiple instances of your app to handle more users
- **Reliability**: Automatic recovery from failures
- **Resource Efficiency**: Optimal use of computing resources
- **Easy Updates**: Deploy new versions without downtime
- **Centralized Management**: Control multiple services from one place

## Getting Started: Prerequisites

Before beginning your cloud journey, make sure you have:

| Requirement | Description | How to Get It |
|-------------|-------------|---------------|
| **Kubernetes Cluster** | A running Kubernetes cluster | [DigitalOcean](https://www.digitalocean.com/products/kubernetes/), [AWS EKS](https://aws.amazon.com/eks/), [Google GKE](https://cloud.google.com/kubernetes-engine) |
| **kubectl** | The Kubernetes command-line tool | [Install Guide](https://kubernetes.io/docs/tasks/tools/) |
| **Docker** | For building container images | [Install Docker](https://docs.docker.com/get-docker/) |
| **OpenAI API Key** | Optional, for AI features | [OpenAI Platform](https://platform.openai.com/) |

## What's Included

The Jac Cloud Kubernetes deployment includes:

- A pre-configured Docker image with all dependencies
- Ready-to-use Kubernetes configuration files
- Easy configuration through environment variables
- Support for dynamic module loading

## Deployment in 5 Simple Steps

### Step 1: Build Your Docker Image

```bash
# Build the image
docker build -t your-username/jac-cloud:latest -f jac-cloud/scripts/Dockerfile .

# Push to a registry (Docker Hub, AWS ECR, etc.)
docker push your-username/jac-cloud:latest
```

!!! tip "Time-Saving Option"
    If you're just getting started, you can use the official Jaseci image: `jaseci/jac-cloud:latest`

### Step 2: Configure Your Application

Create a ConfigMap with your application settings:

```bash
kubectl apply -f jac-cloud/scripts/module-config.yml
```

This creates:
- A dedicated namespace for your app
- Configuration for dynamic module loading

### Step 3: Deploy Your Application

```bash
kubectl apply -f jac-cloud/scripts/jac-cloud.yml
```

This creates all the necessary resources:
- Deployment with your container
- Service account with appropriate permissions
- Network services and routes

### Step 4: Add API Keys (Optional)

If your application uses OpenAI or other services:

```bash
# Convert your API key to base64
echo -n "your-openai-key" | base64
# Output: eW91ci1vcGVuYWkta2V5

# Update the key in your deployment file
# Edit jac-cloud.yml and replace the openai-key value
```

### Step 5: Verify Your Deployment

```bash
# Check if everything is running
kubectl get all -n littlex

# Check your application logs
kubectl logs -f deployment/jac-cloud -n littlex
```

## Troubleshooting Common Issues

### Pod Not Starting

If your pod doesn't start:

```bash
# Get more details about the pod
kubectl describe pod -l app=jac-cloud -n littlex
```

Look for:
- **ImagePullBackOff**: Image name is incorrect or not accessible
- **CrashLoopBackOff**: Application is crashing after starting
- **Pending**: Not enough resources in the cluster

### Configuration Problems

If your application doesn't work correctly:

```bash
# Check the ConfigMap
kubectl get configmap module-config -n littlex -o yaml

# Check environment variables
kubectl exec -it deploy/jac-cloud -n littlex -- env
```

### Network Issues

If you can't connect to your application:

```bash
# Check the service
kubectl get service jac-cloud -n littlex

# Test network connectivity
kubectl exec -it deploy/jac-cloud -n littlex -- curl localhost:8000
```

## Advanced Operations

### Scaling Your Application

To handle more users by running multiple copies:

```bash
# Run 3 copies of your application
kubectl scale deployment jac-cloud --replicas=3 -n littlex
```

### Updating Your Application

To deploy a new version:

```bash
# Update the image
kubectl set image deployment/jac-cloud jac-cloud=your-username/jac-cloud:v2 -n littlex
```

### Monitoring Your Application

```bash
# Watch pod resource usage
kubectl top pod -n littlex

# Stream logs in real-time
kubectl logs -f deploy/jac-cloud -n littlex
```

### Complete Cleanup

When you're finished:

```bash
# Remove everything
kubectl delete namespace littlex
```

## Deployment Best Practices

1. **Start small**: Begin with a single replica and scale up as needed
2. **Use resource limits**: Set CPU and memory limits to prevent resource hogging
3. **Implement health checks**: Add readiness and liveness probes
4. **Set up monitoring**: Use Prometheus and Grafana for insights
5. **Automate deployments**: Use CI/CD pipelines for automated updates

## Next Steps

- Learn about [Environment Variables](env_vars.md) for configuring your app
- Set up [Logging](logging.md) for monitoring your deployment
- Implement [WebSockets](websocket.md) for real-time features
- Explore [Task Scheduling](scheduler.md) for background processing