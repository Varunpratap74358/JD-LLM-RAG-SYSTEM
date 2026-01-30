import os
import google.generativeai as genai
from google.api_core import exceptions
import cohere
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend/ or current dir
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class AIService:
    """
    AIService handles communication with Google Gemini and Cohere.
    This version uses stable model names and standard SDK methods
    to ensure compatibility across all account types (Free/Tiered).
    """
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        
        # Configure the Google AI SDK
        genai.configure(api_key=self.api_key)
        
        # MODEL SELECTION based on your specific API key availability:
        # Your key specifically supports 'gemini-2.5-flash'
        self.generation_model_name = 'gemini-2.5-flash'
        self.embedding_model_name = 'models/text-embedding-004'
        
        self.llm = genai.GenerativeModel(model_name=self.generation_model_name)
        
        # Cohere Reranker Configuration
        self.co_key = os.getenv("COHERE_API_KEY")
        if self.co_key:
            self.co = cohere.Client(self.co_key)
        else:
            self.co = None

    def get_embeddings(self, text: str):
        """Generates embeddings for a single piece of text."""
        try:
            result = genai.embed_content(
                model=self.embedding_model_name,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except exceptions.InvalidArgument as e:
            # Fallback for older model name if text-embedding-004 is rejected
            if "not found" in str(e).lower():
                result = genai.embed_content(
                    model='models/embedding-001',
                    content=text,
                    task_type="retrieval_document"
                )
                return result['embedding']
            raise e

    def get_query_embedding(self, query: str):
        """Generates embeddings for a user query."""
        try:
            result = genai.embed_content(
                model=self.embedding_model_name,
                content=query,
                task_type="retrieval_query"
            )
            return result['embedding']
        except exceptions.InvalidArgument as e:
            if "not found" in str(e).lower():
                result = genai.embed_content(
                    model='models/embedding-001',
                    content=query,
                    task_type="retrieval_query"
                )
                return result['embedding']
            raise e

    def rerank(self, query: str, documents: list, top_n: int = 5):
        """Uses Cohere to rerank retrieved documents for higher precision."""
        if not self.co or not documents:
            return []
        
        results = self.co.rerank(
            model="rerank-english-v3.0",
            query=query,
            documents=documents,
            top_n=top_n,
            return_documents=True
        )
        return results.results

    def generate_answer(self, query: str, context: str):
        """Generates a grounded answer based on the provided context."""
        
        # Production-grade system prompt - Updated to remove citations as requested
        prompt = f"""
        You are a helpful AI assistant. Answer the following question based ONLY on the provided context.
        If the context does not contain the answer, state: "The provided documents do not contain enough information to answer this question."
        
        Context:
        {context}
        
        Question:
        {query}
        
        Answer Grounded in Context:
        """
        try:
            response = self.llm.generate_content(prompt)
            
            # Extract text safely
            answer_text = response.text
            
            # Get token usage metrics
            tokens = 0
            if hasattr(response, 'usage_metadata'):
                tokens = response.usage_metadata.total_token_count
            
            return {
                "answer": answer_text,
                "tokens": tokens
            }
        except Exception as e:
            return {
                "answer": f"Error generating answer: {str(e)}",
                "tokens": 0
            }

ai_service = AIService()
