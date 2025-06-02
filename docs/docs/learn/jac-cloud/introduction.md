# Introduction

## Introduction to Jac Cloud

Jac Cloud is a powerful cloud-native framework that transforms your Jac applications into production-ready API servers with minimal configuration. It bridges the gap between local Jac development and scalable cloud deployment, providing enterprise-grade features out of the box.

## What is Jac Cloud?

Jac Cloud extends the Jac programming language with cloud-native capabilities, allowing you to deploy your Jac applications as RESTful APIs, WebSocket services, and scheduled tasks. Simply replace `jac run` with `jac serve` and your application becomes a fully-featured web service.

## Key Features

### **Instant API Generation**
- Automatically converts Jac walkers into REST endpoints
- Supports all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Built-in OpenAPI/Swagger documentation at `/docs`

### **Authentication & Authorization**
- Token-based authentication system
- Role-based access control
- Configurable endpoint security

### **Real-time Communication**
- WebSocket support for real-time applications
- Channel-based messaging
- Client and user notification systems

### **Task Scheduling**
- Cron-based scheduling
- Interval-based tasks
- One-time date triggers

### **Production-Ready Features**
- Comprehensive logging with Elastic integration
- Environment variable configuration
- Health monitoring and metrics
- File upload support

### **Cloud Integration**
- Kubernetes deployment support
- Docker containerization
- ConfigMap-based configuration
- Horizontal scaling capabilities

## Getting Started

The simplest way to start with Jac Cloud is to take an existing Jac application and serve it:

```bash
# Instead of running locally
jac run main.jac

# Serve as an API
jac serve main.jac
```

Your application will be available at `http://localhost:8000` with automatic API documentation at `http://localhost:8000/docs`.

## Architecture

Jac Cloud follows a modular architecture that includes:

- **Walker Endpoints**: Automatic REST API generation from walker declarations
- **WebSocket Manager**: Real-time bidirectional communication
- **Scheduler**: Background task execution
- **Authentication System**: Secure access control
- **Logging Framework**: Comprehensive request/response logging

## Use Cases

Jac Cloud is perfect for:

- **Microservices**: Build scalable, independent services
- **Real-time Applications**: Chat systems, live updates, notifications
- **Data Processing APIs**: Transform and analyze data at scale
- **AI/ML Services**: Deploy machine learning models as APIs
- **IoT Backends**: Handle device communication and data ingestion
- **Task Automation**: Scheduled data processing and workflows

## Next Steps

Ready to get started? Check out our [Getting Started Guide](quickstart.md) to build your first Jac Cloud application, or explore specific features:

- [Walker Endpoints and API Configuration](quickstart.md#walker-endpoints)
- [WebSocket Real-time Communication](websocket.md)
- [Task Scheduling](scheduler.md)
- [Kubernetes Deployment](deployment.md)
- [Logging and Monitoring](logging.md)

## Community and Support

Jac Cloud is part of the larger Jaseci ecosystem. Join our community to get help, share your projects, and contribute to the platform's growth.

---

*Transform your Jac applications into production-ready cloud services with Jac Cloud's powerful, yet simple framework.*