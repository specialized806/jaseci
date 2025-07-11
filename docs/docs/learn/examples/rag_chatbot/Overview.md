# MCP Chatbot Overview

This project demonstrates a modern Retrieval-Augmented Generation (RAG) chatbot built using the Jac programming language, MTLLM, Jac Cloud, and Model Context Protocol (MCP) servers. It combines document ingestion, semantic search, and large language models (LLMs) to deliver a conversational AI experience that can answer questions based on your own documents—including images and videos.

## Key Features

- **Document, Image & Video Upload & Ingestion**: Upload PDF, image, and video files, which are automatically processed and indexed for semantic and multimodal search.
- **Retrieval-Augmented Generation**: Combines LLMs with document and media retrieval for accurate, context-aware answers.
- **Web Search Integration**: Optionally augments responses with real-time web search results.
- **MCP Server Architecture**: Uses Model Context Protocol for modular tool management and better scalability.
- **Streamlit Frontend**: User-friendly chat interface for interacting with the bot and uploading documents, images, and videos.
- **API Server**: RESTful endpoints for chat, document/media upload, and more, powered by Jac Cloud.
- **Session Management**: Maintains chat history and user sessions.
- **Multimodal Chat**: Users can chat about uploaded images and videos, not just text documents.

## Technologies Used
- Jac & Jac Cloud & Jac MTLLM
- Model Context Protocol (MCP)
- LangChain, ChromaDB, PyPDF, Streamlit
- OpenAI or local LLMs (Ollama)
- Multimodal LLMs and media processing libraries

## Architecture

- **client.jac**: Implements the Streamlit-based frontend for chat and document/image/video upload.
- **server.jac**: Hosts the API, manages sessions, and coordinates with MCP tools using ReAct pattern.
- **mcp_server.jac**: MCP server that exposes document, image, and video search tools.
- **mcp_client.jac**: Client interface for communicating with MCP servers.
- **tools.jac**: Contains the RAG engine, multimodal and web search implementations used by the MCP server.


=== "Frontend Preview"
    ![RAG Chatbot Frontend](images/chatbot.jpg)

=== "client.jac"
    ```jac linenums="1"
    --8<-- "docs/learn/examples/rag_chatbot/solution/client.jac"
    ```

=== "mcp_server.jac"
    ```jac linenums="1"
    --8<-- "docs/learn/examples/rag_chatbot/solution/mcp_server.jac"
    ```

=== "mcp_client.jac"
    ```jac linenums="1"
    --8<-- "docs/learn/examples/rag_chatbot/solution/mcp_client.jac"
    ```

=== "server.jac"
    ```jac linenums="1"
    --8<-- "docs/learn/examples/rag_chatbot/solution/server.jac"
    ```

=== "tools.jac"
    ```jac linenums="1"
    --8<-- "docs/learn/examples/rag_chatbot/solution/tools.jac"
    ```

---

## How to Run

Install the necessary dependencies
```bash
pip install jaclang jac-cloud jac-streamlit mtllm langchain langchain-community langchain-openai langchain-chroma chromadb openai pypdf tiktoken requests mcp[cli] anyio
```

To use the Web Search, get a free API key from [Serper](https://serper.dev/).
```bash
export OPENAI_API_KEY=<your-openai-key>
export SERPER_API_KEY=<your-serper-key>
```

To run the MCP server (in one terminal)
```bash
jac run mcp_server.jac
```

To run the main server (in another terminal)
```bash
jac serve server.jac
```

To run the frontend (in a third terminal)
```bash
jac streamlit client.jac
```


For full setup instructions and advanced usage, see `Full Guide`.
