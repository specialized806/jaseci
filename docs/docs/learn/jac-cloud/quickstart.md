# Quick Start

### Starting Your First Server

Transform any Jac application into a cloud API server with a single command:

```bash
# Basic usage
jac serve main.jac

# With custom host and port
jac serve main.jac --host 0.0.0.0 --port 8080
```

Once started, your API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## Understanding Walker Endpoints

Jac Cloud automatically converts your walker declarations into REST API endpoints. By default, each walker creates two endpoint groups:

- **Root Entry**: `/walker/{walker_name}` - Executes on the current root
- **Node Entry**: `/walker/{walker_name}/{node_id}` - Executes on a specific node

### Disabling Auto-Generation

To disable automatic endpoint generation, set the environment variable:
```bash
export DISABLE_AUTO_ENDPOINT=true
```

## Configuring Walker Specifications

Control endpoint behavior using the `__specs__` object within your walker:

```jac
walker my_walker {
    has data: str;

    obj __specs__ {
        static has methods: list = ["get", "post"];
        static has auth: bool = false;
        static has as_query: list = ["data"];
    }
}
```

## Specification Reference

### Core Configuration

| **Field** | **Type** | **Description** | **Default** |
|-----------|----------|-----------------|-------------|
| `path` | `str` | Additional path after auto-generated path | N/A |
| `methods` | `list[str]` | Allowed HTTP methods (lowercase) | `["post"]` |
| `as_query` | `str \| list[str]` | Fields to treat as query parameters. Use `"*"` for all fields | `[]` |
| `auth` | `bool` | Whether endpoint requires authentication | `true` |
| `private` | `bool` | Skip walker in auto-generation | `false` |

### Advanced Configuration

| **Field** | **Type** | **Description** | **Default** |
|-----------|----------|-----------------|-------------|
| `entry_type` | `str \| EntryType` | `"NODE"`, `"ROOT"`, or `"BOTH"` | `"BOTH"` |
| `webhook` | `dict \| None` | [Webhook configuration](jac_cloud_webhook.md) | `None` |
| `schedule` | `dict` | [Scheduler configuration](jac_cloud_scheduler.md) | `None` |

### OpenAPI/Swagger Documentation

| **Field** | **Type** | **Description** | **Default** |
|-----------|----------|-----------------|-------------|
| `tags` | `list[str] \| None` | API tags for grouping endpoints | `None` |
| `summary` | `str \| None` | Brief endpoint description | `None` |
| `description` | `str \| None` | Detailed endpoint description (supports Markdown) | `None` |
| `status_code` | `int \| None` | Default response status code | `None` |
| `response_description` | `str` | Default response description | `"Successful Response"` |
| `responses` | `dict \| None` | Additional response definitions | `None` |
| `deprecated` | `bool \| None` | Mark endpoint as deprecated | `None` |
| `name` | `str \| None` | Internal operation name | `None` |
| `openapi_extra` | `dict \| None` | Extra OpenAPI metadata | `None` |

## Examples

### Basic Examples

```jac
import from jac_cloud { FastAPI }

// Simple POST endpoint
walker create_user {
    has username: str;
    has email: str;
}

// GET endpoint with query parameters
walker search_users {
    has query: str;
    has limit: int = 10;

    obj __specs__ {
        static has methods: list = ["get"];
        static has as_query: list = ["query", "limit"];
    }
}

// Public endpoint (no authentication)
walker public_info {
    obj __specs__ {
        static has methods: list = ["get"];
        static has auth: bool = false;
    }
}
```

### Advanced Examples

```jac
// Path variables and multiple methods
walker user_operations {
    has user_id: str;
    has data: dict;

    obj __specs__ {
        static has path: str = "/{user_id}";
        static has methods: list = ["get", "put", "delete"];
        static has as_query: list = ["user_id"];
    }
}

// File upload support
walker upload_document {
    has document: UploadFile;
    has metadata: dict;
    has tags: list[str] = [];

    obj __specs__ {
        static has methods: list = ["post"];
        static has summary: str = "Upload document with metadata";
        static has tags: list = ["documents"];
    }
}

// Mixed query and body parameters
walker complex_search {
    has filters: dict;
    has sort_by: str;
    has order: str = "asc";

    obj __specs__ {
        static has methods: list = ["post"];
        static has as_query: list = ["sort_by", "order"];
        static has description: str = "Advanced search with filters and sorting";
    }
}
```

### File Handling Examples

```jac
// Single file upload
walker single_file_upload {
    has file: UploadFile;
    has description: str = "";

    can enter with `root entry {
        print(f"Received file: {self.file.filename}");
        print(f"Description: {self.description}");
    }
}

// Multiple file upload
walker multi_file_upload {
    has files: list[UploadFile];
    has category: str;

    can enter with `root entry {
        for file in self.files {
            print(f"Processing: {file.filename}");
        }
    }
}

// Mixed body and file data
walker document_with_metadata {
    has document: UploadFile;
    has title: str;
    has author: str;
    has tags: list[str] = [];

    obj __specs__ {
        static has auth: bool = false;
        static has tags: list = ["documents"];
    }
}
```

## Response Structure

### Standard Response Format

All walker endpoints return a standardized JSON response:

```json
{
    "status": 200,
    "reports": [
        "Any reports generated during walker execution"
    ],
    "returns": [
        "Walker return values (optional - requires SHOW_ENDPOINT_RETURNS=true)"
    ]
}
```

### Archetype Serialization

Jac Cloud automatically serializes walker, edge, and node archetypes:

#### Format
```python
{
    "id": {{ str : anchor ref_id }},
    "context": {{ dict : anchor archetype data }}
}
```
#### Example
```json
{
    "id": "unique_anchor_reference_id",
    "context": {
        "attribute1": "value1",
        "attribute2": "value2"
    }
}
```

## Environment Variables

Control Jac Cloud behavior with these environment variables:

- `DISABLE_AUTO_ENDPOINT=true` - Disable automatic endpoint generation
- `SHOW_ENDPOINT_RETURNS=true` - Include walker return values in responses

## Next Steps

Now that you understand the basics, explore more advanced features:

- [Authentication & Permissions](permission.md)
- [Real-time WebSocket Communication](websocket.md)
- [Task Scheduling](scheduler.md)
- [Webhook Integration](webhook.md)
- [Environment Variables](env_vars.md)
- [Logging & Monitoring](logging.md)
- [Kubernetes Deployment](cloud-orc-integration.md)