cl import from .feed {Feed}
cl import from 'antd' {Button}
cl def Post() -> any {
    return <div>
        <h1>Post</h1>
        <Feed />
        <Button>Click Me</Button>
    </div>;
}