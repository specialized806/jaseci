# LittleX Tutorial for Beginners

Welcome to the LittleX tutorial! This guide is designed especially for beginners who want to learn Jaseci by building a simple Twitter-like application called LittleX. We'll break everything down into simple steps with clear explanations.

## What is Jaseci?

Jaseci is a programming framework that makes building AI applications easier. Think of it as a toolbox that lets you:
- Store data in a connected graph (like a social network)
- Move through this graph to perform actions
- Add AI capabilities without complex coding

## What We'll Build: LittleX

LittleX is a simplified version of Twitter that lets users:
- Create accounts and profiles
- Post short messages (tweets)
- Follow other users
- See a feed of posts from people they follow

## Getting Started

### 1. Install Jaseci

First, let's install Jaseci on your computer:

```bash
pip install jaseci
```

### 2. Get the LittleX Code

```bash
git clone https://github.com/Jaseci-Labs/littleX.git
cd littleX
```

### 3. Install Dependencies

```bash
pip install -r littleX_BE/requirements.txt
cd littleX_FE
npm install
cd ..
```

## Understanding Jaseci's Building Blocks

Jaseci has three main components that we'll use to build LittleX:

### 1. Nodes (The "Things")

Nodes are objects that store data. In LittleX, we have:
- User nodes that store profile information
- Post nodes that store tweet content
- Comment nodes that store comments on tweets

Here's a simple user node in Jaseci:

```jac
node user {
    has username: str;
    has email: str;
    has password: str;
    has creation_date: str;
}
```

This code creates a user object with username, email, password, and creation date.

### 2. Edges (The "Connections")

Edges connect nodes to show relationships. In LittleX, we have:
- Follow edges (user follows another user)
- Post edges (user created a post)
- Like edges (user liked a post)

Here's how we define a simple edge:

```jac
edge Follow {}
```

This creates a "Follow" connection that can link users together.

### 3. Walkers (The "Actions")

Walkers are like functions that move through your graph and perform actions. They're what makes things happen!

Here's a simple walker that creates a new post:

```jac
walker create_post {
    has content: str;

    root {
        // Find the current user
        user_node = here.get_user_by_id(visitor.user_id);

        // Create a new post
        post_node = spawn node::post(
            content = content,
            creation_date = date.datetime_now()
        );

        // Connect the post to the user
        user_node -[edge::posted]-> post_node;

        // Return success message
        report {"success": true};
    }
}
```

This walker creates a new post with the provided content and links it to the current user.

## Building LittleX Step by Step

Now let's see how these pieces come together to build our application:

### 1. User Registration

When a new user registers, we:
1. Create a new user node
2. Store their username, email, and password
3. Add the current date as creation_date

Here's how it looks in code:

```jac
walker register {
    has username: str;
    has email: str;
    has password: str;

    root {
        // Check if user already exists
        if (!here.user_exists(email)) {
            // Create new user node
            user = spawn node::user(
                username = username,
                email = email,
                password = password,
                creation_date = date.datetime_now()
            );

            // Add user to graph
            here -[edge::has_user]-> user;

            report {"success": true, "user_id": user.id};
        } else {
            report {"success": false, "error": "User already exists"};
        }
    }
}
```

### 2. Creating Posts

After logging in, users can create posts:

```jac
walker create_post {
    has content: str;

    root {
        // Get current user
        user = here.get_current_user();

        // Create post
        post = spawn node::post(
            content = content,
            creation_date = date.datetime_now()
        );

        // Connect post to user
        user -[edge::posted]-> post;

        report {"success": true, "post_id": post.id};
    }
}
```

### 3. Following Users

Users can follow each other:

```jac
walker follow_user {
    has target_user_id: str;

    root {
        // Get current user and target user
        current_user = here.get_current_user();
        target_user = here.get_user_by_id(target_user_id);

        // Create follow connection
        current_user -[edge::follows]-> target_user;

        report {"success": true};
    }
}
```

### 4. Viewing Feed

To show posts from people the user follows:

```jac
walker get_feed {
    root {
        // Get current user
        user = here.get_current_user();

        // Initialize empty feed
        feed = [];

        // Get posts from users we follow
        for followed_user in --> user -[edge::follows]-> {
            for post in --> followed_user -[edge::posted]-> {
                feed.append({
                    "username": followed_user.username,
                    "content": post.content,
                    "date": post.creation_date
                });
            }
        }

        // Sort by date (newest first)
        feed = feed.sort_by_key("date", reverse=true);

        report {"success": true, "feed": feed};
    }
}
```

## Run LittleX Locally

Let's run our application:

### 1. Start the Backend Server

```bash
jac serve littleX_BE/littleX.jac
```

### 2. Start the Frontend

In a new terminal:

```bash
cd littleX_FE
npm run dev
```

### 3. Use the Application

Open your browser to http://localhost:5173 and try:
- Creating a new account
- Posting some tweets
- Following other users
- Checking your feed

## Exploring the LittleX Code

Let's look at some key parts of the actual LittleX application to understand how it works:

### The Profile Node

```jac
node Profile {
    has username: str = "";

    can update with update_profile entry;
    can get with get_profile entry;
    can follow with follow_request entry;
    can un_follow with un_follow_request entry;
}
```

This node represents a user profile with a username and abilities to update the profile, retrieve it, follow other users, and unfollow them.

### The Tweet Node

```jac
node Tweet {
    has content: str;
    has embedding: list;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");

    can update with update_tweet exit;
    can delete with remove_tweet exit;
    can like_tweet with like_tweet entry;
    can remove_like with remove_like entry;
    can comment with comment_tweet entry;
    can get with load_feed entry;
}
```

This node represents a tweet with content, embedding (for AI features), and a timestamp. It has abilities to update, delete, like, unlike, comment, and retrieve tweets.

### The Follow Ability

```jac
impl Profile.follow {
    current_profile = [root-->(`?Profile)];
    current_profile[0] +>:Follow():+> self;
    report self;
}
```

This ability lets a user follow another user by creating a Follow edge between their profiles.

## Adding AI Features

Jaseci makes it easy to add AI to your application. Here's a simple example that summarizes tweets:

```jac
import from mtllm.llms {Ollama}
glob llm = Ollama(host="http://127.0.0.1:11434", model_name="llama3.2:1b");

can 'Summarize latest trends, major events, and notable interactions from the recent tweets in one line.'
    summarise_tweets(tweets: list[str]) -> 'Summarisation': str by llm();
```

This code uses a Llama language model to summarize a list of tweets.

## Try These Exercises

Now that you understand the basics, try these exercises:
1. Add a feature to like posts
2. Create a profile page that shows a user's posts
3. Add the ability to search for users by username

## Conclusion

Congratulations! You've learned how to build a social media application with Jaseci. You've seen how:

- Nodes store data like users and posts
- Edges connect these nodes to show relationships
- Walkers perform actions like creating posts and following users

Jaseci's graph-based approach makes it perfect for social networks and other applications where connections between data are important.

For more information, check out the [Jaseci documentation](https://docs.jaseci.org/) or the [full LittleX guide](guide.md) for more advanced features.
