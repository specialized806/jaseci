""" Basic JSX test fixture """

with entry {
    # Simple self-closing element
    let elem1 = <div />;

    # Component
    let elem2 = <MyComponent />;

    # Element with attributes
    let elem3 = <button id="submit" disabled />;

    v = <div id={name} data-age={age}>User Info</div>;
}
