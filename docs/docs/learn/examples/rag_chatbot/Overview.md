# RAG Chatbot with Jac Cloud — Overview

This project demonstrates a modern Retrieval-Augmented Generation (RAG) chatbot built using the Jac programming language, Jac Cloud, and Streamlit. It combines document ingestion, semantic search, and large language models (LLMs) to deliver a conversational AI experience that can answer questions based on your own documents.

## Key Features

- **Document Upload & Ingestion**: Upload PDF files, which are automatically processed and indexed for semantic search.
- **Retrieval-Augmented Generation**: Combines LLMs with document retrieval for accurate, context-aware answers.
- **Web Search Integration**: Optionally augments responses with real-time web search results.
- **Streamlit Frontend**: User-friendly chat interface for interacting with the bot and uploading documents.
- **API Server**: RESTful endpoints for chat, document upload, and more, powered by Jac Cloud.
- **Session Management**: Maintains chat history and user sessions.

## Architecture

- **client.jac**: Implements the Streamlit-based frontend for chat and document upload.
- **server.jac**: Hosts the API, manages sessions, LLM calls, and web search.
- **rag.jac**: Handles document loading, splitting, embedding, and vector search using ChromaDB and LangChain.

## Technologies Used
- Jac & Jac Cloud
- LangChain, ChromaDB, PyPDF, Streamlit
- OpenAI or local LLMs (Ollama)

---
For full setup instructions and advanced usage, see `README.full.md`.
