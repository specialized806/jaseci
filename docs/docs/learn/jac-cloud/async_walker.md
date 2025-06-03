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

# Asynchronous Processing with Async Walkers

## What Are Async Walkers?

Async walkers allow your application to perform tasks in the background without making users wait. They're perfect for:

- Long-running calculations
- Processing large files
- Calling external APIs
- Sending emails or notifications
- Any task that would otherwise cause delays

## Creating Your First Async Walker in 3 Steps

### Step 1: Add the `async` Keyword

Simply add `async` before your walker declaration:

```jac
async walker process_data {
    has data_id: str;
    has results: list = [];

    can enter with `root entry {
        // This code runs in the background
        print("Starting processing...");

        // Simulate a long operation
        results = fetch_large_dataset(self.data_id);
        self.results = analyze_data(results);

        print("Processing complete!");
    }
}
```

### Step 2: Call the Async Walker

Call it like any regular walker:

```jac
walker start_processing {
    can enter with `root entry {
        // This starts the background task and returns immediately
        process_id = process_data(data_id="dataset_123");

        // Store the process ID for later
        report {
            "message": "Processing started!",
            "process_id": process_id
        };
    }
}
```

### Step 3: Check Results Later

Retrieve results when they're ready:

```jac
walker check_results {
    has process_id: str;

    can enter with `root entry {
        // Get a reference to the async walker instance
        process = &process_id;

        // Check if it's finished
        status = process.__jac__.schedule.status;

        if status == "completed":
            // Access the results
            report {
                "status": "complete",
                "results": process.results
            }
        else{
            report {
                "status": status,
                "message": "Still processing..."
            }
        }
    }
}
```

## How Async Walkers Work

When you call an async walker:

1. **Immediate Response**: You get a walker ID immediately
2. **Background Execution**: The walker runs in a separate thread
3. **Result Storage**: Results are saved in the database
4. **On-Demand Access**: You can check results anytime using the walker ID

## Response Format

When you call an async walker, you'll receive a response like this:

```json
{
    "status": 200,
    "walker_id": "w:process_data:550e8400-e29b-41d4-a716-446655440000"
}
```

The `walker_id` is your reference to check results later.

## Checking Walker Status

The async walker stores execution information in its `__jac__.schedule` object:

| **Status Field** | **Description** | **Example** |
|------------------|-----------------|-------------|
| `status` | Current state | `"pending"`, `"running"`, `"completed"`, `"failed"` |
| `executed_date` | When it ran | `"2024-05-15T14:30:22.123Z"` |
| `http_status` | Result code | `200` |
| `reports` | Output values | `["Step 1 complete", "Step 2 complete"]` |
| `error` | Error message | `"Could not connect to database"` |

## Common Use Cases (With Examples)

### 1. Processing Large Datasets

```jac
async walker analyze_data {
    has dataset_id: str;
    has summary: dict = {};

    can enter with `root entry {
        // Fetch data (could take minutes)
        data = fetch_dataset(self.dataset_id);

        // Process each item (CPU intensive)
        for item in data:
            process_item(item);

        // Generate final summary
        self.summary = create_summary(data);
    }
}
```

### 2. Generating Reports

```jac
async walker generate_report {
    has user_id: str;
    has report_type: str;
    has report_url: str;

    can enter with `root entry {
        // Collect user data
        user_data = fetch_user_data(self.user_id);

        // Generate PDF (slow operation)
        report_file = create_pdf_report(user_data, self.report_type);

        // Upload to storage
        self.report_url = upload_file(report_file);

        // Optional: Notify user
        send_email(self.user_id, "Your report is ready!", self.report_url);
    }
}
```

### 3. External API Integration

```jac
async walker sync_with_external_system {
    has account_id: str;
    has sync_status: str = "pending";
    has sync_results: list = [];

    can enter with `root entry {
        // Connect to external API
        self.sync_status = "connecting";
        api_client = connect_to_api();

        // Fetch data (network-bound, can be slow)
        self.sync_status = "fetching";
        external_data = api_client.fetch_account_data(self.account_id);

        // Process and save data
        self.sync_status = "processing";
        for item in external_data:
            result = process_and_save(item);
            self.sync_results.append(result);

        self.sync_status = "complete";
    }
}
```

## Advanced Techniques

### Combining with WebSockets for Real-time Updates

```jac
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}

async walker process_with_updates {
    has client_id: str;
    has progress: int = 0;

    can enter with `root entry {
        // Send initial notification
        socket.notify_clients([self.client_id], {
            "type": "progress",
            "data": {"progress": 0}
        });

        // Process in chunks and send updates
        for i in range(10):
            process_chunk(i);
            self.progress = (i+1) * 10;

            // Send progress update via WebSocket
            socket.notify_clients([self.client_id], {
                "type": "progress",
                "data": {"progress": self.progress}
            });

        // Send completion notification
        socket.notify_clients([self.client_id], {
            "type": "complete",
            "data": {"message": "Processing complete!"}
        });
    }
}
```

### Error Handling

```jac
async walker safe_process {
    has input_id: str;
    has success: bool = false;
    has error_message: str = "";
    has results: dict = {};

    can enter with `root entry {
        try {
            // Attempt processing
            data = fetch_data(self.input_id);
            if not data:
                self.error_message = "No data found";
                return;

            self.results = process_data(data);
            self.success = true;
        } except e {
            // Capture error details
            self.error_message = str(e);
            log_error(self.input_id, str(e));
        }
    }
}
```

## Complete Example: Background Image Processing

```jac
// Image processing async walker
async walker process_image {
    has image_id: str;
    has processed_url: str = "";
    has thumbnail_url: str = "";
    has status: str = "pending";

    can enter with `root entry {
        try {
            // Update status
            self.status = "downloading";

            // Download original image
            image_data = storage.download(self.image_id);

            // Process image
            self.status = "processing";
            processed = apply_filters(image_data);
            thumbnail = create_thumbnail(image_data);

            // Upload results
            self.status = "uploading";
            self.processed_url = storage.upload(processed, f"{self.image_id}_processed");
            self.thumbnail_url = storage.upload(thumbnail, f"{self.image_id}_thumb");

            // Complete
            self.status = "complete";
        } except e {
            self.status = "failed";
        }
    }
}

// Walker to check processing status
walker check_image_status {
    has process_id: str;

    can enter with `root entry {
        process = &process_id;

        if process.__jac__.schedule.status == "completed"{
            if process.status == "complete"{
                report {
                    "status": "success",
                    "processed": process.processed_url,
                    "thumbnail": process.thumbnail_url
                }
            else:
                report {
                    "status": "error",
                    "message": "Processing failed"
                }
        } else {
            report {
                "status": "pending",
                "current_step": process.status
            }
        }
    }
}
```

## Next Steps

- Learn about [Task Scheduling](scheduler.md) for recurring tasks
- Explore [WebSockets](websocket.md) for real-time communication
- Set up [Logging](logging.md) to monitor your async processes