# Tax Assistant

A full-stack Retrieval-Augmented Generation (RAG) chatbot designed to answer tax-related questions using official Canadian tax documents.

The application combines FastAPI, Next.js, ChromaDB, LangChain, and Ollama to provide document-grounded responses with page-level source citations. Unlike traditional chatbots, answers are generated from retrieved tax documents rather than relying solely on LLM knowledge.

## Key Highlights

- Full-stack AI application
- Retrieval-Augmented Generation (RAG)
- Local LLM deployment with Ollama
- Vector search with ChromaDB
- PDF ingestion pipeline
- Dynamic model selection
- Source citations and explainability
- No paid APIs required

## Project Structure

```text
tax_assistant/
├── frontend/          → Next.js front-end (chat UI)
├── backend/           → FastAPI back-end
│   ├── model/
│   │   └── llm.py
│   ├── rag/
│   │   ├── ingest.py
│   │   └── retriever.py
│   └── data/
│       ├── pdfs/
│       └── vector_store/
├── README.md
├── .gitignore
└── screenshot.png
```

## Features

- Tax-focused conversational AI
- Retrieval-Augmented Generation (RAG)
- Local LLM through Ollama
- PDF document ingestion
- Vector search using ChromaDB
- Session-based chat memory
- Dynamic model selection
- Source citations
- Fully local deployment
- No paid API keys required


## Architecture

```text
User Question
      ↓
FastAPI API
      ↓
Retriever
      ↓
ChromaDB Vector Store
      ↓
Relevant Tax Document Chunks
      ↓
Prompt Construction
      ↓
Ollama LLM
      ↓
Response + Source Citations
```


## Tech Stack

| Component | Technology |
|------------|------------|
| Front-End | Next.js, React, TypeScript, Tailwind CSS |
| Back-End | FastAPI (Python) |
| LLM | Ollama (Llama 3, Mistral) |
| Vector Store | ChromaDB |
| RAG Framework | LangChain |
| Embeddings | BAAI/bge-small-en-v1.5 |
| Document Loader | PyPDFLoader |


## Skills Demonstrated

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Semantic Search
- Large Language Models
- Prompt Engineering
- Full-Stack Development
- FastAPI REST APIs
- React / Next.js
- TypeScript
- Python
- ChromaDB
- LangChain
- Ollama


## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/meysamrezaee/tax_assistant.git
cd tax_assistant
```


### 2. Create Environment Files

These files contain application configuration used by the front-end and back-end during development. They are not included in the repository and must be created manually.

#### Option 1: Copy the Example Files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

#### Option 2: Create Them Manually

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

Create `backend/.env`:

```env
FRONTEND_URL=http://localhost:3000
OLLAMA_URL=http://localhost:11434/api/chat
```

### 3. Start the Back-End (Python + FastAPI)

Navigate to the backend directory and create a virtual environment:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

Back-end runs at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 4. Set Up the Front-End (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Front-end runs at:

```text
http://localhost:3000
```

### 5. Install and Configure Ollama

Install Ollama:

```text
https://ollama.com/download
```

Pull the required model:

```bash
ollama pull llama3:instruct
```

Verify Ollama is running:

```bash
ollama list
```

If Ollama is not already running, start the Ollama service:

```bash
ollama serve
```

When the FastAPI backend sends a request, Ollama automatically loads the selected model if it has been downloaded.

The application communicates with Ollama through:

```text
http://localhost:11434
```

and supports dynamic model switching via the `/selectmodel` endpoint.

### 6. Tax Documents

Contains information licensed under the Open Government Licence – Canada.

Source:

```text
https://www.canada.ca/en/revenue-agency/services/forms-publications/publications.html
```

PDF tax documents can be found in:

```text
backend/data/pdfs/
```

### 7. Build the Vector Database

At first setup, and whenever new PDFs are added, generate embeddings and populate the vector store:

```bash
python rag/ingest.py
```

This will:

- Load PDFs
- Split documents into chunks
- Generate embeddings
- Store vectors in ChromaDB

The searchable database will be stored in:

```text
data/vector_store/
```


## Usage

Open the application in your browser:

```text
http://localhost:3000
```

Enter a tax-related question, for example:

```text
What is the current GST rate?
```

The system will:

1. Retrieve relevant tax document sections
2. Build a context-aware prompt
3. Send the prompt to Ollama
4. Return a document-grounded response

Responses maintain chat context throughout the session.

### Current Endpoints

#### Chat

```http
POST /chat
```

Example request:

```json
{
  "prompt": "What is the GST rate?"
}
```

#### Clear Chat History

```http
POST /clearchat
```

#### Select Model

> Available through the front-end before a conversation starts.

```http
POST /selectmodel
```

Example request:

```json
{
  "model": "llama3"
}
```


## Disclaimer

- This application was developed as a software engineering and AI portfolio project to demonstrate Retrieval-Augmented Generation (RAG), document retrieval, and local LLM integration.
- It is not intended to provide professional tax advice. Users should verify all information against official government publications and consult a qualified tax professional when appropriate.
- The author is not responsible for any financial, legal, or tax-related outcomes resulting from the use of this software.


## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Credits

Created by Meysam Rezaee

Built using:

- FastAPI
- Next.js
- LangChain
- ChromaDB
- Ollama
- Open-source language models