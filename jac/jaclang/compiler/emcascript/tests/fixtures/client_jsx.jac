cl let API_URL: str = "https://api.example.com";

cl obj ButtonProps {
    has label: str = "Hello";
    has count: int = 0;
}

cl def component() {
    return <div class="box">
        <h1>Hello</h1>
        <p>Welcome!</p>
    </div>;
}

def server_only() {
    return "not included";
}
