# Environment Variable Configuration

Jac Cloud can be customized through environment variables, allowing you to configure various aspects of your application without changing code. This guide organizes these variables by category for easier reference.

## Core Configuration

### Database Settings

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `DATABASE_HOST` | MongoDB connection string | `mongodb://localhost/?retryWrites=true&w=majority` |
| `DATABASE_PATH` | Local path for DB | `mydatabase` |
| `DATABASE_NAME` | MongoDB database name | `jaseci` |

### Redis Configuration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `REDIS_HOST` | Redis connection host | `redis://localhost` |
| `REDIS_PORT` | Redis connection port | `6379` |
| `REDIS_USER` | Redis connection username | `null` |
| `REDIS_PASS` | Redis connection password | `null` |

### API Behavior

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `DISABLE_AUTO_ENDPOINT` | Disable automatic conversion of walkers to API endpoints | `false` |
| `SHOW_ENDPOINT_RETURNS` | Include walker return values in API responses | `false` |

## Authentication & Security

### Token Configuration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `TOKEN_SECRET` | Random string used to encrypt tokens | 50 random characters |
| `TOKEN_ALGORITHM` | Algorithm used to encrypt tokens | `HS256` |
| `TOKEN_TIMEOUT` | Token expiration in hours | `12` |

### User Verification

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `RESTRICT_UNVERIFIED_USER` | Restrict user login until verified | `false` |
| `VERIFICATION_CODE_TIMEOUT` | Verification code expiration in hours | `24` |
| `RESET_CODE_TIMEOUT` | Password reset code expiration in hours | `24` |

### Email Integration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `SENDGRID_HOST` | Host used for verification/reset links | `http://localhost:8000` |
| `SENDGRID_API_KEY` | SendGrid API key | `null` |

## Data Management

### Graph Optimization

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `DISABLE_AUTO_CLEANUP` | Disable automatic deletion of disconnected nodes | `false` |
| `SINGLE_QUERY` | Use individual queries instead of batch queries | `false` |

### Transaction Control

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `SESSION_MAX_TRANSACTION_RETRY` | MongoDB transaction retry count | `1` |
| `SESSION_MAX_COMMIT_RETRY` | MongoDB transaction commit retry count | `1` |

## Logging Configuration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `LOGGER_NAME` | Specified logger name | `app` |
| `LOGGER_LEVEL` | Control log level (debug, info, warning, error) | `debug` |
| `LOGGER_FILE_PATH` | Log directory and filename | `/tmp/jac_cloud_logs/jac-cloud.log` |
| `LOGGER_ROLLOVER_INTERVAL` | Rotation interval (M=minute, H=hourly, D=daily, W=weekly) | `D` |
| `LOGGER_MAX_BACKUP` | Maximum backup files before deletion (negative = unlimited) | `-1` |
| `LOGGER_ROLLOVER_MAX_FILE_SIZE` | Maximum file size in bytes before rollover | `10000000` |
| `LOGGER_USE_UTC` | Whether logger uses UTC time | `false` |

## Single Sign-On (SSO) Configuration

Jac Cloud supports various SSO providers. To configure them, use the following pattern:

```
SSO_{PLATFORM}_CLIENT_ID=your_client_id
SSO_{PLATFORM}_CLIENT_SECRET=your_client_secret
```

### Supported Platforms

- APPLE
- FACEBOOK
- FITBIT
- GITHUB
- GITLAB
- GOOGLE
- KAKAO
- LINE
- LINKEDIN
- MICROSOFT
- NAVER
- NOTION
- TWITTER
- YANDEX

### Common SSO Variables

| **Variable Pattern** | **Description** |
|----------------------|-----------------|
| `SSO_{PLATFORM}_CLIENT_ID` | Platform's client ID |
| `SSO_{PLATFORM}_CLIENT_SECRET` | Platform's client secret |
| `SSO_{PLATFORM}_ALLOW_INSECURE_HTTP` | Allow insecure HTTP connections |

### Platform-Specific Variables

| **Variable** | **Description** |
|--------------|-----------------|
| `SSO_GITLAB_BASE_ENDPOINT_URL` | GitLab base endpoint URL |
| `SSO_MICROSOFT_TENANT` | Microsoft tenant ID |

### Apple-Specific Configuration

Apple requires additional configuration for client secret generation:

| **Variable** | **Description** |
|--------------|-----------------|
| `SSO_APPLE_CLIENT_ID` | Apple client ID |
| `SSO_APPLE_CLIENT_TEAM_ID` | Apple client team ID |
| `SSO_APPLE_CLIENT_KEY` | Apple client key |
| `SSO_APPLE_CLIENT_CERTIFICATE_PATH` | Path to Apple client certificate |
| `SSO_APPLE_CLIENT_CERTIFICATE` | Raw content of Apple client certificate |

## Server Configuration (Uvicorn)

Jac Cloud uses Uvicorn as its ASGI server. You can configure it with these variables:

!!! note
    - All comma-separated configs should not have spaces between values
    - `UV_RELOAD` and `UV_WORKERS` are not supported with `jac serve`
    - To use `UV_WORKERS`, run with `poetry run standalone` and set `APP_PATH` to your Jac file

### Basic Server Settings

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `UV_HOST` | Host to bind to | `127.0.0.1` |
| `UV_PORT` | Port to bind to | `8000` |
| `UV_UDS` | Unix domain socket | `None` |
| `UV_BACKLOG` | Maximum number of connections | `2048` |
| `UV_TIMEOUT_KEEP_ALIVE` | Seconds to keep idle connections | `5` |
| `UV_TIMEOUT_GRACEFUL_SHUTDOWN` | Graceful shutdown timeout | `None` |

### WebSocket Configuration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `UV_WS` | WebSocket implementation | `auto` |
| `UV_WS_MAX_SIZE` | Maximum WebSocket message size | `16777216` |
| `UV_WS_MAX_QUEUE` | Maximum WebSocket queue size | `32` |
| `UV_WS_PING_INTERVAL` | WebSocket ping interval | `20.0` |
| `UV_WS_PING_TIMEOUT` | WebSocket ping timeout | `20.0` |
| `UV_WS_PER_MESSAGE_DEFLATE` | Enable per-message deflate | `True` |

### SSL Configuration

| **Variable** | **Description** | **Default** |
|--------------|-----------------|-------------|
| `UV_SSL_KEYFILE` | SSL key file | `None` |
| `UV_SSL_CERTFILE` | SSL certificate file | `None` |
| `UV_SSL_KEYFILE_PASSWORD` | Password for SSL key file | `None` |
| `UV_SSL_CA_CERTS` | CA certificates file | `None` |
| `UV_SSL_CIPHERS` | SSL ciphers to use | `TLSv1` |

### Advanced Settings

For additional Uvicorn configuration options, refer to the [official Uvicorn documentation](https://www.uvicorn.org/settings/).