# Jac Client

Build full-stack web applications with Jac - one language for frontend and backend.

Jac Client enables you to write React-like components, manage state, and build interactive UIs all in Jac. No need for separate frontend frameworks, HTTP clients, or complex build configurations.

---

## ✨ Features

- **Single Language**: Write frontend and backend in Jac
- **No HTTP Client**: Use `__jacSpawn()` instead of fetch/axios
- **Reactive State**: Built-in state management with `createState()`
- **Component-Based**: Build reusable UI components with JSX
- **Graph Database**: Built-in graph data model eliminates need for SQL/NoSQL
- **Type Safety**: Type checking across frontend and backend
- **Vite-Powered**: Optimized production bundles with Vite

---

## 🚀 Quick Start

### Installation

```bash
pip install jac-client
```

### Create a New App

```bash
jac create_jac_app my-app
cd my-app
jac serve app.jac
```

Visit `http://localhost:8000` to see your app!

---

## 📚 Documentation

For detailed guides and tutorials, see the **[docs folder](jac_client/docs/)**:

- **[Getting Started Guide](jac_client/docs/README.md)** - Complete beginner's guide
- **[Routing](jac_client/docs/routing.md)** - Multi-page applications with `initRouter()`
- **[Lifecycle Hooks](jac_client/docs/lifecycle-hooks.md)** - Using `onMount()` for initialization
- **[Advanced State](jac_client/docs/advanced-state.md)** - Managing complex state
- **[Imports](jac_client/docs/imports.md)** - Importing libraries, Jac files, and JavaScript modules

---

## 💡 Example

```jac
cl {
    let [count, setCount] = createState({"value": 0});

    def Counter() -> any {
        s = count();
        return <div>
            <h1>Count: {s.value}</h1>
            <button onClick={lambda -> None {
                setCount({"value": s.value + 1});
            }}>
                Increment
            </button>
        </div>;
    }

    def jac_app() -> any {
        return Counter();
    }
}
```

---

## 🔧 Requirements

- Python: 3.12+
- Node.js: For npm and Vite
- Jac Language: `jaclang` (installed automatically)

---

## 🛠️ How It Works

Jac Client is a plugin that:
1. Compiles your `.jac` client code to JavaScript
2. Bundles dependencies with Vite for optimal performance
3. Provides a runtime for reactive state and components
4. Integrates seamlessly with Jac's backend graph operations

---

## 📖 Learn More

- **Full Documentation**: See [docs/](jac_client/docs/) for comprehensive guides
- **Examples**: Check `jac_client/examples/` for working examples
- **Issues**: Report bugs on [GitHub Issues](https://github.com/Jaseci-Labs/jaseci/issues)

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) file.

---

**Happy coding with Jac!** 🎉
