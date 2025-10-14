import datetime;


node Profile {
    has username: str = "";

    can update with update_profile entry {
        self.username = visitor.new_username;
        report self ;
    }

    can get with get_profile entry {
        follwers = [
            {"id" : jid(i) , "username" : i.username }
            for i in [self-->( ` ? Profile ) ]
        ];
        report {"user" : self , "followers" : follwers } ;
    }

    can follow with follow_request entry {
        current_profile = [root-->( ` ? Profile ) ];
        current_profile[0] +>: Follow() :+> self;
        report self ;
    }

    can un_follow with un_follow_request entry {
        current_profile = [root-->( ` ? Profile ) ];
        follow_edge = [edge current_profile[0]->:Follow :->self];
        del follow_edge[0] ;
        report self ;
    }
}


obj TweetInfo {
    has username: str;
    has id: str;
    has content: str;
    has embedding: list;
    has likes: list;
    has comments: list;
}


node Tweet {
    has content: str;
    has embedding: list;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");

    can update with update_tweet exit {
        self.content = visitor.updated_content;
        report self ;
    }

    can delete with remove_tweet exit {
        del self ;
        disengage;
    }

    can like_tweet with like_tweet entry {
        current_profile = [root-->( ` ? Profile ) ];
        self +>: Like() :+> current_profile[0];
        report self ;
    }

    can remove_like with remove_like entry {
        current_profile = [root-->( ` ? Profile ) ];
        like_edge = [edge self->:Like :->current_profile[0]];
        del like_edge[0] ;
        report self ;
    }

    can comment with comment_tweet entry {
        current_profile = [root-->( ` ? Profile ) ];
        comment_node = current_profile[0] +>: Post() :+> Comment(
            content=visitor.content
        );
        grant(comment_node[0], level=ConnectPerm);
        self ++> comment_node[0];
        report comment_node[0] ;
    }

    def get_info()  -> TweetInfo {
        return TweetInfo(
            username=[self<-:Post :<-][0].username,
            id=jid(self),
            content=self.content,
            embedding=self.embedding,
            likes=[i.username for i in [self->:Like :->]],
            comments=[

                {"username" : [i<--( ` ? Profile ) ][0].username , "id" : jid(i) , "content" : i.content }
                for i in [self-->( ` ? Comment ) ]
            ]
        );
    }

    can get with load_feed entry {
        tweet_info = self.get_info();
        visitor.results.append(
            {"Tweet_Info" : tweet_info}
        );
    }
}


node Comment {
    has content: str;

    can update with update_comment entry {
        self.content = visitor.updated_content;
        report self ;
    }

    can delete with remove_comment entry {
        del self ;
        disengage;
    }
}


edge Follow {}


edge Like {}


edge Post {}


walker visit_profile {
    can visit_profile with `root entry {
        visit [-->( ` ? Profile ) ] else {
            new_profile = here ++> Profile();
            grant(new_profile[0], level=ConnectPerm);
            visit new_profile;
        }
    }
}


walker update_profile(visit_profile) {
    has new_username: str;
}


walker get_profile(visit_profile) {}


walker load_user_profiles {
    obj __specs__ {
        static has auth: bool = False;
    }

    can load_profiles with `root entry {
        self.profiles: list = [];
        for each_root in allroots() {
            profile = [each_root-->( ` ? Profile ) ][0];
            self.profiles.append({"name" : profile.username , "id" : jid(profile) });
        }
    }

    can report_profiles with exit {
        report self.profiles ;
    }
}


walker follow_request {}


walker un_follow_request {}


walker create_tweet(visit_profile) {
    has content: str;

    can tweet with Profile entry {
        tweet_node = here +>: Post() :+> Tweet(content=self.content, embedding=[]);
        grant(tweet_node[0], level=ConnectPerm);
        report tweet_node ;
    }
}


walker update_tweet {
    has updated_content: str;
}


walker remove_tweet {}


walker like_tweet {}


walker remove_like {}


walker comment_tweet {
    has content: str;
}


walker update_comment {
    has updated_content: str;
}


walker remove_comment {}


