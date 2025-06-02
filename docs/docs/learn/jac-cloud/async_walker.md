# Async Walker

## Overview

Async walkers in Jac Cloud allow you to execute walkers asynchronously in separate threads. This is particularly useful for long-running operations that shouldn't block the main execution flow, such as intensive computations or external API calls.

## Basic Usage

To create an async walker, simply add the `async` keyword before the walker declaration:

```jac
async walker sample {
    has value: int = 0;

    can enter with `root entry {
        print("test");
        self.value = 1;
    }
}
```

Key characteristics:
- Executes in a separate thread without blocking the main application
- Returns immediately with a reference ID while continuing execution in the background
- Similar to task scheduling but with a simpler syntax
- Results can be retrieved later using the walker ID

## How It Works

1. When an async walker is triggered, it's scheduled as a background task
2. The API call returns immediately with a walker ID reference
3. The walker executes asynchronously in its own thread
4. Results are stored in the database and can be retrieved later

## Response Format

When you call an async walker, you receive a response containing the walker's unique ID:

```json
{
    "status": 200,
    "walker_id": "w:sample:550e8400-e29b-41d4-a716-446655440000"
}
```

## Retrieving Results

You can retrieve the results of an async walker by using its ID:

```jac
walker view_sample_result {
    has walker_id: str;

    can enter with `root entry {
        // Get a reference to the walker instance
        wlk = &walker_id;

        // Access the walker's attributes
        print(wlk.value);  // Will be 1 after execution completes

        // Check execution status and metadata
        schedule_info = wlk.__jac__.schedule;

        // Print execution details
        print(f"Status: {schedule_info.status}");
        print(f"Executed at: {schedule_info.executed_date}");

        // Check for errors
        if schedule_info.error:
            print(f"Error: {schedule_info.error}");
    }
}
```

## Available Status Information

The `__jac__.schedule` object contains all execution metadata:

| **Field** | **Description** |
|-----------|-----------------|
| `status` | Current execution status (pending, running, completed, failed) |
| `node_id` | ID of the node where the walker was executed |
| `root_id` | ID of the root node of the user who triggered the walker |
| `execute_date` | When the walker was scheduled to execute |
| `executed_date` | When the walker actually executed |
| `http_status` | HTTP status code for the execution result |
| `reports` | Any values reported during walker execution |
| `custom` | Custom metadata associated with the walker |
| `error` | Error message if execution failed |

## Example: Long-Running Process

```jac
async walker process_large_dataset {
    has dataset_id: str;
    has results: list = [];

    can enter with `root entry {
        // Simulate long-running process
        dataset = get_dataset(self.dataset_id);

        for item in dataset:
            // Do intensive processing
            processed = complex_computation(item);
            self.results.append(processed);

        // Final result is stored in the walker
        print("Processing complete!");
    }
}

// Retrieve results when needed
walker check_processing {
    has process_id: str;

    can enter with `root entry {
        process = &process_id;

        if process.__jac__.schedule.status == "completed":
            print("Results:", process.results);
        else:
            print("Still processing...");
    }
}
```

## Related Features

- For more complex scheduling needs, see [Task Scheduling](scheduler.md)
- For real-time updates during async processing, use [WebSockets](websocket.md) to notify clients