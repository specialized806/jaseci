# Jac Streamlit Plugin

The Jac Streamlit plugin enables you to create interactive web applications using Streamlit with Jac code. This plugin seamlessly integrates Jac's powerful features with Streamlit's web app capabilities, allowing you to build data science applications, dashboards, and interactive tools.

## Installation

The Jac Streamlit plugin needs to be installed separately using pip:

```bash
pip install jac-streamlit
```

This will install the plugin and make the `jac streamlit` command available.

## Quick Start

To run a Jac file as a Streamlit application, use the `jac streamlit` command:

```bash
jac streamlit your_app.jac
```

This command will:
1. Compile your Jac code
2. Launch a Streamlit web server
3. Open your app in the default web browser

### Example Applications

We've included several example applications to help you get started:

#### Simple Calculator
A basic calculator demonstrating form handling and user interaction:

```jac
--8<-- "learn/tools/examples/simple_calculator.jac"
```

#### Todo App
A todo application showcasing session state management:

```jac
--8<-- "learn/tools/examples/todo_app.jac"
```

You can run these examples with:
```bash
jac streamlit simple_calculator.jac
jac streamlit todo_app.jac
```

## Features

### 1. Full Streamlit API Access

You can use all Streamlit components and features in your Jac applications:

```jac
import streamlit as st;
import pandas as pd;
import numpy as np;

with entry {
    st.title("Data Dashboard");

    # Create sample data
    data = pd.DataFrame({
        'x': np.random.randn(100),
        'y': np.random.randn(100)
    });

    # Display chart
    st.line_chart(data);

    # Add sidebar
    st.sidebar.header("Controls");
    chart_type = st.sidebar.selectbox("Chart Type", ["line", "bar", "area"]);

    if chart_type == "bar" {
        st.bar_chart(data);
    } elif chart_type == "area" {
        st.area_chart(data);
    }
}
```

### 2. Session State Management

Streamlit's session state works seamlessly with Jac:

```jac
import streamlit as st;

with entry {
    st.title("Counter App");

    # Initialize session state
    if "counter" not in st.session_state {
        st.session_state.counter = 0;
    }

    # Display current count
    st.write("Current count: " + str(st.session_state.counter));

    # Buttons to modify counter
    col1, col2, col3 = st.columns(3);

    with col1 {
        if st.button("Increment") {
            st.session_state.counter += 1;
        }
    }

    with col2 {
        if st.button("Decrement") {
            st.session_state.counter -= 1;
        }
    }

    with col3 {
        if st.button("Reset") {
            st.session_state.counter = 0;
        }
    }
}
```


## Advanced Usage

### Integration with Jac Cloud

You can build Streamlit frontends that interact with Jac Cloud APIs:

```jac
import streamlit as st;
import requests;

def make_api_call(token: str, endpoint: str, payload: dict) -> dict {
    response = requests.post(
        "http://localhost:8000/" + endpoint,
        json=payload,
        headers={"Authorization": "Bearer " + token}
    );
    return response.json() if response.status_code == 200 else {};
}

with entry {
    st.title("Jac Cloud Frontend");

    # Authentication
    if "token" not in st.session_state {
        st.session_state.token = None;
    }

    if not st.session_state.token {
        with st.form("login_form") {
            email = st.text_input("Email");
            password = st.text_input("Password", type="password");

            if st.form_submit_button("Login") {
                # Attempt login
                response = requests.post(
                    "http://localhost:8000/user/login",
                    json={"email": email, "password": password}
                );

                if response.status_code == 200 {
                    st.session_state.token = response.json()["token"];
                    st.rerun();
                } else {
                    st.error("Login failed!");
                }
            }
        }
    } else {
        st.success("Logged in successfully!");

        # Your app content here
        user_input = st.text_input("Enter your message:");

        if st.button("Send") and user_input {
            result = make_api_call(
                st.session_state.token,
                "walker/interact",
                {"message": user_input}
            );

            if result {
                st.write("Response:", result);
            }
        }
    }
}
```



## Next Steps

- Check out the [Jac Cloud documentation](../jac-cloud/introduction.md) for backend integration
- Try building a complete application using Jac + Streamlit + Jac Cloud
