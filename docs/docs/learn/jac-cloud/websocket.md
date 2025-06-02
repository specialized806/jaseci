# WebSocket Communication

## Overview

Jac Cloud provides built-in WebSocket support for real-time, bidirectional communication between your server and clients. This allows you to build interactive applications like chat systems, live notifications, and collaborative tools.

## Getting Started

### Declaring a WebSocket Walker

To create a WebSocket endpoint, add the `"websocket"` method to your walker's `__specs__` configuration:

```jac
walker your_event_name {
    has val: int;

    can enter with `root entry {
        report "Do something!";
    }

    class __specs__ {
        has methods: list = ["websocket"];
    }
}
```

!!! note
    WebSocket walkers can also support other HTTP methods, but file uploads are not supported.

## Connecting to WebSockets

### Connection Details

- **Protocol**: `ws://` (or `wss://` for secure connections)
- **URL**: `/websocket`
- **Optional Header**: `Authorization: Bearer {{USER-TOKEN}}`
- **Optional Query Parameter**: `?channel_id=anystring`

### Initial Connection Response

Upon connection, you'll receive a connection event with client information:

```json
{
    "type": "connection",
    "data": {
        "client_id": "1730887348:f46d85203c704c099e9f44e948322a20",
        "root_id": "n::672b35cec309e5ef8469c372",
        "channel_id": "1730887348:796ad2e9fa3e484ebe01f071c381b7e8"
    }
}
```

### Authentication Types

- **Authenticated**: Connect with a valid JWT token in the Authorization header
- **Non-Authenticated**: Connect without a token (assigned a public user ID)

## Client Events

Clients can send various event types to the server:

### Walker Event

Triggers a walker execution:

```json
{
    "type": "walker",
    "walker": "your_event_name",
    "response": true,
    "context": {
        "val": 1
    }
}
```

### User Event

Sends a notification to specific users:

```json
{
    "type": "user",
    "root_ids": ["n::672b35cec309e5ef8469c372"],
    "data": {
        "val": 1
    }
}
```

### Channel Event

Sends a notification to all clients subscribed to specific channels:

```json
{
    "type": "channel",
    "channel_ids": ["anystring"],
    "data": {
        "val": 1
    }
}
```

### Client Event

Sends a notification to specific clients:

```json
{
    "type": "client",
    "client_ids": ["1730887348:f46d85203c704c099e9f44e948322a20"],
    "data": {
        "val": 1
    }
}
```

### Change User Event

Switches between authenticated and public user:

```json
{
    "type": "connection",
    "token": "Bearer {{user's token}}"
}
```

## Server Notifications

To send notifications from your walkers, import the WebSocket manager:

```jac
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}
```

### Notification Methods

#### Notify Current Client

Send a notification to the client that triggered the WebSocket walker:

```jac
socket.notify_self({"progress": "0%", "status": "started"});
```

#### Notify Users

Send a notification to all clients of specific users:

```jac
socket.notify_users([root], {"progress": "50%", "status": "processing"});
```

#### Notify Channels

Send a notification to all clients subscribed to specific channels:

```jac
socket.notify_channels([channel_id], {"progress": "75%", "status": "finalizing"});
```

#### Notify Clients

Send a notification to specific clients:

```jac
socket.notify_clients([client_id], {"progress": "100%", "status": "completed"});
```

## Complete Example

### Jac Server Code

```jac
"""Websocket chat application example."""
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}

walker send_chat_to_user {
    has root_id: str;

    can enter with `root entry {
        _root = &(self.root_id);
        socket.notify_users([_root], {
            "type": "chat",
            "data": {"message": "Hello user!"}
        });
    }

    class __specs__ {
        has methods: list = ["websocket", "post"];
    }
}

walker send_chat_to_group {
    has channel_id: str;

    can enter with `root entry {
        socket.notify_channels([self.channel_id], {
            "type": "chat",
            "data": {"message": "Hello channel!"}
        });
    }

    class __specs__ {
        has methods: list = ["websocket", "post"];
    }
}
```

### JavaScript Client Code

#### Connecting to WebSocket

```javascript
// Non-authenticated connection (standard WebSocket)
const client = new WebSocket("ws://localhost:8000/websocket");

// Authenticated connection with change_user event
const client = new WebSocket("ws://localhost:8000/websocket");
client.onopen = (event) => {
  client.send(JSON.stringify({
    "type": "change_user",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }));
};

// Authenticated connection with headers (requires 3rd party library)
import WebSocket from 'ws';  // Example using 'ws' library
const client = new WebSocket('ws://localhost:8000/websocket', {
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
});
```

!!! warning "Browser WebSocket Limitations"
    The standard browser WebSocket API doesn't support custom headers.
    For authenticated connections in browsers, either:
    1. Use the change_user event after connecting
    2. Use a third-party WebSocket library that supports headers

#### Handling Messages

```javascript
client.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case "connection":
      console.log("Connected with client ID:", msg.data.client_id);
      break;
    case "chat":
      console.log("Received chat:", msg.data.message);
      break;
    default:
      console.log("Received event:", msg.type, msg.data);
  }
};
```

#### Sending Events

```javascript
// Trigger a walker
client.send(JSON.stringify({
  "type": "walker",
  "walker": "send_chat_to_user",
  "response": true,
  "context": {
    "root_id": "n::672b35cec309e5ef8469c372"
  }
}));

// Send a direct message to another client
client.send(JSON.stringify({
  "type": "client",
  "client_ids": ["1730887348:f46d85203c704c099e9f44e948322a20"],
  "data": {
    "type": "chat",
    "data": {
      "message": "Hello there!"
    }
  }
}));

// Send a message to a channel
client.send(JSON.stringify({
  "type": "channel",
  "channel_ids": ["room_123"],
  "data": {
    "type": "chat",
    "data": {
      "message": "Hello everyone!"
    }
  }
}));
```

## Additional Resources

For a complete working example, you can download this [API Request Collection](https://github.com/amadolid/jaseci/blob/websocket-backup-final/jac-cloud/jac_cloud/tests/jac-cloud-websocket.insomnia).

## Best Practices

1. **Use typed events**: Include a "type" field in your data to easily differentiate message types
2. **Handle reconnection**: Implement reconnection logic in your client to handle network issues
3. **Validate permissions**: Check user permissions before broadcasting sensitive information
4. **Structure data consistently**: Maintain a consistent data structure for your WebSocket messages
5. **Consider scalability**: For high-traffic applications, consider using the channel-based approach