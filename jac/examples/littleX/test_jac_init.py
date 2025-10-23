#!/usr/bin/env python3
"""Test the Jac initialization script generation."""

from jaclang.runtimelib.vite_client_bundle import ViteClientBundleBuilder

def test_jac_init_script():
    """Test that the Jac initialization script is generated correctly."""
    
    builder = ViteClientBundleBuilder()
    
    # Test with sample functions
    test_functions = [
        "navigate_to", "render_app", "get_current_route", "handle_popstate", 
        "init_router", "TweetCard", "like_tweet_action", "FeedView", 
        "LoginForm", "handle_login", "SignupForm", "go_to_login", 
        "go_to_signup", "go_to_home", "go_to_profile", "handle_signup", 
        "logout_action", "App", "get_view_for_route", "HomeViewLoader", 
        "load_home_view", "build_nav_bar", "HomeView", "ProfileView", 
        "littlex_app"
    ]
    
    init_script = builder._generate_jac_init_script("littleX_single_nodeps", test_functions)
    
    print("Generated Jac initialization script:")
    print("=" * 50)
    print(init_script)
    print("=" * 50)
    
    # Check for key components
    assert "clientFunctions" in init_script, "Missing clientFunctions"
    assert "functionMap" in init_script, "Missing functionMap"
    assert "__jacRegisterClientModule" in init_script, "Missing module registration"
    assert "globalThis.start_app" in init_script, "Missing start_app assignment"
    assert "littlex_app" in init_script, "Missing main app function"
    assert "littlex_app" in init_script, "Missing main app function"
    
    print("✅ All key components found in initialization script!")
    return True

if __name__ == "__main__":
    test_jac_init_script()