walker load_feed(visit_profile) {
    has search_query: str = "";
    has results: list = [];

    can load with Profile entry {
        visit [-->( ` ? Tweet ) ];
        for user_node in [->:Follow :->( ` ? Profile ) ] {
            visit [user_node-->( ` ? Tweet ) ];
        }
    }

    can report_feed with exit {
        report self.results ;
    }
}


# Client-side UI Components (marked with 'cl' for browser execution)
# ===================================================================

# Shared data model for client/server
cl obj ClientTweet {
    has username: str = "";
    has id: str = "";
    has content: str = "";
    has likes: list = [];
    has comments: list = [];
}

cl obj ClientProfile {
    has username: str = "";
    has id: str = "";
}

# UI Components - Render a single tweet card
cl def TweetCard(tweet: ClientTweet) -> any {
    return <div class="tweet-card" style={{"border": "1px solid #e1e8ed", "padding": "15px", "margin": "10px 0", "borderRadius": "8px"}}>
        <div class="tweet-header" style={{"fontWeight": "bold", "marginBottom": "8px"}}>
            @{tweet.username}
        </div>
        <div class="tweet-content" style={{"marginBottom": "12px"}}>
            {tweet.content}
        </div>
        <div class="tweet-actions" style={{"display": "flex", "gap": "15px"}}>
            <button
                onclick={spawn like_tweet_action(tweet.id)}
                style={{"padding": "5px 10px", "cursor": "pointer"}}
            >
                Like ({tweet.likes.length})
            </button>
            <button style={{"padding": "5px 10px"}}>
                Comment ({tweet.comments.length})
            </button>
        </div>
    </div>;
}

# Handle liking a tweet - calls server walker
cl async def like_tweet_action(tweet_id: str) -> any {
    try {
        result = await __jacSpawn("like_tweet", {"nd": tweet_id});
        print("Tweet liked:", result);
        # Re-render feed after like
        window.location.reload();
    } except Exception as e {
        print("Error liking tweet:", e);
    }
}

# Render the main feed view
cl def FeedView(tweets: list) -> any {
    return <div class="feed-container" style={{"maxWidth": "600px", "margin": "0 auto", "fontFamily": "sans-serif"}}>
        <div class="feed-header" style={{"padding": "20px", "borderBottom": "1px solid #e1e8ed"}}>
            <h1 style={{"margin": "0"}}>LittleX Feed</h1>
        </div>
        <div class="feed-content">
            {[TweetCard(tweet) for tweet in tweets]}
        </div>
    </div>;
}

# Render login form
cl def LoginForm() -> any {
    return <div class="login-container" style={{"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}>
        <h2 style={{"marginTop": "0"}}>Login to LittleX</h2>
        <form onsubmit={handle_login}>
            <div style={{"marginBottom": "15px"}}>
                <label style={{"display": "block", "marginBottom": "5px"}}>Username:</label>
                <input
                    type="text"
                    id="username"
                    style={{"width": "100%", "padding": "8px", "boxSizing": "border-box"}}
                />
            </div>
            <div style={{"marginBottom": "15px"}}>
                <label style={{"display": "block", "marginBottom": "5px"}}>Password:</label>
                <input
                    type="password"
                    id="password"
                    style={{"width": "100%", "padding": "8px", "boxSizing": "border-box"}}
                />
            </div>
            <button
                type="submit"
                style={{"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}
            >
                Login
            </button>
        </form>
        <div style={{"marginTop": "15px", "textAlign": "center"}}>
            <a href="/page/littlex_signup" style={{"color": "#1da1f2", "textDecoration": "none"}}>
                Don't have an account? Sign up
            </a>
        </div>
    </div>;
}

# Handle login form submission
cl async def handle_login(event: any) -> None {
    event.preventDefault();
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    success = await jacLogin(username, password);
    if success {
        window.location.href = "/page/littlex_home";
    } else {
        alert("Login failed. Please try again.");
    }
}

# Render signup form
cl def SignupForm() -> any {
    return <div class="signup-container" style={{"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}>
        <h2 style={{"marginTop": "0"}}>Sign Up for LittleX</h2>
        <form onsubmit={handle_signup}>
            <div style={{"marginBottom": "15px"}}>
                <label style={{"display": "block", "marginBottom": "5px"}}>Username:</label>
                <input
                    type="text"
                    id="signup-username"
                    required
                    style={{"width": "100%", "padding": "8px", "boxSizing": "border-box"}}
                />
            </div>
            <div style={{"marginBottom": "15px"}}>
                <label style={{"display": "block", "marginBottom": "5px"}}>Password:</label>
                <input
                    type="password"
                    id="signup-password"
                    required
                    style={{"width": "100%", "padding": "8px", "boxSizing": "border-box"}}
                />
            </div>
            <div style={{"marginBottom": "15px"}}>
                <label style={{"display": "block", "marginBottom": "5px"}}>Confirm Password:</label>
                <input
                    type="password"
                    id="signup-password-confirm"
                    required
                    style={{"width": "100%", "padding": "8px", "boxSizing": "border-box"}}
                />
            </div>
            <button
                type="submit"
                style={{"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}
            >
                Sign Up
            </button>
        </form>
        <div style={{"marginTop": "15px", "textAlign": "center"}}>
            <a href="/page/littlex_login" style={{"color": "#1da1f2", "textDecoration": "none"}}>
                Already have an account? Login
            </a>
        </div>
    </div>;
}

# Handle signup form submission
cl async def handle_signup(event: any) -> None {
    event.preventDefault();
    username = document.getElementById("signup-username").value;
    password = document.getElementById("signup-password").value;
    password_confirm = document.getElementById("signup-password-confirm").value;

    if password != password_confirm {
        alert("Passwords do not match!");
        return;
    }

    if username.length < 3 {
        alert("Username must be at least 3 characters long.");
        return;
    }

    if password.length < 6 {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        response = await __fetch("/user/create", {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": __jsonStringify({"username": username, "password": password})
        });

        if response.ok {
            data = __jsonParse(await response.text());
            token = data.get("token");
            if token {
                __setLocalStorage("jac_token", token);
                alert("Account created successfully! Welcome to LittleX!");
                window.location.href = "/page/littlex_home";
            } else {
                alert("Signup succeeded but no token received.");
            }
        } else {
            error_text = await response.text();
            try {
                error_data = __jsonParse(error_text);
                error_msg = error_data.get("error", "Signup failed");
                alert(error_msg);
            } except Exception {
                alert("Signup failed: " + error_text);
            }
        }
    } except Exception as e {
        alert("Error during signup: " + __toString(e));
    }
}

# Main client-side pages - Home page that loads and displays feed
cl async def littlex_home() -> any {
    if not jacIsLoggedIn() {
        return <div style={{"textAlign": "center", "padding": "50px", "fontFamily": "sans-serif"}}>
            <h2>Please login to view your feed</h2>
            <a href="/page/littlex_login" style={{"color": "#1da1f2"}}>Go to Login</a>
        </div>;
    }

    try {
        # Spawn load_feed walker to get tweets
        result = await __jacSpawn("load_feed", {});

        # Transform walker results to ClientTweet objects
        tweets = [];
        if result and result.reports and result.reports.length > 0 {
            feed_data = result.reports[0];
            for item in feed_data {
                if item.Tweet_Info {
                    tweet_info = item.Tweet_Info;
                    tweets.append(
                        ClientTweet(
                            username=tweet_info.username,
                            id=tweet_info.id,
                            content=tweet_info.content,
                            likes=tweet_info.likes,
                            comments=tweet_info.comments
                        )
                    );
                }
            }
        }

        return FeedView(tweets);
    } except Exception as e {
        return <div style={{"padding": "20px", "color": "red"}}>
            Error loading feed: {__toString(e)}
        </div>;
    }
}

# Login page
cl def littlex_login() -> any {
    return LoginForm();
}

# Signup page
cl def littlex_signup() -> any {
    return SignupForm();
}

# Profile page
cl def littlex_profile() -> any {
    return <div class="profile-container" style={{"maxWidth": "600px", "margin": "20px auto", "padding": "20px", "fontFamily": "sans-serif"}}>
        <h1>Profile</h1>
        <div style={{"padding": "15px", "border": "1px solid #e1e8ed", "borderRadius": "8px"}}>
            <p>Profile information will be displayed here.</p>
            <button
                onclick={logout_action}
                style={{"padding": "10px 20px", "backgroundColor": "#e74c3c", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}
            >
                Logout
            </button>
        </div>
    </div>;
}

# Handle logout
cl def logout_action() -> None {
    jacLogout();
    window.location.href = "/page/littlex_login";
}
