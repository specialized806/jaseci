""" JSX fragments test fixture """

with entry {
    # Empty fragment
    let frag1 = <></>;

    # Fragment with children
    let frag2 = <>
        <h1>{"Title"}</h1>
        <p>{"Paragraph"}</p>
    </>;

    # Fragment with mixed content
    let frag3 = <>
        {"Some text"}
        <div>{"Element"}</div>
        {"More text"}
        <span>{"Inline"}</span>
    </>;
}
