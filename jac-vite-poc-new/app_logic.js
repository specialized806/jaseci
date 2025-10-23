// import { jacLogin, jacLogout, jacSignup, renderJsxTree } from "client_runtime";
import * as _ from "lodash";
import { Button, Input, Card, Typography, Space } from "antd";
const appState = { current_route: "login", tweets: [], loading: false };
function navigate_to(route) {
  console.log("Navigating to:", route);
  appState["current_route"] = route;
  window.history.pushState({}, "", "#" + route);
  render_app();
}
function render_app() {
  console.log(
    "render_app called, route:",
    appState.get("current_route", "unknown")
  );
  let root_element = document.getElementById("__jac_root");
  if (root_element) {
    let component = App();
    console.log("Rendering component to root");
    renderJsxTree(component, root_element);
    console.log("Render complete");
  }
}
function get_current_route() {
  return appState.get("current_route", "login");
}
function handle_popstate(event) {
  let hash = window.location.hash;
  if (hash) {
    appState["current_route"] = hash.slice(1);
  } else {
    appState["current_route"] = "login";
  }
  render_app();
}
function init_router() {
  let hash = window.location.hash;
  if (hash) {
    appState["current_route"] = hash.slice(1);
  } else {
    if (jacIsLoggedIn()) {
      appState["current_route"] = "home";
    } else {
      appState["current_route"] = "login";
    }
  }
  window.addEventListener("popstate", handle_popstate);
}
class ClientTweet {
  constructor(props = {}) {
    this.username = props.hasOwnProperty("username") ? props.username : "";
    this.id = props.hasOwnProperty("id") ? props.id : "";
    this.content = props.hasOwnProperty("content") ? props.content : "";
    this.likes = props.hasOwnProperty("likes") ? props.likes : [];
    this.comments = props.hasOwnProperty("comments") ? props.comments : [];
  }
}
class ClientProfile {
  constructor(props = {}) {
    this.username = props.hasOwnProperty("username") ? props.username : "";
    this.id = props.hasOwnProperty("id") ? props.id : "";
  }
}
function TweetCard(tweet) {
  return __jacJsx(Card, { size: "small", style: { margin: "10px 0" } }, [
    __jacJsx("div", { style: { marginBottom: "12px" } }, [
      __jacJsx(Typography.Text, { strong: true }, ["@", tweet.username]),
    ]),
    __jacJsx("div", { style: { marginBottom: "12px" } }, [
      __jacJsx(Typography.Paragraph, {}, [tweet.content]),
    ]),
    __jacJsx("div", { style: { marginTop: "12px" } }, [
      __jacJsx(Space, {}, [
        __jacJsx(
          Button,
          {
            size: "small",
            type: "text",
            onClick: () => like_tweet_action(tweet.id),
          },
          ["Like (", tweet.likes.length, ")"]
        ),
        __jacJsx(Button, { size: "small", type: "text" }, [
          "Comment (",
          tweet.comments.length,
          ")",
        ]),
      ]),
    ]),
  ]);
}
async function like_tweet_action(tweet_id) {
  try {
    let result = await like_tweet(tweet_id);
    print("Tweet liked:", result);
    window.location.reload();
  } catch (e) {
    print("Error liking tweet:", e);
  }
}
function FeedView(tweets) {
  return __jacJsx(
    "div",
    { style: { maxWidth: "600px", margin: "0 auto", padding: "24px" } },
    [
      __jacJsx(
        Card,
        { title: __jacJsx(Typography.Title, { level: 2 }, ["LittleX Feed"]) },
        [
          __jacJsx(Space, { direction: "vertical", style: { width: "100%" } }, [
            null,
          ]),
        ]
      ),
    ]
  );
}
function LoginForm() {
  let suggestions = ["alice", "bob", "charlie", "diana", "eve"];
  let randomSuggestion = _.sample(suggestions);
  return __jacJsx(
    Card,
    {
      title: "Login to LittleX",
      style: { maxWidth: "400px", margin: "50px auto" },
    },
    [
      __jacJsx("div", { style: { marginTop: "15px", textAlign: "center" } }, [
        randomSuggestion,
      ]),
      __jacJsx("form", { onSubmit: handle_login }, [
        __jacJsx(Space, { direction: "vertical", style: { width: "100%" } }, [
          __jacJsx("div", {}, [
            __jacJsx(Typography.Text, { strong: true }, ["Username:"]),
            __jacJsx(
              Input,
              {
                id: "username",
                placeholder: "Enter username",
                style: { marginTop: "5px" },
              },
              []
            ),
          ]),
          __jacJsx("div", {}, [
            __jacJsx(Typography.Text, { strong: true }, ["Password:"]),
            __jacJsx(
              Input,
              {
                type: "password",
                id: "password",
                placeholder: "Enter password",
                style: { marginTop: "5px" },
              },
              []
            ),
          ]),
          __jacJsx(
            Button,
            { type: "primary", htmlType: "submit", block: true },
            ["Login"]
          ),
        ]),
      ]),
      __jacJsx("div", { style: { marginTop: "15px", textAlign: "center" } }, [
        __jacJsx(
          "a",
          {
            href: "#signup",
            onClick: go_to_signup,
            style: {
              color: "#1890ff",
              textDecoration: "none",
              cursor: "pointer",
            },
          },
          ["Don't have an account? Sign up"]
        ),
      ]),
    ]
  );
}
async function handle_login(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let success = await jacLogin(username, password);
  if (success) {
    navigate_to("home");
  } else {
    alert("Login failed. Please try again.");
  }
}
function SignupForm() {
  return __jacJsx(
    Card,
    {
      title: "Sign Up for LittleX",
      style: { maxWidth: "400px", margin: "50px auto" },
    },
    [
      __jacJsx("form", { onSubmit: handle_signup }, [
        __jacJsx(Space, { direction: "vertical", style: { width: "100%" } }, [
          __jacJsx("div", {}, [
            __jacJsx(Typography.Text, { strong: true }, ["Username:"]),
            __jacJsx(
              Input,
              {
                id: "signup-username",
                placeholder: "Enter username",
                required: true,
                style: { marginTop: "5px" },
              },
              []
            ),
          ]),
          __jacJsx("div", {}, [
            __jacJsx(Typography.Text, { strong: true }, ["Password:"]),
            __jacJsx(
              Input,
              {
                type: "password",
                id: "signup-password",
                placeholder: "Enter password",
                required: true,
                style: { marginTop: "5px" },
              },
              []
            ),
          ]),
          __jacJsx("div", {}, [
            __jacJsx(Typography.Text, { strong: true }, ["Confirm Password:"]),
            __jacJsx(
              Input,
              {
                type: "password",
                id: "signup-password-confirm",
                placeholder: "Confirm password",
                required: true,
                style: { marginTop: "5px" },
              },
              []
            ),
          ]),
          __jacJsx(
            Button,
            { type: "primary", htmlType: "submit", block: true },
            ["Sign Up"]
          ),
        ]),
      ]),
      __jacJsx("div", { style: { marginTop: "15px", textAlign: "center" } }, [
        __jacJsx(
          "a",
          {
            href: "#login",
            onClick: go_to_login,
            style: {
              color: "#1890ff",
              textDecoration: "none",
              cursor: "pointer",
            },
          },
          ["Already have an account? Login"]
        ),
      ]),
    ]
  );
}
function go_to_login(event) {
  event.preventDefault();
  navigate_to("login");
}
function go_to_signup(event) {
  event.preventDefault();
  navigate_to("signup");
}
function go_to_home(event) {
  event.preventDefault();
  navigate_to("home");
}
function go_to_profile(event) {
  event.preventDefault();
  navigate_to("profile");
}
async function handle_signup(event) {
  event.preventDefault();
  let username = document.getElementById("signup-username").value;
  let password = document.getElementById("signup-password").value;
  let password_confirm = document.getElementById(
    "signup-password-confirm"
  ).value;
  if (password !== password_confirm) {
    alert("Passwords do not match!");
    return;
  }
  if (username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }
  let result = await jacSignup(username, password);
  if (result.get("success")) {
    alert("Account created successfully! Welcome to LittleX!");
    navigate_to("home");
  } else {
    alert(result.get("error", "Signup failed"));
  }
}
function logout_action() {
  jacLogout();
  navigate_to("login");
}
function App() {
  let route = get_current_route();
  let nav_bar = build_nav_bar(route);
  let content_view = get_view_for_route(route);
  return __jacJsx("div", { class: "app-container" }, [nav_bar, content_view]);
}
function get_view_for_route(route) {
  if (route === "signup") {
    return SignupForm();
  }
  if (route === "home") {
    return HomeViewLoader();
  }
  if (route === "profile") {
    return ProfileView();
  }
  return LoginForm();
}
function HomeViewLoader() {
  load_home_view();
  return __jacJsx("div", { style: { textAlign: "center", padding: "50px" } }, [
    __jacJsx(Card, {}, [
      __jacJsx(Typography.Title, { level: 2 }, ["Loading feed..."]),
    ]),
  ]);
}
async function load_home_view() {
  let view = await HomeView();
  let root = document.getElementById("__jac_root");
  if (true) {
    renderJsxTree(
      __jacJsx("div", { class: "app-container" }, [build_nav_bar("home"), view])
    );
  }
}
function build_nav_bar(route) {
  if (!jacIsLoggedIn() || route === "login" || route === "signup") {
    return null;
  }
  return __jacJsx(
    "div",
    {
      style: {
        backgroundColor: "#1890ff",
        padding: "0 24px",
        marginBottom: "20px",
      },
    },
    [
      __jacJsx(
        "div",
        {
          style: {
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          },
        },
        [
          __jacJsx(
            "a",
            {
              href: "#home",
              onClick: go_to_home,
              style: {
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                cursor: "pointer",
              },
            },
            ["Home"]
          ),
          __jacJsx(
            "a",
            {
              href: "#profile",
              onClick: go_to_profile,
              style: {
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                cursor: "pointer",
              },
            },
            ["Profile"]
          ),
          __jacJsx(
            Button,
            {
              type: "primary",
              ghost: true,
              onClick: logout_action,
              style: { marginLeft: "auto" },
            },
            ["Logout"]
          ),
        ]
      ),
    ]
  );
}
async function HomeView() {
  if (!jacIsLoggedIn()) {
    navigate_to("login");
    return __jacJsx("div", {}, []);
  }
  try {
    let result = await load_feed();
    let tweets = [];
    if (result && result.reports && result.reports.length > 0) {
      let feed_data = result.reports[0];
      for (const item of feed_data) {
        if (item.Tweet_Info) {
          let tweet_info = item.Tweet_Info;
          tweets.append(ClientTweet());
        }
      }
    }
    return FeedView(tweets);
  } catch (e) {
    return __jacJsx("div", { style: { padding: "20px" } }, [
      __jacJsx(Card, {}, [
        __jacJsx(Typography.Text, { type: "danger" }, [
          "Error loading feed: ",
          String(e),
        ]),
      ]),
    ]);
  }
}
function ProfileView() {
  if (!jacIsLoggedIn()) {
    navigate_to("login");
    return __jacJsx("div", {}, []);
  }
  return __jacJsx(
    "div",
    { style: { maxWidth: "600px", margin: "20px auto", padding: "24px" } },
    [
      __jacJsx(
        Card,
        { title: __jacJsx(Typography.Title, { level: 2 }, ["Profile"]) },
        [
          __jacJsx(Typography.Paragraph, {}, [
            "Profile information will be displayed here.",
          ]),
        ]
      ),
    ]
  );
}
function littlex_app() {
  init_router();
  return App();
}
