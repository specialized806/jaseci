# cl import from antd {
#     Card
# }
# cl import from antd {
#     Button
# }
cl import from .post {
    Post
}
cl def Feed() -> any {
    return <div>
        <h1>Feed</h1>
        # <Card>
        #     <h2>Post 1</h2>
        # </Card>
        # <Button>Click Me</Button>
        <Post />
    </div>;
}