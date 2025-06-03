# Real-Time Communication with WebSockets

## What Are WebSockets?

WebSockets enable real-time, two-way communication between your Jac Cloud server and clients. Unlike regular HTTP requests, WebSockets maintain a persistent connection, allowing you to build:

- Live chat applications
- Real-time notifications
- Collaborative editing tools
- Live dashboards
- Multiplayer games

## Getting Started in 5 Minutes

### Step 1: Create a WebSocket Walker

To create a WebSocket endpoint, add the `"websocket"` method to your walker's `__specs__` configuration:

```jac
walker chat_service {
    has message: str;

    can enter with `root entry {
        report "Received: " + self.message;
    }

    class __specs__ {
        has methods: list = ["websocket"];  // This makes it a WebSocket endpoint
    }
}
```

!!! tip "WebSocket + HTTP"
    WebSocket walkers can also support other HTTP methods (GET, POST, etc.), but file uploads are not supported via WebSocket connections.

### Step 2: Connect From a Client

Use standard WebSocket clients to connect to your endpoint:

**Connection Details:**

- **Protocol**: `ws://` (or `wss://` for secure connections)
- **URL**: `/websocket`
- **Optional Header**: `Authorization: Bearer {{USER-TOKEN}}`
- **Optional Query Parameter**: `?channel_id=anystring`

When connected, you'll receive a connection event with client information:

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

## Sending Messages From Clients

### Trigger a Walker Execution

```json
{
    "type": "walker",
    "walker": "chat_service",
    "response": true,
    "context": {
        "message": "Hello, server!"
    }
}
```

### Send a Message to Specific Users

```json
{
    "type": "user",
    "root_ids": ["n::672b35cec309e5ef8469c372"],
    "data": {
        "message": "Hello, specific user!"
    }
}
```

### Send a Message to a Channel

```json
{
    "type": "channel",
    "channel_ids": ["room_123"],
    "data": {
        "message": "Hello, everyone in this channel!"
    }
}
```

### Send a Message to Specific Clients

```json
{
    "type": "client",
    "client_ids": ["1730887348:f46d85203c704c099e9f44e948322a20"],
    "data": {
        "message": "Hello, specific client!"
    }
}
```

### Switch Between Authenticated and Public User

```json
{
    "type": "connection",
    "token": "Bearer {{user's token}}"
}
```

## Sending Messages From the Server

To send notifications from your walkers, import the WebSocket manager:

```jac
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}
```

### Notification Methods

#### Notify Current Client

```jac
socket.notify_self({
    "progress": "0%",
    "status": "started"
});
```

#### Notify Specific Users

```jac
socket.notify_users([root_id], {
    "progress": "50%",
    "status": "processing"
});
```

#### Notify Channels

```jac
socket.notify_channels([channel_id], {
    "progress": "75%",
    "status": "finalizing"
});
```

#### Notify Specific Clients

```jac
socket.notify_clients([client_id], {
    "progress": "100%",
    "status": "completed"
});
```

## Complete Example: Chat Application

### Server-Side Code (Jac)

```jac
"""Simple WebSocket chat application example."""
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}

// Send message to a specific user
walker send_chat_to_user {
    has root_id: str;
    has message: str = "Hello user!";

    can enter with `root entry {
        _root = &(self.root_id);
        socket.notify_users([_root], {
            "type": "chat",
            "data": {"message": self.message}
        });
        report "Message sent to user!";
    }

    class __specs__ {
        has methods: list = ["websocket", "post"];
    }
}

// Send message to a channel/group
walker send_chat_to_group {
    has channel_id: str;
    has message: str = "Hello channel!";

    can enter with `root entry {
        socket.notify_channels([self.channel_id], {
            "type": "chat",
            "data": {"message": self.message}
        });
        report "Message sent to channel!";
    }

    class __specs__ {
        has methods: list = ["websocket", "post"];
    }
}
```

### Client-Side Code (JavaScript)

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
```

!!! warning "Browser WebSocket Limitations"
    The standard browser WebSocket API doesn't support custom headers.
    For authenticated connections in browsers, use the change_user event after connecting.

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
      // Update UI with the new message
      displayMessage(msg.data.message);
      break;
    default:
      console.log("Received event:", msg.type, msg.data);
  }
};

// Example function to display messages in UI
function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  document.getElementById("chat-messages").appendChild(messageElement);
}
```

#### Sending Messages

```javascript
// Function to send a message
function sendMessage(message) {
  // Trigger the send_chat_to_group walker
  client.send(JSON.stringify({
    "type": "walker",
    "walker": "send_chat_to_group",
    "response": true,
    "context": {
      "channel_id": "room_123",
      "message": message
    }
  }));
}

// Example: Connect send button to the function
document.getElementById("send-button").addEventListener("click", () => {
  const messageInput = document.getElementById("message-input");
  sendMessage(messageInput.value);
  messageInput.value = "";
});
```

## WebSocket Best Practices

1. **Use typed events**: Include a "type" field in your data to easily differentiate message types
2. **Handle reconnection**: Implement reconnection logic in your client to handle network issues
3. **Validate permissions**: Check user permissions before broadcasting sensitive information
4. **Structure data consistently**: Maintain a consistent data structure for your WebSocket messages
5. **Consider scalability**: For high-traffic applications, consider using the channel-based approach

## Additional Resources

For a complete working example, you can download this [API Request Collection](https://github.com/amadolid/jaseci/blob/websocket-backup-final/jac-cloud/jac_cloud/tests/jac-cloud-websocket.insomnia).

## Next Steps

- Learn about [Webhook Integration](webhook.md) for third-party service integration
- Explore [Task Scheduling](scheduler.md) for automated background tasks
- Implement [Authentication & Permissions](permission.md) for secure applications