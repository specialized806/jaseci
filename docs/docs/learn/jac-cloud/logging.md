# Logging and Monitoring

## Overview

Jac Cloud includes a comprehensive logging system that tracks incoming requests and outgoing responses by default. This guide explains how to configure, customize, and integrate your logs with monitoring systems.

## Default Logging Behavior

- All requests and responses are automatically logged to files in the `/tmp/jac_cloud_logs/` directory
- Log files use daily rotation to prevent any single file from becoming too large
- JSON formatting is used for easy parsing and analysis

## Quick Start: Elastic Integration

For production environments, we recommend connecting your Jac Cloud logs to an Elastic Stack instance for better visualization, analysis, and alerting capabilities.

### Prerequisites

- A running Elastic Stack instance (Elasticsearch, Kibana)
- [Filebeat](https://www.elastic.co/downloads/beats/filebeat) installed on your server

### Basic Setup

1. We provide a template configuration at `scripts/filebeat-template.yaml`
2. Modify the `hosts` and `api_key` fields to point to your Elastic instance
3. Run Filebeat with the configuration:

```bash
filebeat -e -c scripts/filebeat-template.yaml
```

!!! warning
    Filebeat automatically appends port 9200 to the host URL if no port is specified. If your Elastic instance is behind a load balancer with a URL without a custom port, add either `:80` or `:443` to the hosts config.
    Example: `hosts: ["https://my_elastic_instance.me.com:443"]`

## Detailed Filebeat Configuration

### Installation

1. [Download and install Filebeat](https://www.elastic.co/downloads/beats/filebeat)
2. Create a configuration file with the following settings:

```yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /tmp/jac_cloud_logs/*-jac-cloud-*.log
    - /tmp/jac_cloud_logs/jac-cloud.log
  json:
    keys_under_root: true
    overwrite_keys: true
    add_error_key: true
    expand_keys: true

output.elasticsearch:
  hosts: ["localhost:9200"]
  protocol: https
  api_key: "id:api_key"
  index: "filebeat-testing"

setup.template.name: "filebeat"
setup.template.pattern: "filebeat-*"
```

### Running Filebeat

#### Standard Operation
```bash
filebeat -e -c filebeat.yml
```

#### With Elevated Permissions
```bash
sudo cp filebeat.yml /etc/filebeat/filebeat.yml
sudo filebeat -e
```

### Additional Resources

For more detailed information, consult the official documentation:
- [Getting Started with Elastic Cloud](https://www.elastic.co/guide/en/cloud/current/ec-getting-started-search-use-cases-python-logs.html)
- [Filebeat Configuration Guide](https://www.elastic.co/guide/en/beats/filebeat/current/configuring-howto-filebeat.html)

## Customizing Logging Behavior

You can customize the logging behavior by setting these environment variables:

| **Environment Variable** | **Description** | **Default Value** |
|--------------------------|-----------------|-------------------|
| `LOGGER_NAME` | Specified logger name | `app` |
| `LOGGER_LEVEL` | Control log level (debug, info, warning, error) | `debug` |
| `LOGGER_FILE_PATH` | Log directory and filename | `/tmp/jac_cloud_logs/jac-cloud.log` |
| `LOGGER_ROLLOVER_INTERVAL` | Rotation interval (M=minute, H=hourly, D=daily, W=weekly) | `D` |
| `LOGGER_MAX_BACKUP` | Maximum backup files before deletion (negative = unlimited) | `-1` |
| `LOGGER_ROLLOVER_MAX_FILE_SIZE` | Maximum file size in bytes before rollover | `10000000` |
| `LOGGER_USE_UTC` | Whether logger uses UTC time | `false` |

## Log Structure

Jac Cloud logs are structured in JSON format with the following key fields:

- `timestamp`: When the log entry was created
- `level`: Log level (DEBUG, INFO, WARNING, ERROR)
- `message`: Log message content
- `request`: Details about the HTTP request (method, path, headers, etc.)
- `response`: Details about the HTTP response (status code, body, etc.)
- `duration`: Request processing time in milliseconds

## Best Practices

1. **Set appropriate log levels** - Use `debug` for development and `info` for production
2. **Monitor log storage** - Configure `LOGGER_MAX_BACKUP` to prevent disk space issues
3. **Centralize logs** - Use Elastic Stack or similar for multi-server deployments
4. **Set up alerts** - Configure alerts for error conditions in your monitoring system
5. **Secure sensitive data** - Be aware that logs may contain sensitive information

## Troubleshooting

### Common Issues

1. **Missing logs**: Verify the `LOGGER_FILE_PATH` directory exists and has write permissions
2. **Filebeat connection issues**: Check network connectivity and authentication details
3. **High disk usage**: Adjust `LOGGER_ROLLOVER_INTERVAL` and `LOGGER_MAX_BACKUP` settings

### Checking Log Status

To verify logging is working correctly:

```bash
# Check if log files exist
ls -la /tmp/jac_cloud_logs/

# View recent log entries
tail -f /tmp/jac_cloud_logs/jac-cloud.log
```