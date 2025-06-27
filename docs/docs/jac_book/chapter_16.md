# Chapter 16: Advanced Jac Cloud Features

In this chapter, we'll explore advanced Jac Cloud capabilities that enable real-time communication, configuration management, and monitoring. We'll build a simple chat room system that demonstrates WebSocket connections, environment configuration, and task scheduling through practical examples.

!!! info "What You'll Learn"
    - Environment variables and application configuration
    - Real-time communication with WebSocket support
    - Webhook integration for external services
    - Logging and monitoring capabilities
    - Task scheduling and automated processes

---

## Environment Variables and Configuration

Production applications require flexible configuration management. Jac Cloud provides built-in support for environment variables and configuration patterns that work seamlessly across local and cloud deployments.

!!! success "Configuration Benefits"
    - **Environment Isolation**: Different settings for dev, staging, and production
    - **Security**: Sensitive data kept in environment variables
    - **Flexibility**: Runtime configuration without code changes
    - **Cloud Integration**: Automatic configuration injection in cloud environments

### Traditional vs Jac Configuration

!!! example "Configuration Comparison"
    === "Traditional Approach"
        ```python
        # config.py - Manual configuration management
        import os
        from typing import Optional

        class Config:
            def __init__(self):
                self.database_url = os.getenv('DATABASE_URL', 'sqlite:///app.db')
                self.redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
                self.secret_key = os.getenv('SECRET_KEY', 'dev-secret')
                self.debug = os.getenv('DEBUG', 'False').lower() == 'true'

                # Validate required settings
                if not self.secret_key or self.secret_key == 'dev-secret':
                    if not self.debug:
                        raise ValueError("SECRET_KEY must be set in production")

        # app.py
        from flask import Flask
        from config import Config

        config = Config()
        app = Flask(__name__)
        app.config.from_object(config)

        @app.route('/chat')
        def chat():
            return f"Chat room (Debug: {config.debug})"
        ```

    === "Jac Configuration"
        <div class="code-block">
        ```jac
        # chat_room.jac - Built-in configuration support
        import from os { getenv }

        glob chat_config = {
            "max_users": int(getenv("MAX_CHAT_USERS", "100")),
            "message_limit": int(getenv("MESSAGE_LIMIT", "1000")),
            "room_timeout": int(getenv("ROOM_TIMEOUT", "3600")),
            "debug_mode": getenv("DEBUG", "false").lower() == "true"
        };

        node ChatRoom {
            has name: str;
            has users: list[str] = [];
            has messages: list[dict] = [];
            has created_at: str;

            can add_user(username: str) -> bool {
                if len(self.users) >= chat_config["max_users"] {
                    return False;
                }
                if username not in self.users {
                    self.users.append(username);
                }
                return True;
            }
        }

        walker create_chat_room {
            has room_name: str;

            can setup_room with `root entry {
                new_room = ChatRoom(
                    name=self.room_name,
                    created_at="2024-01-15"
                );
                here ++> new_room;

                report {
                    "room_id": new_room.id,
                    "name": new_room.name,
                    "max_users": chat_config["max_users"]
                };
            }
        }
        ```
        </div>

### Basic Chat Room Setup

Let's start with a simple chat room that uses environment configuration:

!!! example "Configurable Chat Room"
    === "Jac"
        <div class="code-block">
        ```jac
        # simple_chat.jac
        import from os { getenv }
        import from datetime { datetime }

        glob config = {
            "max_rooms": int(getenv("MAX_ROOMS", "10")),
            "max_users_per_room": int(getenv("MAX_USERS_PER_ROOM", "50")),
            "message_history": int(getenv("MESSAGE_HISTORY", "100"))
        };

        node ChatRoom {
            has name: str;
            has users: list[str] = [];
            has message_count: int = 0;
        }

        walker join_room {
            has room_name: str;
            has username: str;

            can join_chat with `root entry {
                # Find or create room
                room = [-->](`?ChatRoom)(?name == self.room_name);

                if not room {
                    # Check room limit
                    total_rooms = len([-->](`?ChatRoom));
                    if total_rooms >= config["max_rooms"] {
                        report {"error": "Maximum rooms reached"};
                        return;
                    }

                    room = ChatRoom(name=self.room_name);
                    here ++> room;
                } else {
                    room = room[0];
                }

                # Check user limit
                if len(room.users) >= config["max_users_per_room"] {
                    report {"error": "Room is full"};
                    return;
                }

                # Add user if not already in room
                if self.username not in room.users {
                    room.users.append(self.username);
                }

                report {
                    "room": room.name,
                    "users": room.users,
                    "user_count": len(room.users)
                };
            }
        }
        ```
        </div>

    === "Python Equivalent"
        ```python
        # simple_chat.py - Requires manual setup
        import os
        from flask import Flask, request, jsonify

        app = Flask(__name__)

        # Configuration
        MAX_ROOMS = int(os.getenv("MAX_ROOMS", "10"))
        MAX_USERS_PER_ROOM = int(os.getenv("MAX_USERS_PER_ROOM", "50"))
        MESSAGE_HISTORY = int(os.getenv("MESSAGE_HISTORY", "100"))

        # In-memory storage
        chat_rooms = {}

        @app.route('/join_room', methods=['POST'])
        def join_room():
            data = request.get_json()
            room_name = data.get('room_name')
            username = data.get('username')

            # Check room limit
            if len(chat_rooms) >= MAX_ROOMS and room_name not in chat_rooms:
                return jsonify({"error": "Maximum rooms reached"}), 400

            # Create room if doesn't exist
            if room_name not in chat_rooms:
                chat_rooms[room_name] = {
                    "name": room_name,
                    "users": [],
                    "message_count": 0
                }

            room = chat_rooms[room_name]

            # Check user limit
            if len(room["users"]) >= MAX_USERS_PER_ROOM:
                return jsonify({"error": "Room is full"}), 400

            # Add user
            if username not in room["users"]:
                room["users"].append(username)

            return jsonify({
                "room": room["name"],
                "users": room["users"],
                "user_count": len(room["users"])
            })

        if __name__ == '__main__':
            app.run()
        ```

### Environment Setup

Create a `.env` file for local development:

```bash
# .env file
MAX_ROOMS=20
MAX_USERS_PER_ROOM=100
MESSAGE_HISTORY=500
DEBUG=true
```

Deploy with environment variables:

```bash
# Local with environment file
export MAX_ROOMS=20 && jac serve simple_chat.jac

# Cloud deployment with config
jac serve simple_chat.jac --env-file .env
```

---

## WebSocket Communication

Real-time applications require bi-directional communication. Jac Cloud provides first-class WebSocket support that integrates seamlessly with your walker-based architecture.

### Adding Real-Time Messaging

!!! example "WebSocket Chat Implementation"
    <div class="code-block">
    ```jac
    # realtime_chat.jac
    import from datetime { datetime }

    node ChatMessage {
        has content: str;
        has sender: str;
        has timestamp: str;
        has room_name: str;
    }

    node ChatRoom {
        has name: str;
        has users: set[str] = set();
        has message_count: int = 0;

        can add_message(sender: str, content: str) -> ChatMessage {
            new_message = ChatMessage(
                content=content,
                sender=sender,
                timestamp=datetime.now().isoformat(),
                room_name=self.name
            );
            self ++> new_message;
            self.message_count += 1;
            return new_message;
        }

        can get_recent_messages(limit: int = 20) -> list[dict] {
            messages = [-->](`?ChatMessage);
            recent = messages[-limit:] if len(messages) > limit else messages;
            return [
                {
                    "content": msg.content,
                    "sender": msg.sender,
                    "timestamp": msg.timestamp
                }
                for msg in recent
            ];
        }
    }

    # WebSocket walker for real-time communication
    walker send_message {
        has room_name: str;
        has username: str;
        has message: str;

        can broadcast_message with `root entry {
            # Find the room
            room = [-->](`?ChatRoom)(?name == self.room_name);

            if not room {
                report {"error": "Room not found"};
                return;
            }

            room = room[0];

            # Check if user is in room
            if self.username not in room.users {
                report {"error": "User not in room"};
                return;
            }

            # Add message
            new_message = room.add_message(self.username, self.message);

            # Broadcast to all connected users (WebSocket magic)
            broadcast_data = {
                "type": "new_message",
                "room": self.room_name,
                "message": {
                    "content": new_message.content,
                    "sender": new_message.sender,
                    "timestamp": new_message.timestamp
                }
            };

            # This automatically sends to all WebSocket connections
            # subscribed to this room
            websocket_broadcast(self.room_name, broadcast_data);

            report {"status": "message_sent", "message_id": new_message.id};
        }
    }

    walker get_chat_history {
        has room_name: str;
        has limit: int = 20;

        can fetch_history with `root entry {
            room = [-->](`?ChatRoom)(?name == self.room_name);

            if room {
                messages = room[0].get_recent_messages(self.limit);
                report {"room": self.room_name, "messages": messages};
            } else {
                report {"error": "Room not found"};
            }
        }
    }
    ```
    </div>

### WebSocket Connection Management

!!! example "WebSocket Connection Walker"
    <div class="code-block">
    ```jac
    # websocket_manager.jac
    walker connect_websocket {
        has room_name: str;
        has username: str;

        can handle_connection with `root entry {
            # Find or create room
            room = [-->](`?ChatRoom)(?name == self.room_name);

            if not room {
                room = ChatRoom(name=self.room_name);
                here ++> room;
            } else {
                room = room[0];
            }

            # Add user to room
            room.users.add(self.username);

            # Subscribe to room's WebSocket channel
            websocket_subscribe(self.room_name);

            # Send initial room state
            recent_messages = room.get_recent_messages(10);

            report {
                "type": "connection_established",
                "room": self.room_name,
                "users": list(room.users),
                "recent_messages": recent_messages
            };

            # Notify other users
            broadcast_data = {
                "type": "user_joined",
                "room": self.room_name,
                "username": self.username,
                "user_count": len(room.users)
            };
            websocket_broadcast(self.room_name, broadcast_data);
        }
    }

    walker disconnect_websocket {
        has room_name: str;
        has username: str;

        can handle_disconnection with `root entry {
            room = [-->](`?ChatRoom)(?name == self.room_name);

            if room {
                room = room[0];
                room.users.discard(self.username);

                # Notify other users
                broadcast_data = {
                    "type": "user_left",
                    "room": self.room_name,
                    "username": self.username,
                    "user_count": len(room.users)
                };
                websocket_broadcast(self.room_name, broadcast_data);

                report {"status": "disconnected"};
            }
        }
    }
    ```
    </div>

### Testing WebSocket Chat

Deploy the WebSocket-enabled chat:

```bash
jac serve realtime_chat.jac --websocket
```

Test with a simple JavaScript client:

```html
<!-- chat_client.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Jac Chat Room</title>
</head>
<body>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>

    <script>
        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const messages = document.getElementById('messages');
            messages.innerHTML += `<div>${data.sender}: ${data.message}</div>`;
        };

        function sendMessage() {
            const input = document.getElementById('messageInput');
            ws.send(JSON.stringify({
                walker: 'send_message',
                room_name: 'general',
                username: 'user1',
                message: input.value
            }));
            input.value = '';
        }
    </script>
