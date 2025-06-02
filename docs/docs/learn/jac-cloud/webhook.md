# Webhooks in Jac Cloud

## Overview

Webhooks in Jac Cloud provide a secure way to expose your API endpoints to external services without requiring user authentication. Instead, webhooks use API keys for authentication, making them ideal for system-to-system integrations, third-party services, and automated workflows.

## Key Concepts

- **Webhook Walkers**: Similar to normal walkers but authenticated via API keys instead of user tokens
- **API Key Management**: Keys are created and managed by users through dedicated endpoints
- **Flexible Authentication**: API keys can be passed via headers, query parameters, URL paths, or in the request body
- **Security Controls**: Keys can be restricted to specific walkers, nodes, and have configurable expiration dates

## Creating Webhook Walkers

To create a webhook walker, add the `webhook` property to your walker's `__specs__` configuration:

```jac
walker webhook_example {
    can enter with `root entry {
        report "Webhook executed successfully!";
    }

    class __specs__ {
        has webhook: dict = {
            "type": "header",  // Where to look for the API key
            "name": "X-API-KEY"  // Name of the parameter containing the key
        };
    }
}
```

### Webhook Configuration Options

| **Field** | **Type** | **Description** | **Default** |
|-----------|----------|-----------------|-------------|
| `type` | `str` | Where to look for the API key: `"header"`, `"query"`, `"path"`, or `"body"` | `"header"` |
| `name` | `str` | Parameter name containing the API key | `"X-API-KEY"` |

## Managing API Keys

Jac Cloud provides dedicated endpoints for managing webhook API keys.

### Generating API Keys

**Endpoint**: `POST /webhook/generate-key`

**Request Body**:

```json
{
  "name": "webhook1",
  "walkers": ["webhook_example"],
  "nodes": ["root"],
  "expiration": {
    "count": 60,
    "interval": "days"
  }
}
```

| **Field** | **Type** | **Description** | **Required** |
|-----------|----------|-----------------|------------|
| `name` | `str` | Unique name for the webhook key | Yes |
| `walkers` | `list[str]` | Allowed webhook walkers (empty = all) | No |
| `nodes` | `list[str]` | Allowed nodes (empty = all) | No |
| `expiration.count` | `int` | Time value for expiration | Yes |
| `expiration.interval` | `str` | Time unit: `"seconds"`, `"minutes"`, `"hours"`, `"days"` | Yes |

**Response**:

```json
{
  "id": "672203ee093fd3d208a4b6d4",
  "name": "webhook1",
  "key": "6721f000ee301e1d54c3de3d:1730282478:P4Nrs3DOLIkaw5aYsbIWNzWZZAwEyb20"
}
```

### Listing API Keys

**Endpoint**: `GET /webhook`

**Response**:

```json
{
  "keys": [
    {
      "id": "672203ee093fd3d208a4b6d4",
      "name": "test",
      "root_id": "6721f000ee301e1d54c3de3d",
      "walkers": ["webhook"],
      "nodes": ["root"],
      "expiration": "2025-12-24T10:01:18.206000",
      "key": "6721f000ee301e1d54c3de3d:1730282478:P4Nrs3DOLIkaw5aYsbIWNzWZZAwEyb20"
    }
  ]
}
```

### Extending API Key Expiration

**Endpoint**: `PATCH /webhook/extend/{id}`

**Request Body**:

```json
{
  "count": 60,
  "interval": "days"
}
```

**Response**:

```json
{
  "message": "Successfully Extended!"
}
```

### Deleting API Keys

**Endpoint**: `DELETE /webhook/delete`

**Request Body**:

```json
{
  "ids": ["672203ee093fd3d208a4b6d4"]
}
```

**Response**:

```json
{
  "message": "Successfully Deleted!"
}
```

## Authentication Methods

Jac Cloud supports four different ways to pass API keys to webhook endpoints:

### 1. Header Authentication (Default)

**Walker Definition**:

```jac
walker webhook_by_header {
    can enter with `root entry {
        report "Header authentication successful!";
    }

    class __specs__ {
        has webhook: dict = {
            "type": "header",
            "name": "test-key"
        };
    }
}
```

**Example Request**:

```bash
curl -X 'POST' 'http://localhost:8001/webhook/walker/webhook_by_header' \
  -H 'test-key: YOUR-GENERATED-KEY'
```

### 2. Query Parameter Authentication

**Walker Definition**:

```jac
walker webhook_by_query {
    can enter with `root entry {
        report "Query authentication successful!";
    }

    class __specs__ {
        has webhook: dict = {
            "type": "query",
            "name": "test_key"
        };
    }
}
```

**Example Request**:

```bash
curl -X 'POST' 'http://localhost:8001/webhook/walker/webhook_by_query?test_key=YOUR-GENERATED-KEY'
```

### 3. URL Path Authentication

**Walker Definition**:

```jac
walker webhook_by_path {
    can enter with `root entry {
        report "Path authentication successful!";
    }

    class __specs__ {
        has webhook: dict = {
            "type": "path",
            "name": "test_key"  // Must match path variable name
        },
        path: str = "/{test_key}";
    }
}
```

**Example Request**:

```bash
curl -X 'POST' 'http://localhost:8001/webhook/walker/webhook_by_path/YOUR-GENERATED-KEY'
```

### 4. Request Body Authentication

**Walker Definition**:

```jac
walker webhook_by_body {
    can enter with `root entry {
        report "Body authentication successful!";
    }

    class __specs__ {
        has webhook: dict = {
            "type": "body",
            "name": "test_key"
        };
    }
}
```

**Example Request**:

```bash
curl -X 'POST' 'http://localhost:8001/webhook/walker/webhook_by_body' \
  -H 'Content-Type: application/json' \
  -d '{"test_key": "YOUR-GENERATED-KEY"}'
```

## Best Practices

1. **Restrict API Keys**: Limit keys to only the specific walkers and nodes they need access to
2. **Set Appropriate Expirations**: Use shorter expiration times for sensitive operations
3. **Use Descriptive Names**: Choose meaningful names for your webhooks and API keys
4. **Rotate Keys Regularly**: Generate new keys and invalidate old ones periodically
5. **Monitor Usage**: Keep track of webhook invocations for security and debugging

## Security Considerations

- API keys are exposed in requests and should be treated as sensitive information
- Use HTTPS in production to prevent keys from being intercepted
- Consider using header-based authentication when possible as it's less visible in logs
- Implement IP restrictions at the network level for additional security