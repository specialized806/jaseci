""" JSX with spread attributes test fixture """

with entry {
    let props = "dummy_props";
    let extraProps = "extra_props";

    # Spread attribute
    let elem1 = <div {...props} />;

    # Multiple spreads
    let elem2 = <button {...props} {...extraProps}>{"Click"}</button>;

    # Mixed spread and normal attributes
    let elem3 = <input type="text" {...props} disabled />;
}