</body>
</html>
```

---

## Webhook Integration

Webhooks enable your Jac applications to receive real-time notifications from external services. This is essential for integrating with third-party APIs and building event-driven architectures.

### Webhook Receiver Implementation

!!! example "Chat Notification Webhooks"
    <div class="code-block">
    ```jac
    # webhook_chat.jac
    import from datetime { datetime }

    node WebhookLog {
        has source: str;
        has event_type: str;
        has data: dict;
        has received_at: str;
    }

    # Webhook receiver walker
    walker receive_webhook {
        has source: str = "unknown";
        has event_type: str;
        has data: dict;

        can process_webhook with `root entry {
            # Log the webhook
            webhook_log = WebhookLog(
                source=self.source,
                event_type=self.event_type,
                data=self.data,
                received_at=datetime.now().isoformat()
            );
            here ++> webhook_log;

            # Process different webhook types
            if self.source == "github" and self.event_type == "push" {
                self.handle_github_push();
            } elif self.source == "slack" and self.event_type == "message" {
                self.handle_slack_message();
            } else {
                print(f"Unknown webhook: {self.source}/{self.event_type}");
            }

            report {"status": "webhook_processed", "log_id": webhook_log.id};
        }

        can handle_github_push() {
            # Extract commit information
            commits = self.data.get("commits", []);
            repo_name = self.data.get("repository", {}).get("name", "unknown");

            # Send notification to chat
            for commit in commits {
                message = f"🔨 New commit in {repo_name}: {commit.get('message', 'No message')}";
                self.send_to_chat("dev-updates", "GitBot", message);
            }
        }

        can handle_slack_message() {
            # Forward Slack messages to our chat
            user = self.data.get("user_name", "SlackUser");
            text = self.data.get("text", "");
            channel = self.data.get("channel_name", "general");

            message = f"[Slack] {text}";
            self.send_to_chat(channel, user, message);
        }

        can send_to_chat(room_name: str, sender: str, message: str) {
            # Find or create room
            room = [-->](`?ChatRoom)(?name == room_name);
            if not room {
                room = ChatRoom(name=room_name);
                here ++> room;
            } else {
                room = room[0];
            }

            # Add message
            room.add_message(sender, message);

            # Broadcast via WebSocket
            broadcast_data = {
                "type": "webhook_message",
                "room": room_name,
                "message": {
                    "content": message,
                    "sender": sender,
                    "timestamp": datetime.now().isoformat()
                }
            };
            websocket_broadcast(room_name, broadcast_data);
        }
    }

    walker get_webhook_logs {
        has source: str = "";
        has limit: int = 50;

        can fetch_logs with `root entry {
            all_logs = [-->](`?WebhookLog);

            # Filter by source if specified
            if self.source {
                filtered_logs = [log for log in all_logs if log.source == self.source];
            } else {
                filtered_logs = all_logs;
            }

            # Get recent logs
            recent_logs = filtered_logs[-self.limit:];

            report {
                "logs": [
                    {
                        "source": log.source,
                        "event_type": log.event_type,
                        "received_at": log.received_at
                    }
                    for log in recent_logs
                ],
                "total": len(filtered_logs)
            };
        }
    }
    ```
    </div>

### Webhook Registration

Configure webhook endpoints:

```bash
# Deploy with webhook support
jac serve webhook_chat.jac --webhooks

