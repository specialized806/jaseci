# Full Guide

## Overview
This project is a Retrieval-Augmented Generation (RAG) chatbot that leverages Jac Cloud, LangChain, ChromaDB, and Streamlit. It allows users to upload documents (PDFs), which are then indexed for semantic search. The chatbot can answer questions using both the uploaded documents and large language models (LLMs), optionally enhanced with real-time web search.

## Features
- Upload and index PDF documents for question answering
- Chat interface with persistent session history
- Retrieval-augmented answers using LLMs and your documents
- Optional web search integration for up-to-date information
- REST API for programmatic access

## Project Structure
- `client.jac`: Streamlit frontend for chat and document upload
- `server.jac`: Jac Cloud API server, session, LLM, and web search logic
- `rag.jac`: RAG engine for document loading, splitting, embedding, and vector search
- `docs/`: Example PDFs for testing

## Setup Instructions
1. **Install dependencies** (Python 3.12+ recommended):
   ```bash
   pip install jaclang jac-cloud jac-streamlit langchain chromadb pypdf openai ollama
   ```
2. **Start the Jac Cloud server**:
   ```bash
   jac serve solution/server.jac
   ```
3. **Register and login a user** (see API section or use Swagger UI at `http://localhost:8000/docs`):
   ```bash
   curl --location 'http://localhost:8000/user/register' \
     --header 'Content-Type: application/json' \
     --data '{"email": "test@mail.com", "password": "password"}'
   # Then login to get your access token
   curl --location 'http://localhost:8000/user/login' \
     --header 'Content-Type: application/json' \
     --data '{"email": "test@mail.com", "password": "password"}'
   ```
4. **Run the Streamlit frontend**:
   ```bash
   jac run solution/client.jac
   ```
   Or, if using a Python wrapper for Streamlit, adapt as needed.

## Usage Guide
- Open the Streamlit app in your browser.
- Upload one or more PDF files. The backend will process and index them.
- Start chatting! Ask questions about the uploaded documents or general queries.
- The bot will use both your documents and LLMs to answer.

## API Endpoints (selected)
- `POST /user/register` — Register a new user
- `POST /user/login` — Login and receive an access token
- `POST /walker/upload_pdf` — Upload a PDF (requires Bearer token)
- `POST /walker/interact` — Chat endpoint (requires Bearer token)

See `http://localhost:8000/docs` for full Swagger API documentation.

## Advanced Features
- **Web Search**: If enabled and API key is set, the bot can augment answers with real-time web search results.
- **ChromaDB Vector Search**: Efficient semantic search over your documents.
- **Session Management**: Each chat session is tracked for context.
- **Extensible**: Add new walkers or endpoints in Jac for custom logic.

## Troubleshooting
- Ensure all dependencies are installed and compatible with your Python version.
- If document upload fails, check server logs for errors.
- For LLM/API issues, verify your API keys and environment variables.

---
For a quick overview, see `README.md`.
