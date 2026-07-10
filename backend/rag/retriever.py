#rag/retriever.py
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-small-en-v1.5"
)

db = Chroma(
    persist_directory="data/vector_store",
    embedding_function=embeddings
)

retriever = db.as_retriever(
    search_kwargs={"k": 4}
)


def get_context(question: str):
    docs = retriever.invoke(question)
    

        
    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    sources = []

    seen = set()

    for doc in docs:
        source = doc.metadata.get("source", "Unknown")
        page = doc.metadata.get("page", 0) + 1

        key = (source, page)

        if key not in seen:
            seen.add(key)

            sources.append({
                "file": source.split("/")[-1],
                "page": page
            })

    return context, sources



#def get_context(question: str):

#    docs = retriever.invoke(question)

#    context = "\n\n".join(
#        doc.page_content for doc in docs
#    )

#    return context