# Register webhook URL with external service
# POST to: http://your-domain.com/webhook/receive_webhook
```

Test webhook locally:

```bash
curl -X POST http://localhost:8000/webhook/receive_webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "github",
    "event_type": "push",
    "data": {
      "repository": {"name": "my-repo"},
      "commits": [{"message": "Fix critical bug"}]
    }
  }'
```

---

## Logging and Monitoring

Production applications require comprehensive logging and monitoring. Jac Cloud provides built-in observability features that integrate with your application logic.

### Application Logging

!!! example "Structured Logging System"
    <div class="code-block">
    ```jac
    # logging_chat.jac
    import from datetime { datetime }
    import from logging { getLogger }

    glob logger = getLogger("chat_app");

    node LogEntry {
        has level: str;
        has message: str;
        has timestamp: str;
        has context: dict = {};
    }

    walker log_activity {
        has level: str = "info";
        has message: str;
        has context: dict = {};

        can record_log with `root entry {
            # Create log entry
            log_entry = LogEntry(
                level=self.level,
                message=self.message,
                timestamp=datetime.now().isoformat(),
                context=self.context
            );
            here ++> log_entry;

            # Also log to system logger
            if self.level == "error" {
                logger.error(f"{self.message} | Context: {self.context}");
            } elif self.level == "warning" {
                logger.warning(f"{self.message} | Context: {self.context}");
            } else {
                logger.info(f"{self.message} | Context: {self.context}");
            }

            report {"log_id": log_entry.id, "logged_at": log_entry.timestamp};
        }
    }

    # Enhanced chat with logging
    walker send_logged_message {
        has room_name: str;
        has username: str;
        has message: str;

        can send_with_logging with `root entry {
            # Log the attempt
            log_activity(
                level="info",
                message="Message send attempt",
                context={
                    "room": self.room_name,
                    "user": self.username,
                    "message_length": len(self.message)
                }
            ) spawn here;

            # Find room
            room = [-->](`?ChatRoom)(?name == self.room_name);

            if not room {
                log_activity(
                    level="warning",
                    message="Message failed - room not found",
                    context={"room": self.room_name, "user": self.username}
                ) spawn here;

                report {"error": "Room not found"};
                return;
            }

            room = room[0];

            # Check if user can send
            if self.username not in room.users {
                log_activity(
                    level="warning",
                    message="Message failed - user not in room",
                    context={"room": self.room_name, "user": self.username}
                ) spawn here;

                report {"error": "User not in room"};
                return;
            }

            # Send message
            new_message = room.add_message(self.username, self.message);

            # Log success
            log_activity(
                level="info",
                message="Message sent successfully",
                context={
                    "room": self.room_name,
                    "user": self.username,
                    "message_id": new_message.id
                }
            ) spawn here;

            report {"status": "sent", "message_id": new_message.id};
        }
    }

    walker get_logs {
        has level: str = "";
        has limit: int = 100;

        can fetch_logs with `root entry {
            all_logs = [-->](`?LogEntry);

            # Filter by level if specified
            if self.level {
                filtered_logs = [log for log in all_logs if log.level == self.level];
            } else {
                filtered_logs = all_logs;
            }

            # Get recent logs
            recent_logs = filtered_logs[-self.limit:];

            report {
                "logs": [
                    {
                        "level": log.level,
                        "message": log.message,
                        "timestamp": log.timestamp,
                        "context": log.context
                    }
                    for log in recent_logs
                ],
                "total": len(filtered_logs)
            };
        }
    }
    ```
    </div>

---

## Task Scheduling and Cron Jobs

Automated tasks are essential for maintenance, cleanup, and periodic operations. Jac Cloud supports scheduled tasks that integrate with your walker-based architecture.

### Scheduled Chat Maintenance

!!! example "Chat Room Cleanup Tasks"
    <div class="code-block">
    ```jac
    # scheduled_chat.jac
    import from datetime { datetime, timedelta }

    # Scheduled walker for cleanup tasks
    walker cleanup_inactive_rooms {
        has max_age_hours: int = 24;

        can perform_cleanup with `root entry {
            current_time = datetime.now();
            cleanup_count = 0;

            # Find all rooms
            all_rooms = [-->](`?ChatRoom);

            for room in all_rooms {
                # Check if room has been inactive
                if len(room.users) == 0 {
                    # Get latest message
                    messages = [-->](`?ChatMessage)(?room_name == room.name);

                    if not messages {
                        # No messages, delete empty room
                        del room;
                        cleanup_count += 1;
                    } else {
                        # Check last message age
                        latest_message = messages[-1];
                        message_time = datetime.fromisoformat(latest_message.timestamp);

                        if (current_time - message_time).total_seconds() > (self.max_age_hours * 3600) {
                            # Room is too old, cleanup
                            for msg in messages {
                                del msg;
                            }
                            del room;
                            cleanup_count += 1;
                        }
                    }
                }
            }

            # Log cleanup results
            log_activity(
                level="info",
                message="Cleanup task completed",
                context={
                    "rooms_cleaned": cleanup_count,
                    "total_rooms": len([-->](`?ChatRoom))
                }
            ) spawn here;

            report {
                "status": "cleanup_completed",
                "rooms_cleaned": cleanup_count,
                "timestamp": current_time.isoformat()
            };
        }
    }

    # Daily statistics walker
    walker generate_daily_stats {
        can collect_stats with `root entry {
            # Count active rooms and users
            all_rooms = [-->](`?ChatRoom);
            total_rooms = len(all_rooms);
            total_users = sum(len(room.users) for room in all_rooms);

            # Count messages sent today
            today = datetime.now().date();
            all_messages = [-->](`?ChatMessage);

            today_messages = 0;
            for msg in all_messages {
                msg_date = datetime.fromisoformat(msg.timestamp).date();
                if msg_date == today {
                    today_messages += 1;
                }
            }

            # Create stats report
            stats = {
                "date": today.isoformat(),
                "active_rooms": total_rooms,
                "active_users": total_users,
                "messages_today": today_messages,
                "generated_at": datetime.now().isoformat()
            };

            # Log daily stats
            log_activity(
                level="info",
                message="Daily statistics generated",
                context=stats
            ) spawn here;

            report stats;
        }
    }
    ```
    </div>

### Scheduling Configuration

Configure scheduled tasks:

```bash
# Deploy with scheduler
jac serve scheduled_chat.jac --schedule

# Add cron jobs via environment or config
export CRON_CLEANUP_ROOMS="0 2 * * *"  # Daily at 2 AM
export CRON_DAILY_STATS="0 1 * * *"    # Daily at 1 AM
```

Or configure in a schedule file:

```yaml
# schedule.yaml
tasks:
  - walker: cleanup_inactive_rooms
    schedule: "0 2 * * *"  # Every day at 2 AM
    params:
      max_age_hours: 48

  - walker: generate_daily_stats
    schedule: "0 1 * * *"  # Every day at 1 AM
```

---

## Key Takeaways

!!! summary "What We've Learned"
    - **Environment Configuration**: Flexible settings management across environments
    - **Real-Time Communication**: WebSocket integration for live applications
    - **Webhook Integration**: Seamless external service integration
    - **Structured Logging**: Built-in observability and monitoring
    - **Task Scheduling**: Automated maintenance and periodic operations

### Next Steps

In the upcoming chapters, we'll explore:
- **Chapter 17**: Advanced type system for robust distributed applications
- **Chapter 18**: Testing and debugging complex cloud applications
- **Chapter 19**: Production deployment and scaling strategies

!!! tip "Try It Yourself"
    Experiment with the chat room by adding:
    - User authentication and profiles
    - Message reactions and threading
    - File sharing capabilities
    - Integration with external chat services

    Remember: All these advanced features work seamlessly with Jac's scale-agnostic architecture!

---

*Ready to master Jac's type system? Continue to [Chapter 17: Type System Deep Dive](chapter_17.md)!*
