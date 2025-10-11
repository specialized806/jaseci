""" Nested JSX test fixture """

with entry {
    # Nested elements
    let card = <div>
        <h1>{"Title"}</h1>
        <p>{"Description"}</p>
        <button>{"Click"}</button>
    </div>;

    # Deeply nested
    let layout = <div>
        <header>
            <nav>
                <a>{"Home"}</a>
                <a>{"About"}</a>
            </nav>
        </header>
        <main>
            <article>{"Content here"}</article>
        </main>
    </div>;
}
