# MCP Chatbot Full Guide

## 1. Introduction & Overview
This guide will walk you through building a state-of-the-art Retrieval-Augmented Generation (RAG) chatbot using Jac Cloud, Jac-Streamlit, Model Context Protocol (MCP), LangChain, ChromaDB, and modern LLMs. You'll learn to:

- Upload and index your own documents (PDFs), images, and videos
- Chat with an AI assistant that uses both your documents, images, videos, and LLMs
- Build modular MCP servers for tool management
- Use ReAct pattern for intelligent tool orchestration
- Leverage multimodal LLMs for image and video understanding

## 2. Features & Architecture
- **Document, Image & Video Upload & Ingestion**: Upload PDFs, images, and videos, which are processed and indexed for semantic and multimodal search.
- **Retrieval-Augmented Generation**: Combines LLMs with document and media retrieval for context-aware answers.
- **Web Search Integration**: Optionally augments responses with real-time web search results.
- **MCP Server Architecture**: Uses Model Context Protocol for modular, scalable tool management.
- **ReAct Pattern**: Intelligent reasoning and acting with tools using the ReAct methodology.
- **Streamlit Frontend**: User-friendly chat interface.
- **Session Management**: Maintains chat history and user sessions.
- **Multimodal Chat**: Users can chat about uploaded images and videos, not just text documents.

**Project Structure:**

- `client.jac`: Streamlit frontend for chat and document/image/video upload
- `server.jac`: Jac Cloud API server with session management and ReAct orchestration
- `mcp_server.jac`: MCP server exposing document, image, and video search tools
- `mcp_client.jac`: Client interface for communicating with MCP servers
- `tools.jac`: RAG engine, multimodal and web search implementations
- `docs/`: Example PDFs, images, and videos for testing

## 3. Full Source Code

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

## 4. Setup Instructions
1. **Install dependencies** (Python 3.12+ recommended):
   ```bash
   pip install jaclang jac-cloud jac-streamlit mtllm langchain langchain-community langchain-openai langchain-chroma chromadb openai pypdf tiktoken requests mcp[cli] anyio
   ```
2. **Set environment variables** (for LLMs and web search):
   ```bash
   export OPENAI_API_KEY=<your-openai-key>
   export SERPER_API_KEY=<your-serper-key>
   ```
   Get a free Serper API key at [serper.dev](https://serper.dev/).
3. **Start the MCP server** (in one terminal):
   ```bash
   jac run mcp_server.jac
   ```
4. **Start the Jac Chatbot server** (in another terminal):
   ```bash
   jac serve server.jac
   ```
5. **Run the Streamlit frontend** (in a third terminal):
   ```bash
   jac streamlit client.jac
   ```

## 5. Streamlit Frontend (`client.jac`)
The frontend is built with Jac-Streamlit and handles authentication, PDF/image/video upload, and chat with an improved user experience. Users can upload images and videos in addition to PDFs, and chat about their content.

**Updated Title and Chat Logic:**
```jac
--8<-- "docs/learn/examples/rag_chatbot/solution/client.jac"
```

## 6. MCP Server Architecture (`mcp_server.jac`)
The MCP server exposes tools for document, image, and video search using the Model Context Protocol.

```jac
--8<-- "docs/learn/examples/rag_chatbot/solution/mcp_server.jac"
```

## 7. MCP Client Interface (`mcp_client.jac`)
The MCP client handles communication with the MCP server.

```jac
--8<-- "docs/learn/examples/rag_chatbot/solution/mcp_client.jac"
```

## 8. RAG Engine & Web Search (`tools.jac`)
The RAG engine manages document and media ingestion, chunking, embedding, and retrieval for text, images, and videos.

```jac
--8<-- "docs/learn/examples/rag_chatbot/solution/tools.jac"
```

## 9. Backend Logic & Session Handling (`server.jac`)
The backend manages sessions, chat history, and coordinates with MCP tools using the ReAct pattern. The LLM can reason about and use multimodal tools for images and videos as well as text.

```jac
--8<-- "docs/learn/examples/rag_chatbot/solution/server.jac"
```

## 10. Usage Guide
- Open the Streamlit app in your browser.
- Upload one or more PDF, image, or video files. The backend will process and index them.
- Start chatting! Ask questions about the uploaded documents, images, videos, or general queries.
- The bot will use both your documents, media, and LLMs to answer.

## 11. API Endpoints (selected)
- `POST /user/register` — Register a new user
- `POST /user/login` — Login and receive an access token
- `POST /walker/upload_pdf` — Upload a PDF (requires Bearer token)
- `POST /walker/upload_media` — Upload an image or video (requires Bearer token)
- `POST /walker/interact` — Chat endpoint (requires Bearer token)

See `http://localhost:8000/docs` for full Swagger API documentation.

## 12. Advanced Features
- **Web Search**: If enabled and API key is set, the bot can augment answers with real-time web search results.
- **ChromaDB Vector Search**: Efficient semantic search over your documents and media.
- **Session Management**: Each chat session is tracked for context.
- **MCP Architecture**: Modular tool system using Model Context Protocol.
- **ReAct Pattern**: Intelligent reasoning and acting capabilities, including multimodal reasoning.
- **Multimodal LLMs**: Supports chat and reasoning over images and videos as well as text.
- **Extensible**: Add new walkers or endpoints in Jac for custom logic.

## 13. Troubleshooting
- Ensure all dependencies are installed and compatible with your Python version.
- Make sure to start the MCP server before the main server.
- If document or media upload fails, check server logs for errors.
- For LLM/API issues, verify your API keys and environment variables.
- Check that all three services (MCP server, main server, frontend) are running on their respective ports.

---
For a quick overview, see `Overview`.
