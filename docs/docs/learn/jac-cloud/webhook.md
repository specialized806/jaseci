# Webhooks: External API Integration

## What Are Webhooks?

Webhooks in Jac Cloud provide a secure way to expose your API endpoints to external services without requiring user authentication. Instead, webhooks use API keys for authentication, making them ideal for:

- System-to-system integrations
- Third-party service connections
- Automated workflows
- IoT device communication
- CI/CD pipelines

<!-- ![Webhook Integration Diagram](https://via.placeholder.com/800x300?text=Webhook+Integration+Diagram) -->

## Key Concepts for Beginners

- **Webhook Walkers**: Similar to normal walkers but authenticated via API keys instead of user tokens
- **API Key Management**: Keys are created and managed by users through dedicated endpoints
- **Flexible Authentication**: API keys can be passed via headers, query parameters, URL paths, or in the request body
- **Security Controls**: Keys can be restricted to specific walkers, nodes, and have configurable expiration dates

## Creating Your First Webhook (3 Steps)

### Step 1: Create a Webhook Walker

Add the `webhook` property to your walker's `__specs__` configuration:

```jac
walker webhook_example {
    has data: str;

    can enter with `root entry {
        report "Webhook executed successfully with data: " + self.data;
    }

    class __specs__ {
        has webhook: dict = {
            "type": "header",  // Where to look for the API key
            "name": "X-API-KEY"  // Name of the parameter containing the key
        };
    }
}
```

### Step 2: Generate an API Key

Send a POST request to `/webhook/generate-key`:

```bash
curl -X POST 'http://localhost:8000/webhook/generate-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-first-webhook",
    "walkers": ["webhook_example"],
    "expiration": {
      "count": 30,
      "interval": "days"
    }
  }'
```

You'll receive a response with your new API key:

```json
{
  "id": "672203ee093fd3d208a4b6d4",
  "name": "my-first-webhook",
  "key": "6721f000ee301e1d54c3de3d:1730282478:P4Nrs3DOLIkaw5aYsbIWNzWZZAwEyb20"
}
```

### Step 3: Test Your Webhook

```bash
curl -X POST 'http://localhost:8000/webhook/walker/webhook_example' \
  -H 'X-API-KEY: 6721f000ee301e1d54c3de3d:1730282478:P4Nrs3DOLIkaw5aYsbIWNzWZZAwEyb20' \
  -H 'Content-Type: application/json' \
  -d '{
    "data": "Hello from webhook!"
  }'
```

## Webhook Configuration Options

| **Field** | **Type** | **Description** | **Default** |
|-----------|----------|-----------------|-------------|
| `type` | `str` | Where to look for the API key: `"header"`, `"query"`, `"path"`, or `"body"` | `"header"` |
| `name` | `str` | Parameter name containing the API key | `"X-API-KEY"` |

## Managing API Keys

### Creating Keys

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

### Listing Your Keys

**Endpoint**: `GET /webhook`

**Example Response**:

```json
{
  "keys": [
    {
      "id": "672203ee093fd3d208a4b6d4",
      "name": "test",
      "root_id": "6721f000ee301e1d54c3de3d",
      "walkers": ["webhook_example"],
      "nodes": ["root"],
      "expiration": "2025-12-24T10:01:18.206000",
      "key": "6721f000ee301e1d54c3de3d:1730282478:P4Nrs3DOLIkaw5aYsbIWNzWZZAwEyb20"
    }
  ]
}
```

### Extending Key Expiration

**Endpoint**: `PATCH /webhook/extend/{id}`

**Request Body**:

```json
{
  "count": 60,
  "interval": "days"
}
```

### Deleting Keys

**Endpoint**: `DELETE /webhook/delete`

**Request Body**:

```json
{
  "ids": ["672203ee093fd3d208a4b6d4"]
}
```

## Authentication Methods (4 Ways)

Jac Cloud supports four different ways to pass API keys to webhook endpoints:

### 1. Header Authentication (Most Common)

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
curl -X 'POST' 'http://localhost:8000/webhook/walker/webhook_by_header' \
  -H 'test-key: YOUR-GENERATED-KEY'
```

### 2. Query Parameter Authentication

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
curl -X 'POST' 'http://localhost:8000/webhook/walker/webhook_by_query?test_key=YOUR-GENERATED-KEY'
```

### 3. URL Path Authentication

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
curl -X 'POST' 'http://localhost:8000/webhook/walker/webhook_by_path/YOUR-GENERATED-KEY'
```

### 4. Request Body Authentication

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
curl -X 'POST' 'http://localhost:8000/webhook/walker/webhook_by_body' \
  -H 'Content-Type: application/json' \
  -d '{"test_key": "YOUR-GENERATED-KEY"}'
```

## Security Best Practices

1. **Restrict API Keys**: Limit keys to only the specific walkers and nodes they need access to
2. **Set Appropriate Expirations**: Use shorter expiration times for sensitive operations
3. **Use Descriptive Names**: Choose meaningful names for your webhooks and API keys
4. **Rotate Keys Regularly**: Generate new keys and invalidate old ones periodically
5. **Monitor Usage**: Keep track of webhook invocations for security and debugging

## Common Webhook Use Cases

1. **GitHub/GitLab Integration**: Trigger builds or deployments on code changes
2. **Payment Processing**: Handle payment webhooks from Stripe, PayPal, etc.
3. **IoT Device Updates**: Receive data from sensors and connected devices
4. **Third-Party Integrations**: Connect with external services like Slack, Twilio
5. **Data Synchronization**: Keep systems in sync with real-time updates

## Next Steps

- Learn about [WebSocket Communication](websocket.md) for real-time features
- Explore [Task Scheduling](scheduler.md) for automated background tasks
- Set up [Logging & Monitoring](logging.md) to track webhook usage