// Functions jacLogin, jacLogout, jacSignup, renderJsxTree are provided by runtime.js
import _ from 'lodash';
import 'materialize-css/dist/css/materialize.min.css';
// ===== COMPREHENSIVE JAVASCRIPT IMPORT EXAMPLES =====

// === NPM MODULE IMPORTS ===

// 1. Default imports
// import React from 'react';
// import Vue from 'vue';
// import axios from 'axios';
// import moment from 'moment';

// 2. Named imports
// import { useState, useEffect, useContext } from 'react';
// import { mapState, mapActions } from 'vuex';
// import { debounce, throttle } from 'lodash';
// import { format, parseISO } from 'date-fns';

// 3. Mixed default and named imports
// import React, { Component, PropTypes } from 'react';
// import Vue, { createApp } from 'vue';
// import axios, { AxiosError } from 'axios';

// 4. Namespace imports
// import * as React from 'react';
// import * as _ from 'lodash';
// import * as utils from 'date-fns';

// 5. Side-effect only imports (CSS, polyfills, etc.)
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'materialize-css/dist/css/materialize.min.css';
// import 'normalize.css/normalize.css';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// 6. Dynamic imports (async)
// const module = await import('./module.js');
// const { default: Component } = await import('react');

// === LOCAL MODULE IMPORTS ===

// 7. Default exports from local files
// import App from './components/App.js';
// import Header from './components/Header';
// import Footer from './components/Footer.jsx';
// import utils from './utils/helpers';

// 8. Named exports from local files
// import { validateEmail, formatDate, debounce } from './utils/helpers';
// import { Button, Input, Modal } from './components/ui';
// import { API_BASE_URL, DEFAULT_TIMEOUT } from './config/constants';

// 9. Mixed imports from local files
// import App, { AppProvider, AppContext } from './components/App';
// import utils, { formatCurrency, parseJSON } from './utils/helpers';

// 10. Relative path imports
// import './styles/main.css';
// import '../assets/images/logo.png';
// import '../../shared/components/Button';
// import '../../../config/settings';

// 11. Index file imports (barrel exports)
// import { Button, Input, Modal } from './components';
// import { api, auth, storage } from './services';
// import { colors, fonts, spacing } from './theme';

// 12. JSON imports
// import packageInfo from './package.json';
// import config from './config.json';
// import translations from './locales/en.json';


const appState = {"current_route": "login", "tweets": [], "loading": false};
function navigate_to(route) {
  console.log("Navigating to:", route);
  appState["current_route"] = route;
  window.history.pushState({}, "", "#" + route);
  render_app();
}

// Utility function using lodash to demonstrate npm module integration
function formatUsername(username) {
  return _.capitalize(_.trim(username));
}
function render_app() {
  console.log("render_app called, route:", appState.get("current_route", "unknown"));
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
  return __jacJsx("div", {"class": "tweet-card", "style": {"border": "1px solid #e1e8ed", "padding": "15px", "margin": "10px 0", "borderRadius": "8px"}}, [__jacJsx("div", {"class": "tweet-header", "style": {"fontWeight": "bold", "marginBottom": "8px"}}, ["@", formatUsername(tweet.username)]), __jacJsx("div", {"class": "tweet-content", "style": {"marginBottom": "12px"}}, [tweet.content]), __jacJsx("div", {"class": "tweet-actions", "style": {"display": "flex", "gap": "15px"}}, [__jacJsx("button", {"onclick": like_tweet_action(tweet.id), "style": {"padding": "5px 10px", "cursor": "pointer"}}, ["Like (", tweet.likes.length, ")"]), __jacJsx("button", {"style": {"padding": "5px 10px"}}, ["Comment (", tweet.comments.length, ")"])])]);
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
  // Generate a random username suggestion using lodash
  const suggestions = ['alice', 'bob', 'charlie', 'diana', 'eve'];
  const randomSuggestion = _.sample(suggestions);
  
  return __jacJsx("div", {"class": "container", "style": {"marginTop": "50px"}}, [
    __jacJsx("div", {"class": "row"}, [
      __jacJsx("div", {"class": "col s12 m6 offset-m3"}, [
        __jacJsx("div", {"class": "card blue-grey darken-1"}, [
          __jacJsx("div", {"class": "card-content white-text"}, [
            __jacJsx("span", {"class": "card-title"}, ["Login to LittleX"]),
            __jacJsx("form", {"onsubmit": handle_login}, [
              __jacJsx("div", {"class": "input-field"}, [
                __jacJsx("input", {"type": "text", "id": "username", "placeholder": `Try: ${randomSuggestion}`, "class": "white-text"}, []),
                __jacJsx("label", {"for": "username"}, ["Username"])
              ]),
              __jacJsx("div", {"class": "input-field"}, [
                __jacJsx("input", {"type": "password", "id": "password", "class": "white-text"}, []),
                __jacJsx("label", {"for": "password"}, ["Password"])
              ]),
              __jacJsx("button", {"type": "submit", "class": "btn waves-effect waves-light", "style": {"width": "100%", "marginTop": "20px"}}, ["Login"])
            ])
          ]),
          __jacJsx("div", {"class": "card-action"}, [
            __jacJsx("a", {"href": "#signup", "onclick": go_to_signup, "style": {"color": "#ffeb3b"}}, ["Don't have an account? Sign up"]),
            __jacJsx("div", {"style": {"marginTop": "10px", "fontSize": "12px", "color": "#b0bec5", "fontStyle": "italic"}}, [`💡 Lodash demo: Random suggestion generated using _.sample(): "${randomSuggestion}"`])
          ])
        ])
      ])
    ])
  ]);
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
  return __jacJsx("nav", {"class": "blue-grey darken-2"}, [
    __jacJsx("div", {"class": "nav-wrapper container"}, [
      __jacJsx("a", {"href": "#home", "onclick": go_to_home, "class": "brand-logo"}, ["LittleX"]),
      __jacJsx("ul", {"class": "right hide-on-med-and-down"}, [
        __jacJsx("li", {}, [__jacJsx("a", {"href": "#home", "onclick": go_to_home}, ["Home"])]),
        __jacJsx("li", {}, [__jacJsx("a", {"href": "#profile", "onclick": go_to_profile}, ["Profile"])]),
        __jacJsx("li", {}, [__jacJsx("a", {"onclick": logout_action, "class": "waves-effect waves-light btn red"}, ["Logout"])])
      ])
    ])
  ]);
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
