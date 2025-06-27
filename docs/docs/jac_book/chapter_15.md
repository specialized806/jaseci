# Chapter 15: Multi-User Architecture and Permissions

In this chapter, we'll explore how to build secure, multi-user applications in Jac Cloud. We'll develop a shared notebook system that demonstrates user isolation, permission systems, and access control strategies through practical examples that evolve throughout the chapter.

!!! info "What You'll Learn"
    - Building secure multi-user applications
    - User isolation and data privacy patterns
    - Permission-based access control
    - Shared data management strategies
    - Security considerations for cloud applications

---

## User Isolation and Permission Systems

Multi-user applications require careful consideration of data access and user permissions. Jac Cloud provides built-in user management that integrates seamlessly with your application logic, allowing you to focus on business rules rather than authentication infrastructure.

!!! success "Multi-User Benefits"
    - **Built-in Authentication**: Token-based user management included
    - **Automatic Isolation**: Users can only access their authorized data
    - **Flexible Permissions**: Fine-grained access control patterns
    - **Secure by Default**: User context automatically injected into walkers
    - **Shared Data Support**: Controlled sharing between users

### Traditional vs Jac Multi-User Development

!!! example "Multi-User Comparison"
    === "Traditional Approach"
        ```python
        # app.py - Manual user management required
        from flask import Flask, request, jsonify
        from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
        from werkzeug.security import generate_password_hash, check_password_hash

        app = Flask(__name__)
        app.config['JWT_SECRET_KEY'] = 'your-secret-key'
        jwt = JWTManager(app)

        # Global storage (in production, use a database)
        users = {}
        notebooks = {}

        @app.route('/register', methods=['POST'])
        def register():
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if username in users:
                return jsonify({'error': 'User already exists'}), 400

            users[username] = {
                'password': generate_password_hash(password),
                'notebooks': []
            }

            return jsonify({'message': 'User created successfully'})

        @app.route('/login', methods=['POST'])
        def login():
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if username not in users or not check_password_hash(users[username]['password'], password):
                return jsonify({'error': 'Invalid credentials'}), 401

            access_token = create_access_token(identity=username)
            return jsonify({'access_token': access_token})

        @app.route('/create_note', methods=['POST'])
        @jwt_required()
        def create_note():
            current_user = get_jwt_identity()
            data = request.get_json()

            # Manual permission checking
            note_id = len(notebooks)
            notebooks[note_id] = {
                'id': note_id,
                'title': data.get('title'),
                'content': data.get('content'),
                'owner': current_user,
                'shared_with': []
            }

            users[current_user]['notebooks'].append(note_id)
            return jsonify({'message': 'Note created', 'id': note_id})

        if __name__ == '__main__':
            app.run()
        ```

    === "Jac Multi-User"
        <div class="code-block">
        ```jac
        # shared_notebook.jac - User management built-in
        node Note {
            has title: str;
            has content: str;
            has owner: str;
            has shared_with: list[str] = [];
            has created_at: str = "2024-01-15";
        }

        walker create_note {
            has title: str;
            has content: str;

            can create_user_note with `root entry {
                # User context automatically available
                new_note = Note(
                    title=self.title,
                    content=self.content,
                    owner=__user__  # Auto-injected user context
                );
                here ++> new_note;

                report {
                    "message": "Note created successfully",
                    "id": new_note.id,
                    "owner": new_note.owner
                };
            }
        }

        walker get_my_notes {
            can fetch_user_notes with `root entry {
                # Automatically filter by current user
                my_notes = [-->(`?Note)](?owner == __user__);

                notes_data = [
                    {"id": n.id, "title": n.title, "created_at": n.created_at}
                    for n in my_notes
                ];

                report {"notes": notes_data, "total": len(notes_data)};
            }
        }
        ```
        </div>

---

## Basic User Authentication

Jac Cloud handles authentication automatically when you deploy with user management enabled. Let's start with a simple notebook system that supports multiple users.

### Setting Up User-Aware Notebook

!!! example "User-Isolated Notebook System"
    === "Jac"
        <div class="code-block">
        ```jac
        # user_notebook.jac
        node Note {
            has title: str;
            has content: str;
            has owner: str;
            has is_private: bool = True;
        }

        walker create_note {
            has title: str;
            has content: str;
            has is_private: bool = True;

            can add_note with `root entry {
                new_note = Note(
                    title=self.title,
                    content=self.content,
                    owner=__user__,  # Current authenticated user
                    is_private=self.is_private
                );
                here ++> new_note;

                report {
                    "status": "created",
                    "note_id": new_note.id,
                    "private": new_note.is_private
                };
            }
        }

        walker list_my_notes {
            can get_user_notes with `root entry {
                # Only get notes owned by current user
                user_notes = [-->(`?Note)](?owner == __user__);

                report {
                    "user": __user__,
                    "notes": [
                        {
                            "id": n.id,
                            "title": n.title,
                            "private": n.is_private
                        }
                        for n in user_notes
                    ],
                    "count": len(user_notes)
                };
            }
        }
        ```
        </div>

    === "Python Equivalent"
        ```python
        # user_notebook.py - Requires manual auth setup
        from flask import Flask, request, jsonify
        from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

        app = Flask(__name__)
        app.config['JWT_SECRET_KEY'] = 'secret-key'
        jwt = JWTManager(app)

        notes = []

        @app.route('/create_note', methods=['POST'])
        @jwt_required()
        def create_note():
            current_user = get_jwt_identity()
            data = request.get_json()

            note = {
                'id': len(notes),
                'title': data.get('title'),
                'content': data.get('content'),
                'owner': current_user,
                'is_private': data.get('is_private', True)
            }
            notes.append(note)

            return jsonify({
                'status': 'created',
                'note_id': note['id'],
                'private': note['is_private']
            })

        @app.route('/list_my_notes', methods=['GET'])
        @jwt_required()
        def list_my_notes():
            current_user = get_jwt_identity()
            user_notes = [n for n in notes if n['owner'] == current_user]

            return jsonify({
                'user': current_user,
                'notes': [
                    {'id': n['id'], 'title': n['title'], 'private': n['is_private']}
                    for n in user_notes
                ],
                'count': len(user_notes)
            })
        ```

### Deploying with User Management

Deploy your user-aware application:

```bash
jac serve user_notebook.jac --user-management
```

!!! info "Authentication Endpoints"
    Jac Cloud automatically provides:
    - `POST /user/register` - User registration
    - `POST /user/login` - User authentication
    - `POST /user/refresh` - Token refresh

### Testing User Authentication

```bash
# Register a new user
curl -X POST http://localhost:8000/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "secret123"}'

# Login to get access token
curl -X POST http://localhost:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "secret123"}'

# Use token to create a note
curl -X POST http://localhost:8000/create_note \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "My Private Note", "content": "Secret content"}'
```

---

## Shared Data Patterns

Multi-user applications often need controlled sharing of data between users. Let's enhance our notebook to support sharing notes with specific users.

### Note Sharing Implementation

!!! example "Shared Notebook with Permissions"
    <div class="code-block">
    ```jac
    # shared_permissions.jac
    node Note {
        has title: str;
        has content: str;
        has owner: str;
        has shared_with: list[str] = [];
        has is_public: bool = False;
        has permissions: dict = {"read": True, "write": False};
    }

    walker share_note {
        has note_id: str;
        has target_user: str;
        has permission_level: str = "read";  # "read" or "write"

        can add_sharing_permission with `root entry {
            target_note = [-->(`?Note)](?id == self.note_id);

            if not target_note {
                report {"error": "Note not found"};
                return;
            }

            note = target_note[0];

            # Only owner can share notes
            if note.owner != __user__ {
                report {"error": "Only note owner can share"};
                return;
            }

            # Add user to shared list if not already there
            if self.target_user not in note.shared_with {
                note.shared_with.append(self.target_user);
            }

            report {
                "message": f"Note shared with {self.target_user}",
                "permission": self.permission_level,
                "shared_count": len(note.shared_with)
            };
        }
    }

    walker get_accessible_notes {
        can fetch_all_accessible with `root entry {
            all_notes = [-->(`?Note)];
            accessible_notes = [];

            for note in all_notes {
                # User can access if:
                # 1. They own it
                # 2. It's shared with them
                # 3. It's public
                if (note.owner == __user__ or
                    __user__ in note.shared_with or
                    note.is_public) {

                    accessible_notes.append({
                        "id": note.id,
                        "title": note.title,
                        "owner": note.owner,
                        "is_mine": note.owner == __user__,
                        "access_type": "owner" if note.owner == __user__
                                      else ("shared" if __user__ in note.shared_with
                                           else "public")
                    });
                }
            }

            report {
                "user": __user__,
                "accessible_notes": accessible_notes,
                "total": len(accessible_notes)
            };
        }
    }

    walker create_public_note {
        has title: str;
        has content: str;

        can create_shared_note with `root entry {
            new_note = Note(
                title=self.title,
                content=self.content,
                owner=__user__,
                is_public=True
            );
            here ++> new_note;

            report {
                "message": "Public note created",
                "id": new_note.id,
                "visible_to": "everyone"
            };
        }
    }
    ```
    </div>

### Testing Note Sharing

```bash
# Create two users
curl -X POST http://localhost:8000/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "secret123"}'

curl -X POST http://localhost:8000/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@example.com", "password": "secret123"}'

# Alice creates a note
curl -X POST http://localhost:8000/create_note \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALICE_TOKEN" \
  -d '{"title": "Team Project", "content": "Project details"}'

# Alice shares note with Bob
curl -X POST http://localhost:8000/share_note \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ALICE_TOKEN" \
  -d '{"note_id": "note_123", "target_user": "bob@example.com"}'

# Bob views accessible notes
curl -X POST http://localhost:8000/get_accessible_notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer BOB_TOKEN" \
  -d '{}'
```

---

## Security Considerations

When building multi-user systems, security must be a primary concern. Jac Cloud provides several layers of protection, but application-level security patterns are equally important.

### Secure Data Access Patterns

!!! example "Security-First Note Access"
    <div class="code-block">
    ```jac
    # secure_notebook.jac
    walker get_note {
        has note_id: str;

        can fetch_note_securely with `root entry {
            target_note = [-->(`?Note)](?id == self.note_id);

            if not target_note {
                report {"error": "Note not found"};
                return;
            }

            note = target_note[0];

            # Security check: Verify user has access
            has_access = (
                note.owner == __user__ or           # User owns it
                __user__ in note.shared_with or     # Shared with user
                note.is_public                      # Public note
            );

            if not has_access {
                report {"error": "Access denied"};
                return;
            }

            # Return note data based on access level
            note_data = {
                "id": note.id,
                "title": note.title,
                "owner": note.owner,
                "access_level": "owner" if note.owner == __user__ else "shared"
            };

            # Only include content if user has read access
            if has_access {
                note_data["content"] = note.content;
            }

            report note_data;
        }
    }

    walker delete_note {
        has note_id: str;

        can remove_note_securely with `root entry {
            target_note = [-->(`?Note)](?id == self.note_id);

            if not target_note {
                report {"error": "Note not found"};
                return;
            }

            note = target_note[0];

            # Security check: Only owner can delete
            if note.owner != __user__ {
                report {"error": "Only note owner can delete"};
                return;
            }

            # Safe deletion
            del note;

            report {"message": "Note deleted successfully"};
        }
    }

    walker update_note {
        has note_id: str;
        has title: str = "";
        has content: str = "";

        can modify_note_securely with `root entry {
            target_note = [-->(`?Note)](?id == self.note_id);

            if not target_note {
                report {"error": "Note not found"};
                return;
            }

            note = target_note[0];

            # Security check: Only owner can modify
            if note.owner != __user__ {
                report {"error": "Only note owner can modify"};
                return;
            }

            # Update only provided fields
            if self.title {
                note.title = self.title;
            }
            if self.content {
                note.content = self.content;
            }

            report {
                "message": "Note updated successfully",
                "id": note.id
            };
        }
    }
    ```
    </div>

!!! warning "Security Best Practices"
    - **Always Verify Access**: Check user permissions before any data operation
    - **Validate Input**: Sanitize all user input to prevent injection attacks
    - **Principle of Least Privilege**: Grant minimum necessary permissions
    - **Audit Access**: Log sensitive operations for security monitoring
    - **Secure Defaults**: Make restrictive permissions the default

---

## Access Control Strategies

Different applications require different access control models. Let's implement a role-based access control system for our notebook.

### Role-Based Access Control

!!! example "RBAC Notebook System"
    <div class="code-block">
    ```jac
    # rbac_notebook.jac
    enum Role {
        VIEWER = "viewer",
        EDITOR = "editor",
        ADMIN = "admin"
    }

    node UserProfile {
        has email: str;
        has role: Role = Role.VIEWER;
        has created_at: str = "2024-01-15";
    }

    node Note {
        has title: str;
        has content: str;
        has owner: str;
        has required_role: Role = Role.VIEWER;
        has is_sensitive: bool = False;
    }

    walker check_user_role {
        can get_current_user_role with `root entry {
            user_profile = [-->(`?UserProfile)](?email == __user__);

            if user_profile {
                current_role = user_profile[0].role;
            } else {
                # Create default profile for new user
                new_profile = UserProfile(email=__user__);
                here ++> new_profile;
                current_role = Role.VIEWER;
            }

            report {"user": __user__, "role": current_role.value};
        }
    }

    walker create_role_based_note {
        has title: str;
        has content: str;
        has required_role: str = "viewer";
        has is_sensitive: bool = False;

        can create_with_role_check with `root entry {
            # Get user's role
            user_profile = [-->(`?UserProfile)](?email == __user__);

            if not user_profile {
                report {"error": "User profile not found"};
                return;
            }

            user_role = user_profile[0].role;

            # Check if user can create sensitive notes
            if self.is_sensitive and user_role == Role.VIEWER {
                report {"error": "Insufficient permissions for sensitive content"};
                return;
            }

            new_note = Note(
                title=self.title,
                content=self.content,
                owner=__user__,
                required_role=Role(self.required_role),
                is_sensitive=self.is_sensitive
            );
            here ++> new_note;

            report {
                "message": "Note created with role requirements",
                "id": new_note.id,
                "required_role": self.required_role
            };
        }
    }

    walker get_role_filtered_notes {
        can fetch_accessible_by_role with `root entry {
            # Get user's role
            user_profile = [-->(`?UserProfile)](?email == __user__);

            if not user_profile {
                report {"notes": [], "message": "No user profile found"};
                return;
            }

            user_role = user_profile[0].role;
            all_notes = [-->(`?Note)];
            accessible_notes = [];

            for note in all_notes {
                # Check if user meets role requirement
                can_access = (
                    note.owner == __user__ or  # Always access own notes
                    (user_role == Role.ADMIN) or  # Admins see everything
                    (user_role == Role.EDITOR and note.required_role != Role.ADMIN) or
                    (user_role == Role.VIEWER and note.required_role == Role.VIEWER)
                );

                if can_access {
                    accessible_notes.append({
                        "id": note.id,
                        "title": note.title,
                        "owner": note.owner,
                        "required_role": note.required_role.value,
                        "is_sensitive": note.is_sensitive
                    });
                }
            }

            report {
                "user_role": user_role.value,
                "notes": accessible_notes,
                "total": len(accessible_notes)
            };
        }
    }
    ```
    </div>

### Testing Role-Based Access

```bash
# Check user role
curl -X POST http://localhost:8000/check_user_role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{}'

# Create a note requiring editor role
curl -X POST http://localhost:8000/create_role_based_note \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "title": "Editor Note",
    "content": "Only editors can see this",
    "required_role": "editor",
    "is_sensitive": True
  }'

# Get notes filtered by role
curl -X POST http://localhost:8000/get_role_filtered_notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{}'
```

---

## Key Takeaways

!!! summary "What We've Learned"
    - **Built-in User Management**: Jac Cloud handles authentication automatically
    - **User Context Injection**: `__user__` provides current user in all walkers
    - **Permission Patterns**: Multiple access control strategies for different needs
    - **Security-First Design**: Always verify permissions before data operations
    - **Flexible Sharing**: Fine-grained control over data access between users

### Next Steps

In the upcoming chapters, we'll explore:
- **Chapter 16**: Advanced Jac Cloud features like WebSockets and real-time updates
- **Chapter 17**: Type system deep dive for robust multi-user applications
- **Chapter 18**: Testing and debugging multi-user scenarios

!!! tip "Try It Yourself"
    Experiment with the multi-user notebook by adding:
    - User groups and team-based permissions
    - Note categories with different access levels
    - Activity logging and audit trails
    - Real-time collaboration features

    Remember: Always validate user permissions before any data operation!

---

*Ready to learn about advanced cloud features? Continue to [Chapter 16: Advanced Jac Cloud Features](chapter_16.md)!*
