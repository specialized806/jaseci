""" JSX with component names test fixture """

with entry {
    # Component with capitalized name
    let comp1 = <MyComponent />;

    # Component with props
    let comp2 = <Button color="blue" size="large">Submit</Button>;

    # Namespaced component
    let comp3 = <UI.Button />;
    let comp4 = <Form.Input.Text />;

    # Nested components
    let app = <App>
        <Header />
        <Main>
            <Sidebar />
            <Content />
        </Main>
        <Footer />
    </App>;
}
