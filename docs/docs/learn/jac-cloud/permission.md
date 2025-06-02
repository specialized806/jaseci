# Permission Management

## Overview

Jac Cloud provides a sophisticated permission system that allows you to control access to your graph elements (nodes, edges, and walkers) across different users. This guide explains how to manage access permissions in a multi-user environment.

## Core Concepts

### Anchors vs Archetypes

In Jac Cloud, there are two key representations of your data:

- **Archetypes**: The in-memory Jac language class representations
- **Anchors**: The persistent database representations

| Type | Database (Anchor) | In-Memory (Archetype) |
|------|-------------------|----------------------|
| Node | NodeAnchor | NodeArchetype |
| Edge | EdgeAnchor | EdgeArchetype |
| Walker | WalkerAnchor | WalkerArchetype |
| Object | ObjectAnchor | ObjectArchetype |
| Root | NodeAnchor | Root(NodeArchetype) |
| Generic Edge | EdgeAnchor | GenericEdge(EdgeArchetype) |

### Access Levels

Jac Cloud supports four permission levels:

| Level | Description |
|-------|-------------|
| `NO_ACCESS` | No access to the archetype (default) |
| `READ` | Read-only access to view the archetype |
| `CONNECT` | Ability to connect nodes to this node |
| `WRITE` | Full access to modify the archetype |

## Default Permission Structure

By default, each user's archetypes are isolated with the following permission structure:

```json
{
    "all": "NO_ACCESS",
    "roots": {
        "anchors": {}
    }
}
```

Where:
- `all`: Access level granted to all users
- `roots.anchors`: Access levels for specific users, identified by their root JID

## How Permissions Work

### Multi-User Graph Structure

Consider this typical multi-user scenario:

```
User1 → Root1 → Node1
User2 → Root2 → Node2
User3 → Root3 → Node3
```

By default, `User2` cannot access `Node1` owned by `User1`. To enable access, you need to explicitly modify the permissions.

### Access Prioritization

Specific root access takes precedence over general access. For example:
- `all: "NO_ACCESS", roots: {"root2": "CONNECT"}` — Only User2 has CONNECT access, others have none
- `all: "WRITE", roots: {"root2": "NO_ACCESS"}` — User2 has no access, all others have WRITE access

## Managing Permissions

### Granting Access to Specific Users

To grant `READ` access to a specific user, modify the node's access property:

```python
# Node1 is the archetype
# Node1.__jac__ is the anchor

Node1.__jac__.access = {
    "all": "NO_ACCESS",
    "roots": {
        "anchors": {
            "n::123445673": "READ"  # User2's Root JID
        }
    }
}
```

### Granting Access to All Users

To grant access to all users:

```python
Node1.__jac__.access = {
    "all": "READ",
    "roots": {
        "anchors": {}
    }
}
```

## Permission Management Walkers

You can create walkers that manage permissions programmatically.

### Granting Access

#### Example: Granting Access in Jac Cloud

```python
# Run the walker as User1
walker set_access {
    has access: str;            # "READ", "WRITE", "CONNECT"
    has root_ref_jid: str;      # ID of the user to grant access to

    can give_access with boy entry {
        # here = boy1 (the node we're granting access to)
        Jac.allow_root(here, NodeAnchor.ref(self.root_ref_jid), self.access);
    }
}
```

### Revoking Access

#### Example: Removing Access in Jac Cloud

```python
# Run the walker as User1
walker remove_access {
    has root_ref_jid: str;      # ID of the user to revoke access from

    can remove_access with boy entry {
        # here = boy1 (the node we're revoking access from)
        Jac.disallow_root(here, NodeAnchor.ref(self.root_ref_jid));
    }
}
```

### Global Access Control

To grant read access to all users:

```python
Jac.perm_grant(here, "READ")
```

To remove all access:

```python
Jac.restrict(here)
```

## Advanced: Manual Access Management

For more complex scenarios, you can manage permissions manually at the database level.

### Checking Access Programmatically

```python
for nodeanchor in NodeArchetype.Collection.find(
    {
        "type": "<type of the node>",
        "context.public": true
    }
):
    # Check read access
    if not Jac.check_read_access(nodeanchor):
        continue

    # Check write access
    if not Jac.check_write_access(nodeanchor):
        continue

    # Check connect access
    if not Jac.check_connect_access(nodeanchor):
        continue
```

### Bulk Permission Updates

To update permissions for multiple nodes at once:

```python
NodeArchetype.Collection.update_many(
    {
        "type": "<type of the node>",
        "context.public": true
    },
    {
        "$set": {
            "access.all": "CONNECT"
        }
    }
)
```

## Database Representation Examples

### Node Example

```json
{
    "_id": "ObjectId('6735b60656e82d6799dc9772')",
    "name": "Human",
    "root": "ObjectId('6735b5e456e82d6799dc976e')",
    "access": { "all": "NO_ACCESS", "roots": { "anchors": {} } },
    "edges": [ "e::6735b60656e82d6799dc9775", "e:Friend:6735b60656e82d6799dc9776" ],
    "archetype": {
        "gender": "boy"
    }
}
```

### Edge Example

```json
{
    "_id": "ObjectId('6735b60656e82d6799dc9776')",
    "name": "Friend",
    "root": "ObjectId('6735b5e456e82d6799dc976e')",
    "access": { "all": "NO_ACCESS", "roots": { "anchors": {} } },
    "source": "n:B:6735b60656e82d6799dc9771",
    "target": "n:C:6735b60656e82d6799dc9772",
    "is_undirected": false,
    "archetype": {
        "best": true
    }
}
```