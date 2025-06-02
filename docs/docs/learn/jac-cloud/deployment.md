# Kubernetes Deployment Guide

## Overview

The Jac Cloud Kubernetes deployment provides a streamlined way to run your Jac applications in a cloud environment using the `jac-splice-orc` plugin. This setup includes:

1. A Docker image with all necessary dependencies
2. Kubernetes configurations for creating required resources
3. Dynamic configuration through environment variables and ConfigMaps

## Prerequisites

Before you begin, make sure you have:

- **Kubernetes Cluster**: Access to a Kubernetes cluster
- **kubectl**: The Kubernetes command-line tool installed
- **Docker**: Docker installed for building and pushing images (if needed)
- **OpenAI API Key**: Optional, for applications using OpenAI services

## Directory Structure

```
jac-cloud/
├── scripts/
│   ├── Dockerfile              # Container image definition
│   ├── init_jac_cloud.sh       # Initialization script
│   ├── jac-cloud.yml           # Main Kubernetes configuration
│   ├── module-config.yml       # Module configuration
```

## Deployment Guide

### Step 1: Build and Push the Docker Image

Build the Jac Cloud Docker image using the provided Dockerfile:

```bash
docker build -t your-dockerhub-username/jac-cloud:latest -f jac-cloud/scripts/Dockerfile .
docker push your-dockerhub-username/jac-cloud:latest
```

Update the `image` field in `jac-cloud.yml` with your Docker image path.

### Step 2: Apply the ConfigMap

The ConfigMap contains module-specific settings for your application:

```bash
kubectl apply -f jac-cloud/scripts/module-config.yml
```

This will:
- Create the `littlex` namespace if it doesn't exist
- Apply the module configuration

### Step 3: Deploy the Application

Apply the main Kubernetes configuration:

```bash
kubectl apply -f jac-cloud/scripts/jac-cloud.yml
```

This creates:
- RBAC roles and bindings
- Service account
- Deployment with appropriate resources
- Other required Kubernetes objects

### Step 4: Add OpenAI API Key (Optional)

If your application uses OpenAI services:

1. Convert your API key to base64:
   ```bash
   echo -n "your-openai-key" | base64
   ```

2. Replace the base64 value in the `data.openai-key` field in `jac-cloud.yml`

3. Apply the updated configuration:
   ```bash
   kubectl apply -f jac-cloud/scripts/jac-cloud.yml
   ```

### Step 5: Verify the Deployment

Confirm that all resources were created successfully:

```bash
kubectl get all -n littlex
```

You should see the `jac-cloud` pod running along with its associated resources.

## Configuration Reference

### Environment Variables

| **Variable** | **Description** | **Default Value** |
|--------------|-----------------|-------------------|
| `NAMESPACE` | Target namespace for the deployment | `default` |
| `CONFIGMAP_NAME` | Name of the ConfigMap to mount | `module-config` |
| `FILE_NAME` | JAC file to execute in the pod | `example.jac` |
| `OPENAI_API_KEY` | OpenAI API key (from secret) | None |

### Module Configuration

The `module-config.yml` file defines configurations for dynamically loaded modules:

```json
{
  "numpy": {
    "lib_mem_size_req": "100Mi",
    "dependency": [],
    "lib_cpu_req": "500m",
    "load_type": "remote"
  },
  "transformers": {
    "lib_mem_size_req": "2000Mi",
    "dependency": ["torch", "transformers"],
    "lib_cpu_req": "1.0",
    "load_type": "remote"
  },
  "sentence_transformers": {
    "lib_mem_size_req": "2000Mi",
    "dependency": ["sentence-transformers"],
    "lib_cpu_req": "1.0",
    "load_type": "remote"
  }
}
```

## Troubleshooting

### Verifying Resources

#### Check the Namespace
```bash
kubectl get namespaces
```

#### Check the ConfigMap
```bash
kubectl get configmap -n littlex
```

#### Check the Deployment
```bash
kubectl get pods -n littlex
```

### Common Issues

1. **Pod not starting**: Check events with `kubectl describe pod <pod-name> -n littlex`
2. **Missing ConfigMap**: Ensure you applied the module-config.yml file first
3. **Permission errors**: Verify the RBAC settings in jac-cloud.yml

## Advanced Operations

### Updating Configurations

To update the ConfigMap or deployment:

1. Modify the respective YAML file
2. Apply the changes:
   ```bash
   kubectl apply -f jac-cloud/scripts/module-config.yml
   kubectl apply -f jac-cloud/scripts/jac-cloud.yml
   ```

### Viewing Logs

Monitor the logs of the Jac Cloud pod:
```bash
kubectl logs -f deployment/jac-cloud -n littlex
```

### Scaling the Deployment

To handle more load by running multiple replicas:
```bash
kubectl scale deployment jac-cloud --replicas=3 -n littlex
```

### Cleanup

To remove all resources when you're done:
```bash
kubectl delete namespace littlex
```

## Next Steps

- Explore [Environment Variables](env_vars.md) for configuring your Jac Cloud application
- Learn about [WebSockets](websocket.md) for real-time communication
- Set up [Logging](logging.md) for monitoring your deployment