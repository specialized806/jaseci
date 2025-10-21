cl import from material-ui { Button, Card, CardContent, CardHeader, CardActions, Typography }

########################
# Jac code
#######################


cl { 
    obj ClientTweet {
        has username: str = "";
        has id: str = "";
        has content: str = "";
        has likes: list = [];
        has comments: list = [];
    }
    def TweetCard(tweet: ClientTweet) -> any {
        return <div
                class="tweet-card"
                style={
                {"border" : "1px solid #e1e8ed" , "padding" : "15px" , "margin" : "10px 0" , "borderRadius" : "8px" }}>
            <div
                    class="tweet-header"
                    style={{"fontWeight" : "bold" , "marginBottom" : "8px" }}>
                @
                {tweet.username}
                </div>
            <div class="tweet-content" style={{"marginBottom" : "12px" }}>
                {tweet.content}
                </div>
            <div class="tweet-actions" style={{"display" : "flex" , "gap" : "15px" }}>
                <Button
                        onclick={like_tweet_action(tweet.id)}
                        variant="contained"
                        color="primary">
                    Like (
                    {tweet.likes.length}
                    )
                    </Button>
                <Button variant="contained" color="primary">
                    Comment (
                    {tweet.comments.length}
                    )
                    </Button>
                </div>
            </div>;
    }

    async def like_tweet_action(
        tweet_id: str
    ) -> any {
        try {
            result = await like_tweet(tweet_id);
            print("Tweet liked:", result);
            # Re-render feed after like
            Jac.rerender_app(); #cna be page level or component level
        } except Exception as e {
            print("Error liking tweet:", e);
        }
    }

    def FeedView(tweets: list) -> any {
        return <div
            class="feed-container"
            style={
            {"maxWidth" : "600px" , "margin" : "0 auto" , "fontFamily" : "sans-serif" }}>
        <div
                class="feed-header"
                style={{"padding" : "20px" , "borderBottom" : "1px solid #e1e8ed" }}>
            <h1 style={{"margin" : "0" }}>
                LittleX Feed
                </h1>
            </div>
        <div class="feed-content">
            {[TweetCard(tweet) for tweet in tweets]}
            </div>
        </div>;
    }
  
    # It now includes a 'data' argument, expected to be passed from the caller (walker).
    def HomeView(data: dict) -> any {
        
        # Client-side lifecycle hook: Executed when the component mounts
        #  need to give simple abstraction for the lifecycle hooks in python way
        onMount() {
        if not jacIsLoggedIn() {
            Jac.navigate_to("login");
        }
        }
    

        try {
            # 1. Call a server-side walker/function to fetch feed data.
            # 'await' is used for asynchronous calls (like API calls handled by the runtime).
            result = await load_feed(); 
            
            # 2. Process the result into a list of ClientTweet objects
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
            
            # 3. Return the main Feed View component
            return FeedView(tweets);
            
        } except Exception as e {
            # 4. Handle errors during data fetching/processing
            return <div style={{"padding" : "20px" , "color" : "red" }}>
            Error loading feed:
            {String(e)}
            </div>;
        }
    }

    walker home_page {
        # For global data, we can use a dictionary to store the data
        global_data = Jac.global_data;
        user_id = global_data["user_id"];
        def update_user_id(new_user_id: str) -> None {
            global_data["user_id"] = new_user_id;
        }
        data = {}; # some abstraction for useState in python way
        
        # Return the HomeView component, passing any required data.
        return <HomeView data=data user_id=user_id update_user_id=update_user_id />;
    }
}

