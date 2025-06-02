# Task Scheduling in Jac Cloud

## Overview

Jac Cloud provides a powerful task scheduling system that lets you run walkers at specified times or intervals. This allows you to automate recurring tasks, delayed operations, and time-based workflows without writing additional code.

## Scheduling Basics

You can schedule walkers by adding a `schedule` object to the walker's `__specs__` class. There are three main types of triggers:

- **Cron**: Schedule using cron expressions (like "run every Monday at 9am")
- **Interval**: Run at regular intervals (every 5 minutes, hourly, etc.)
- **Date**: Run once at a specific date and time

## Configuration Reference

All scheduler configurations use these common parameters:

| **Parameter** | **Type** | **Description** | **Default** |
|---------------|----------|-----------------|-------------|
| `trigger` | `str` | Type of trigger: `"cron"`, `"interval"`, or `"date"` | (Required) |
| `node` | `str` or `None` | Entry node ID (defaults to root) | `None` |
| `args` | `list[Any]` or `None` | Positional arguments for the walker | `None` |
| `kwargs` | `dict[str, Any]` or `None` | Keyword arguments for the walker | `None` |
| `max_instances` | `int` | Maximum simultaneous jobs per walker type | `1` |
| `next_run_time` | `datetime` or `None` | Custom first trigger time | `None` |
| `propagate` | `bool` | Whether multiple services can trigger the same schedule | `false` |
| `save` | `bool` | Whether to save walker instance results to database | `false` |

## Trigger Types

### Cron Trigger

Runs according to a cron-like schedule.

#### Additional Parameters

| **Parameter** | **Type** | **Description** | **Default** |
|---------------|----------|-----------------|-------------|
| `year` | `int` or `str` | 4-digit year | `*` |
| `month` | `int` or `str` | Month (1-12) | `*` |
| `day` | `int` or `str` | Day of month (1-31) | `*` |
| `week` | `int` or `str` | ISO week (1-53) | `*` |
| `day_of_week` | `int` or `str` | Weekday (0-6 or mon,tue,wed,thu,fri,sat,sun) | `*` |
| `hour` | `int` or `str` | Hour (0-23) | `*` |
| `minute` | `int` or `str` | Minute (0-59) | `*` |
| `second` | `int` or `str` | Second (0-59) | `*` |
| `start_date` | `datetime` or `str` or `None` | Earliest trigger date (inclusive) | `None` |
| `end_date` | `datetime` or `str` or `None` | Latest trigger date (inclusive) | `None` |

#### Example: Run Every Day at 7:30 AM

```jac
walker daily_report {
    can enter with `root entry {
        print("Generating daily report...");
    }

    class __specs__ {
        has private: bool = true;
        has schedule: dict = {
            "trigger": "cron",
            "hour": 7,
            "minute": 30,
            "save": true
        };
    }
}
```

### Interval Trigger

Runs at regular time intervals.

#### Additional Parameters

| **Parameter** | **Type** | **Description** | **Default** |
|---------------|----------|-----------------|-------------|
| `weeks` | `int` | Number of weeks to wait | `0` |
| `days` | `int` | Number of days to wait | `0` |
| `hours` | `int` | Number of hours to wait | `0` |
| `minutes` | `int` | Number of minutes to wait | `0` |
| `seconds` | `int` | Number of seconds to wait | `1` |
| `start_date` | `datetime` or `str` or `None` | Starting point for calculation | `None` |
| `end_date` | `datetime` or `str` or `None` | Latest possible trigger date | `None` |

#### Example: Run Every 5 Minutes

```jac
walker health_check {
    can enter with `root entry {
        print("Running system health check...");
    }

    class __specs__ {
        has private: bool = true;
        has schedule: dict = {
            "trigger": "interval",
            "minutes": 5,
            "save": true
        };
    }
}
```

### Date Trigger

Runs once at a specific date and time.

#### Additional Parameters

| **Parameter** | **Type** | **Description** | **Default** |
|---------------|----------|-----------------|-------------|
| `run_date` | `datetime` or `str` | The date/time to run the job | (Required) |

#### Example: Run at a Specific Date and Time

```jac
walker one_time_event {
    can enter with `root entry {
        print("Running scheduled one-time event...");
    }

    class __specs__ {
        has private: bool = true;
        has schedule: dict = {
            "trigger": "date",
            "run_date": "2025-04-30T11:12:00+00:00",
            "save": true
        };
    }
}
```

## Passing Arguments to Scheduled Walkers

You can pass arguments to your scheduled walkers just like regular walkers:

```jac
walker scheduled_task {
    has user_id: str;
    has action: str = "notify";

    can enter with `root entry {
        print(f"Performing {self.action} for user {self.user_id}");
    }

    class __specs__ {
        has private: bool = true;
        has schedule: dict = {
            "trigger": "interval",
            "hours": 1,
            "args": ["user123"],
            "kwargs": {
                "action": "reminder"
            },
            "save": true
        };
    }
}
```

## Advanced: Task Queue System

Jac Cloud also provides a task queue system for more complex scheduling needs. This system is enabled by setting the `TASK_CONSUMER_CRON_SECOND` environment variable.

### How It Works

1. Tasks are created using the `create_task` function
2. Tasks are stored in both the database and Redis
3. A polling mechanism checks for pending tasks
4. Tasks are executed atomically to prevent duplicate execution

### Example: Task Counter

```jac
import from jac_cloud.plugin.implementation {create_task}

node TaskCounter {
    has val: int = 0;
}

walker get_or_create_counter {
    can enter1 with `root entry {
        tc = TaskCounter();
        here ++> tc;
        report tc;
    }

    can enter2 with TaskCounter entry {
        report here;
    }
}

walker increment_counter {
    has val: int;

    can enter with TaskCounter entry {
        here.val += self.val;
    }

    class __specs__ {
        has private: bool = true;
    }
}

walker trigger_counter_task {
    can enter with `root entry {
        tcs = [-->(`?TaskCounter)];
        if tcs {
            report create_task(increment_counter(val=1), tcs[0]);
        }
    }
}
```

## Best Practices

1. **Keep tasks idempotent** - Tasks may occasionally run more than once
2. **Set appropriate max_instances** - Prevent queue congestion by limiting concurrent instances
3. **Use save parameter** - Enable `save: true` to track execution history
4. **Check timezone awareness** - Cron and date triggers use server timezone unless explicitly specified
5. **Monitor performance** - Long-running scheduled tasks can impact overall system performance

## Troubleshooting

- **Tasks not running**: Check that your Jac Cloud service is running and that Redis is properly configured
- **Duplicate executions**: Ensure `propagate: false` (default) is set if multiple Jac Cloud instances are running
- **Missing results**: Verify `save: true` is set to store task results in the database