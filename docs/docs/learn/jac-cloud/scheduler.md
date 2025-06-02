# Task Scheduling: Automate Your Jac Applications

## What is Task Scheduling?

Jac Cloud's task scheduling system lets you run walkers at specified times or intervals without manual intervention. This powerful feature enables you to:

- Run daily reports or data processing
- Send scheduled notifications or emails
- Perform regular maintenance tasks
- Execute periodic data synchronization
- Trigger time-sensitive workflows

<!-- ![Task Scheduling Diagram](https://via.placeholder.com/800x300?text=Task+Scheduling+Diagram) -->

## Quick Start: Schedule Your First Task

### Step 1: Create a Scheduled Walker

Add a `schedule` object to your walker's `__specs__` class:

```jac
walker daily_greeting {
    has name: str = "World";

    can enter with `root entry {
        // This will run every day at 9:00 AM
        report f"Good morning, {self.name}! Today is {DateTime.now().format('%A')}";
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "cron",      // Schedule type
            "hour": 9,              // Run at 9 AM
            "minute": 0,            // At exactly 00 minutes
            "args": [],             // No positional args
            "kwargs": {             // Keyword arguments
                "name": "Everyone"
            },
            "save": true            // Save results to database
        };
    }
}
```

### Step 2: Start Your Server

Run your Jac Cloud server as usual:

```bash
jac serve main.jac
```

Your scheduled task will now run automatically at the specified time!

## Three Ways to Schedule Tasks

### 1. Cron Scheduling (Time-Based)

Use cron expressions to run tasks based on calendar time (like "every Monday at 9am"):

```jac
walker weekly_report {
    can enter with `root entry {
        // Runs every Monday at 7:30 AM
        print("Generating weekly report...");
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "cron",
            "day_of_week": "mon",   // Monday
            "hour": 7,              // 7 AM
            "minute": 30,           // 30 minutes
            "save": true
        };
    }
}
```

### 2. Interval Scheduling (Frequency-Based)

Run tasks at regular intervals (every X minutes, hours, etc.):

```jac
walker system_health_check {
    can enter with `root entry {
        // Runs every 5 minutes
        print("Checking system health...");
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "interval",
            "minutes": 5,           // Every 5 minutes
            "save": true
        };
    }
}
```

### 3. One-time Scheduling (Date-Based)

Run tasks once at a specific date and time:

```jac
walker special_event {
    can enter with `root entry {
        // Runs once at the specified date/time
        print("Running one-time special event...");
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "date",
            "run_date": "2024-12-31T23:59:00+00:00",  // New Year's Eve
            "save": true
        };
    }
}
```

## Common Configuration Options

All scheduler configurations share these parameters:

| **Parameter** | **Type** | **Description** | **Default** |
|---------------|----------|-----------------|-------------|
| `trigger` | `str` | Type of trigger: `"cron"`, `"interval"`, or `"date"` | (Required) |
| `node` | `str` | Entry node ID (defaults to root) | `None` |
| `args` | `list` | Positional arguments for the walker | `None` |
| `kwargs` | `dict` | Keyword arguments for the walker | `None` |
| `max_instances` | `int` | Maximum simultaneous jobs per walker type | `1` |
| `save` | `bool` | Whether to save walker instance results to database | `false` |

## Cron Scheduling Reference

| **Parameter** | **Type** | **Description** | **Example** |
|---------------|----------|-----------------|-------------|
| `year` | `int/str` | 4-digit year | `2024` or `"2024-2025"` |
| `month` | `int/str` | Month (1-12) | `3` (March) or `"3-6"` |
| `day` | `int/str` | Day of month (1-31) | `15` or `"1-15"` |
| `day_of_week` | `int/str` | Weekday (0-6 or mon,tue,wed,thu,fri,sat,sun) | `"mon,wed,fri"` |
| `hour` | `int/str` | Hour (0-23) | `9` or `"9-17"` |
| `minute` | `int/str` | Minute (0-59) | `30` or `"*/15"` (every 15) |
| `second` | `int/str` | Second (0-59) | `0` or `"*/30"` (every 30) |

## Interval Scheduling Reference

| **Parameter** | **Type** | **Description** | **Example** |
|---------------|----------|-----------------|-------------|
| `weeks` | `int` | Number of weeks between runs | `1` (weekly) |
| `days` | `int` | Number of days between runs | `1` (daily) |
| `hours` | `int` | Number of hours between runs | `12` (twice daily) |
| `minutes` | `int` | Number of minutes between runs | `30` (half-hourly) |
| `seconds` | `int` | Number of seconds between runs | `60` (every minute) |

## Practical Examples

### Daily Backup at Midnight

```jac
walker daily_backup {
    can enter with `root entry {
        print("Starting daily backup process...");
        // Backup logic here
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "cron",
            "hour": 0,        // Midnight
            "minute": 0,      // On the hour
            "save": true
        };
    }
}
```

### Periodic Data Sync (Every 15 Minutes)

```jac
walker sync_data {
    can enter with `root entry {
        print("Syncing data with external system...");
        // Sync logic here
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "interval",
            "minutes": 15,    // Every 15 minutes
            "save": true
        };
    }
}
```

### Scheduled Email (Weekdays at 9 AM)

```jac
walker send_daily_email {
    has recipients: list[str];
    has subject: str;
    has content: str;

    can enter with `root entry {
        print(f"Sending email to {len(self.recipients)} recipients");
        // Email sending logic here
    }

    class __specs__ {
        has schedule: dict = {
            "trigger": "cron",
            "day_of_week": "mon,tue,wed,thu,fri",  // Weekdays only
            "hour": 9,                            // 9 AM
            "minute": 0,                          // On the hour
            "kwargs": {
                "recipients": ["user@example.com"],
                "subject": "Daily Update",
                "content": "Here's your daily update!"
            },
            "save": true
        };
    }
}
```

## Best Practices for Beginners

1. **Keep tasks idempotent**: Tasks should be safe to run multiple times
2. **Set appropriate max_instances**: Prevent queue congestion by limiting concurrent instances
3. **Enable save parameter**: Use `save: true` to track execution history
4. **Check timezone awareness**: Cron and date triggers use server timezone unless specified
5. **Start with longer intervals**: For testing, use longer intervals (minutes instead of seconds)

## Troubleshooting Common Issues

- **Tasks not running**: Check that your Jac Cloud service is running and Redis is properly configured
- **Duplicate executions**: Ensure `propagate: false` (default) is set if multiple Jac Cloud instances are running
- **Missing results**: Verify `save: true` is set to store task results in the database
- **Unexpected timing**: Check server timezone vs. expected timezone

## Next Steps

- Learn about [WebSocket Communication](websocket.md) for real-time features
- Explore [Webhook Integration](webhook.md) for third-party service integration
- Set up [Logging & Monitoring](logging.md) to track scheduled tasks