# Environment Variables: Configuration Made Easy

## What Are Environment Variables?

Environment variables are a simple way to configure your Jac Cloud application without changing code. Think of them as settings you can adjust from outside your application. They're perfect for:

- Switching between development and production settings
- Connecting to different databases
- Adjusting security parameters
- Enabling or disabling features
- Storing API keys and secrets

<!-- ![Environment Variables Diagram](https://via.placeholder.com/800x300?text=Environment+Variables+Diagram) -->

## Quick Start: Setting Your First Variables

### In Development (Command Line)

```bash
# Set variables before running your application
export DATABASE_NAME=my_app_dev
export LOGGER_LEVEL=debug
jac serve main.jac
```

### In Production (Environment File)

```bash
# Create a .env file
echo "DATABASE_NAME=my_app_prod" > .env
echo "LOGGER_LEVEL=info" >> .env

# Load variables and run
source .env
jac serve main.jac
```

## Core Configuration Groups

### Database Connection

Connect to MongoDB or local storage:

```bash
# MongoDB Atlas (cloud database)
export DATABASE_HOST="mongodb+srv://username:password@cluster.mongodb.net"
export DATABASE_NAME="production_db"

# OR Local database
export DATABASE_PATH="local_data"
export DATABASE_NAME="my_app"
```

### Redis Configuration (for WebSockets & Caching)

```bash
# Basic Redis setup
export REDIS_HOST="redis://redis.example.com"
export REDIS_PORT="6379"

# Secured Redis
export REDIS_USER="admin"
export REDIS_PASS="your_secure_password"
```

### API Behavior

```bash
# Show detailed responses including return values
export SHOW_ENDPOINT_RETURNS=true

# Disable automatic API endpoint generation
export DISABLE_AUTO_ENDPOINT=true
```

## Security Settings

### Token Security

```bash
# Strong security for production
export TOKEN_SECRET="a_long_random_string_that_is_very_hard_to_guess"
export TOKEN_ALGORITHM="HS512"  # More secure algorithm
export TOKEN_TIMEOUT="4"        # 4-hour tokens
```

### User Verification

```bash
# Require email verification before login
export RESTRICT_UNVERIFIED_USER=true
export VERIFICATION_CODE_TIMEOUT=48  # 48 hours to verify
export RESET_CODE_TIMEOUT=1          # 1 hour to reset password
```

### Email Integration (for Verification)

```bash
# SendGrid configuration for email notifications
export SENDGRID_HOST="https://api.example.com"
export SENDGRID_API_KEY="SG.your-sendgrid-api-key"
```

## Logging Configuration

Control what gets logged and where:

```bash
# Production logging setup
export LOGGER_LEVEL="info"                        # Less verbose logging
export LOGGER_FILE_PATH="/var/log/jac-cloud.log"  # Standard log location
export LOGGER_ROLLOVER_INTERVAL="D"               # Daily rotation
export LOGGER_MAX_BACKUP="30"                     # Keep 30 days of logs
```

## Environment Variable Reference Tables

### Database & Cache Settings

| **Variable** | **Description** | **Default** | **Example** |
|--------------|-----------------|-------------|-------------|
| `DATABASE_HOST` | MongoDB connection string | `mongodb://localhost/?retryWrites=true&w=majority` | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `DATABASE_NAME` | MongoDB database name | `jaseci` | `my_production_db` |
| `DATABASE_PATH` | Local path for DB | `mydatabase` | `path/to/db` |
| `REDIS_HOST` | Redis connection host | `redis://localhost` | `redis://redis.example.com` |
| `REDIS_PORT` | Redis connection port | `6379` | `6380` |
| `REDIS_USER` | Redis username | `null` | `admin` |
| `REDIS_PASS` | Redis password | `null` | `secret123` |

### API & Application Behavior

| **Variable** | **Description** | **Default** | **Example** |
|--------------|-----------------|-------------|-------------|
| `DISABLE_AUTO_ENDPOINT` | Disable automatic API endpoints | `false` | `true` |
| `SHOW_ENDPOINT_RETURNS` | Include walker return values | `false` | `true` |
| `DISABLE_AUTO_CLEANUP` | Disable automatic deletion of disconnected nodes | `false` | `true` |
| `SINGLE_QUERY` | Use individual queries instead of batch | `false` | `true` |

### Authentication & Security

| **Variable** | **Description** | **Default** | **Example** |
|--------------|-----------------|-------------|-------------|
| `TOKEN_SECRET` | Secret key for token encryption | 50 random characters | `your-super-secure-secret-key` |
| `TOKEN_ALGORITHM` | Algorithm for token encryption | `HS256` | `HS512` |
| `TOKEN_TIMEOUT` | Token expiration in hours | `12` | `24` |
| `RESTRICT_UNVERIFIED_USER` | Require email verification | `false` | `true` |
| `VERIFICATION_CODE_TIMEOUT` | Verification code expiration (hours) | `24` | `48` |
| `RESET_CODE_TIMEOUT` | Password reset code expiration (hours) | `24` | `1` |

### Logging Configuration

| **Variable** | **Description** | **Default** | **Example** |
|--------------|-----------------|-------------|-------------|
| `LOGGER_LEVEL` | Log level | `debug` | `info` |
| `LOGGER_FILE_PATH` | Log file location | `/tmp/jac_cloud_logs/jac-cloud.log` | `/var/log/jac-cloud.log` |
| `LOGGER_ROLLOVER_INTERVAL` | Rotation interval | `D` (daily) | `H` (hourly) |
| `LOGGER_MAX_BACKUP` | Maximum backup files | `-1` (unlimited) | `30` |
| `LOGGER_USE_UTC` | Use UTC time | `false` | `true` |

## Social Login Configuration

### Basic Pattern

```bash
# Replace PLATFORM with: GOOGLE, GITHUB, FACEBOOK, etc.
export SSO_{PLATFORM}_CLIENT_ID="your_client_id"
export SSO_{PLATFORM}_CLIENT_SECRET="your_client_secret"
```

### Google Example

```bash
export SSO_GOOGLE_CLIENT_ID="123456789-abcdef.apps.googleusercontent.com"
export SSO_GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnop"
```

### GitHub Example

```bash
export SSO_GITHUB_CLIENT_ID="abc123def456"
export SSO_GITHUB_CLIENT_SECRET="ghp_abcdefghijklmnopqrstuvwxyz"
```

### Supported Platforms

<div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>Google</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>Facebook</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>GitHub</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>Microsoft</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>Apple</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>LinkedIn</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>Twitter</div>
    </div>
    <div class="grid-item" style="text-align: center; padding: 15px; border: 1px solid #444; border-radius: 8px; background-color: #333;">
        <div>GitLab</div>
    </div>
</div>

## Server Configuration (Uvicorn)

Jac Cloud uses Uvicorn as its server. Configure it with these variables:

### Basic Server Settings

```bash
# Public server configuration
export UV_HOST="0.0.0.0"        # Listen on all interfaces
export UV_PORT="80"              # Standard HTTP port
export UV_TIMEOUT_KEEP_ALIVE="120"  # Keep connections alive longer
```

### HTTPS/SSL Configuration

```bash
# Enable HTTPS
export UV_SSL_KEYFILE="/etc/ssl/private/key.pem"
export UV_SSL_CERTFILE="/etc/ssl/certs/cert.pem"
```

## Environment Presets for Different Scenarios

### Local Development

```bash
# Quick setup for local development
export DATABASE_NAME="dev_db"
export LOGGER_LEVEL="debug"
export SHOW_ENDPOINT_RETURNS="true"
```

### Testing

```bash
# Configuration for testing
export DATABASE_NAME="test_db"
export LOGGER_LEVEL="debug"
export TOKEN_TIMEOUT="1"  # Short-lived tokens for testing
```

### Production

```bash
# Secure production configuration
export DATABASE_HOST="mongodb+srv://user:pass@cluster.mongodb.net"
export DATABASE_NAME="prod_db"
export LOGGER_LEVEL="info"
export LOGGER_MAX_BACKUP="30"
export TOKEN_ALGORITHM="HS512"
export TOKEN_TIMEOUT="4"
export RESTRICT_UNVERIFIED_USER="true"
export UV_HOST="0.0.0.0"
export UV_PORT="443"
export UV_SSL_KEYFILE="/etc/ssl/private/key.pem"
export UV_SSL_CERTFILE="/etc/ssl/certs/cert.pem"
```

## Best Practices for Beginners

1. **Use environment files**: Create `.env` files for different environments
   ```bash
   # Create different environment files
   touch .env.development .env.testing .env.production
   ```

2. **Never commit secrets**: Add `.env` files to your `.gitignore`
   ```bash
   # Add to .gitignore
   echo ".env*" >> .gitignore
   ```

3. **Use different values per environment**:
   ```bash
   # Development
   DATABASE_NAME=my_app_dev

   # Production
   DATABASE_NAME=my_app_prod
   ```

4. **Document your variables**: Create a template file showing all options
   ```bash
   # Create a template with comments
   touch .env.template
   ```

5. **Validate critical variables**: Check for required variables in your code
   ```jac
   walker check_config {
       can enter with `root entry {
           if not env("DATABASE_HOST") {
               print("Warning: DATABASE_HOST not set, using default");
           }
       }
   }
   ```

## Next Steps

- Learn about [WebSocket Communication](websocket.md) for real-time features
- Explore [Task Scheduling](scheduler.md) for automated background tasks
- Set up [Logging & Monitoring](logging.md) to track application performance
- Deploy your app using the [Kubernetes Deployment Guide](deployment.md)