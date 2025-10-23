import { jacLogin, jacLogout, jacSignup, renderJsxTree } from "client_runtime";
import * as _ from "lodash";
const appState = {"current_route": "login", "tweets": [], "loading": false};
function navigate_to(route) {
  console.log("Navigating to:", route);
  appState["current_route"] = route;
  window.history.pushState({}, "", "#" + route);
  render_app();
}
function render_app() {
  console.log("render_app called, route:", appState.gedt("current_route", "unknown"));
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
  return __jacJsx("div", {"class": "tweet-card", "style": {"border": "1px solid #e1e8ed", "padding": "15px", "margin": "10px 0", "borderRadius": "8px"}}, [__jacJsx("div", {"class": "tweet-header", "style": {"fontWeight": "bold", "marginBottom": "80px"}}, ["@", tweet.username]), __jacJsx("div", {"class": "tweet-content", "style": {"marginBottom": "12px"}}, [tweet.content]), __jacJsx("div", {"class": "tweet-actions", "style": {"display": "flex", "gap": "15px"}}, [__jacJsx("button", {"onclick": like_tweet_action(tweet.id), "style": {"padding": "5px 10px", "cursor": "pointer"}}, ["Like (", tweet.likes.length, ")"]), __jacJsx("button", {"style": {"padding": "5px 10px"}}, ["Comment (", tweet.comments.length, ")"])])]);
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
  return __jacJsx("div", {"class": "feed-container", "style": {"maxWidth": "600px", "margin": "0 auto", "fontFamily": "sans-serif"}}, [__jacJsx("div", {"class": "feed-header", "style": {"padding": "20px", "borderBottom": "1px solid #e1e8ed"}}, [__jacJsx("h1", {"style": {"margin": "0"}}, ["LittleX Feed"])]), __jacJsx("div", {"class": "feed-content"}, [null])]);
}
function LoginForm() {
  let suggestions = ["alice", "bob", "charlie", "diana", "eve"];
  let randomSuggestion = _.sample(suggestions);
  return __jacJsx("div", {"class": "login-container", "style": {"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {"style": {"marginTop": "0"}}, ["Login to LittleX"]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [randomSuggestion]), __jacJsx("form", {"onsubmit": handle_login}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "username", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "password", "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Login"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx("a", {"href": "#signup", "onclick": go_to_signup, "style": {"color": "#1da1f2", "textDecoration": "none", "cursor": "pointer"}}, ["Don't have an account? Sign up"])])]);
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
  return __jacJsx("div", {"class": "signup-container", "style": {"maxWidth": "400px", "margin": "50px auto", "padding": "20px", "border": "1px solid #e1e8ed", "borderRadius": "8px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {"style": {"marginTop": "0"}}, ["Sign Up for LittleX"]), __jacJsx("form", {"onsubmit": handle_signup}, [__jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Username:"]), __jacJsx("input", {"type": "text", "id": "signup-username", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("div", {"style": {"marginBottom": "15px"}}, [__jacJsx("label", {"style": {"display": "block", "marginBottom": "5px"}}, ["Confirm Password:"]), __jacJsx("input", {"type": "password", "id": "signup-password-confirm", "required": true, "style": {"width": "100%", "padding": "8px", "boxSizing": "border-box"}}, [])]), __jacJsx("button", {"type": "submit", "style": {"width": "100%", "padding": "10px", "backgroundColor": "#1da1f2", "color": "white", "border": "none", "borderRadius": "4px", "cursor": "pointer"}}, ["Sign Up"])]), __jacJsx("div", {"style": {"marginTop": "15px", "textAlign": "center"}}, [__jacJsx("a", {"href": "#login", "onclick": go_to_login, "style": {"color": "#1da1f2", "textDecoration": "none", "cursor": "pointer"}}, ["Already have an account? Login"])])]);
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
  let password_confirm = document.getElementById("signup-password-confirm").value;
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
  return __jacJsx("div", {"class": "app-container"}, [nav_bar, content_view]);
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
  return __jacJsx("div", {"style": {"textAlign": "center", "padding": "50px", "fontFamily": "sans-serif"}}, [__jacJsx("h2", {}, ["Loading feed..."])]);
}
async function load_home_view() {
  let view = await HomeView();
  let root = document.getElementById("__jac_root");
  if (true) {
    renderJsxTree(__jacJsx("div", {"class": "app-container"}, [build_nav_bar("home"), view]));
  }
}
function build_nav_bar(route) {
  if (!jacIsLoggedIn() || route === "login" || route === "signup") {
    return null;
  }
  return __jacJsx("nav", {"style": {"backgroundColor": "#1da1f2", "padding": "15px", "marginBottom": "20px"}}, [__jacJsx("div", {"style": {"maxWidth": "600px", "margin": "0 auto", "display": "flex", "gap": "20px", "alignItems": "center"}}, [__jacJsx("a", {"href": "#home", "onclick": go_to_home, "style": {"color": "white", "textDecoration": "none", "fontWeight": "bold", "cursor": "pointer"}}, ["Home"]), __jacJsx("a", {"href": "#profile", "onclick": go_to_profile, "style": {"color": "white", "textDecoration": "none", "fontWeight": "bold", "cursor": "pointer"}}, ["Profile"]), __jacJsx("button", {"onclick": logout_action, "style": {"marginLeft": "auto", "padding": "5px 15px", "backgroundColor": "white", "color": "#1da1f2", "border": "none", "borderRadius": "4px", "cursor": "pointer", "fontWeight": "bold"}}, ["Logout"])])]);
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
    return __jacJsx("div", {"style": {"padding": "20px", "color": "red"}}, ["Error loading feed:", String(e)]);
  }
}
function ProfileView() {
  if (!jacIsLoggedIn()) {
    navigate_to("login");
    return __jacJsx("div", {}, []);
  }
  return __jacJsx("div", {"class": "profile-container", "style": {"maxWidth": "600px", "margin": "20px auto", "padding": "20px", "fontFamily": "sans-serif"}}, [__jacJsx("h1", {}, ["Profile"]), __jacJsx("div", {"style": {"padding": "15px", "border": "1px solid #e1e8ed", "borderRadius": "8px"}}, [__jacJsx("p", {}, ["Profile information will be displayed here."])])]);
}
function littlex_app() {
  init_router();
  return App();
}
