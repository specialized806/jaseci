
  # It now includes a 'data' argument, expected to be passed from the caller (walker).
  def HomeView(data: dict) -> any {
    
    # Client-side lifecycle hook: Executed when the component mounts
    onMount() {
      if not jacIsLoggedIn() {
          navigate_to("login");
      }
    }
   
    # Check login status before attempting to render/fetch
    if not jacIsLoggedIn() {
        # Return an empty div if navigation is needed or waiting
        return <div />; 
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
    data = {}; # some abstraction for useState in python way
    
    # Return the HomeView component, passing any required data.
    return <HomeView data=data />;
  }


