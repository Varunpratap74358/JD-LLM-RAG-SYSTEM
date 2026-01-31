import json
import re
import math
from pathlib import Path
from typing import Optional, List, Dict
try:
    from backend.services.ai_service import ai_service
except ModuleNotFoundError:
    from services.ai_service import ai_service

class FAQService:
    def __init__(self):
        self.faqs = []
        self.faq_embeddings = [] # List of (embedding, faq_entry) tuples
        self.exact_match_map = {}
        self.exact_match_map = {}
        # Layer 3: Confidence Routing Threshold
        self.similarity_threshold = 0.70 
        
        # Load FAQs
        self._load_faqs()
        
        # Pre-compute Embeddings (on startup)
        # In a real production app with 10k items, this would be loaded from a Vector DB.
        # For 25 items, in-memory is fine and ensures <100ms response.
        
    async def initialize(self):
        print("Initializing FAQ Service...")
        # Reload FAQs from disk to ensure we have the latest version if file changed
        self._load_faqs()
        
        if not self.faqs:
            print("WARNING: FAQ Service initialized with 0 items. Check backend/data/faqs.json")
            return 

        print(f"Computing embeddings for {len(self.faqs)} FAQs...")
        import asyncio
        # Run in a separate thread so we don't block the async event loop
        await asyncio.to_thread(self._compute_embeddings)
        print(f"FAQ Service Ready: {len(self.faqs)} items, {len(self.faq_embeddings)} vectors.")

    def _load_faqs(self):
        try:
            # Resolve path relative to this file
            path = Path(__file__).parent.parent / "data" / "faqs.json"
            if not path.exists():
                print(f"ERROR: FAQ file not found at {path}")
                return

            with open(path, "r", encoding="utf-8") as f:
                self.faqs = json.load(f)
                
            self.exact_match_map = {}
            for entry in self.faqs:
                # Populate exact match map (case-insensitive)
                questions = [entry["question"]] + entry.get("variations", [])
                for q in questions:
                    normalized_q = self._normalize(q)
                    self.exact_match_map[normalized_q] = entry
            print(f"Loaded {len(self.faqs)} FAQs from disk.")
                    
        except json.JSONDecodeError as e:
            print(f"CRITICAL ERROR: backend/data/faqs.json is invalid JSON! \nError at line {e.lineno}, col {e.colno}: {e.msg}")
            self.faqs = []
        except Exception as e:
            print(f"Error loading FAQs: {e}")
            self.faqs = []

    def _compute_embeddings(self):
        """
        Pre-computes embeddings for all FAQ questions and variations.
        This is a 'warm-up' step.
        """
        if not self.faqs:
            return

        count = 0
        for entry in self.faqs:
            # Embed the main question
            # We treat FAQ questions as 'documents' to be retrieved
            try:
                # 1. Embed the primary question
                emb = ai_service.get_embeddings(entry["question"])
                self.faq_embeddings.append((emb, entry))
                
                # 2. Embed variations (optional, but improves accuracy)
                # To save startup time/API calls, we might skip this or limit it.
                # For 25 FAQs x 3 variations = ~75 calls. feasible.
                for var in entry.get("variations", []):
                     emb_var = ai_service.get_embeddings(var)
                     self.faq_embeddings.append((emb_var, entry))
                     
                count += 1
            except Exception as e:
                print(f"Failed to embed FAQ {entry['id']}: {e}")
                
        print(f"Computed embeddings for {len(self.faq_embeddings)} entry points.")

    def _normalize(self, text: str) -> str:
        # Layer 1: Query Normalization
        # 1. Lowercase
        text = text.lower()
        # 2. Remove punctuation (keep alphanumeric and spaces)
        text = re.sub(r'[^\w\s]', '', text)
        # 3. Remove filler words (your, the, about, etc.)
        # Be careful not to remove 'question' words if they are important, 
        # but 'tell me about' is largely noise for matching 'company'.
        fillers = {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'of', 'in', 'on', 'at', 'to', 'for', 'by', 'with', 'about', 'your', 'my', 'our', 'please', 'tell', 'me'}
        words = text.split()
        filtered_words = [w for w in words if w not in fillers]
        
        # If we stripped everything (e.g. input was just "about"), fall back to original stripped text
        if not filtered_words:
            return text.strip()
            
        return " ".join(filtered_words)

    def _cosine_similarity(self, vec1, vec2):
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(b * b for b in vec2))
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        return dot_product / (magnitude1 * magnitude2)

    async def get_answer(self, query: str) -> Optional[Dict]:
        """
        Returns an answer if confidence is high, else None.
        """
        # 1. Exact Match (O(1))
        normalized_q = self._normalize(query)
        if normalized_q in self.exact_match_map:
            print(f"FAQ HIT (Exact): {query}")
            return {
                "answer": self.exact_match_map[normalized_q]["answer"],
                "source": "faq_exact",
                "questions_related": self.exact_match_map[normalized_q]["variations"]
            }
            
        # 2. Semantic Match (Vector Similarity)
        try:
            # Generate query embedding
            # Layer 2: Embed Normalized Query
            query_emb = ai_service.get_query_embedding(normalized_q)
            
            best_score = -1
            best_entry = None
            
            for doc_emb, entry in self.faq_embeddings:
                score = self._cosine_similarity(query_emb, doc_emb)
                if score > best_score:
                    best_score = score
                    best_entry = entry
            
            print(f"FAQ Best Score: {best_score} for query '{query}'")
            
            if best_score >= self.similarity_threshold:
                print(f"FAQ HIT (Semantic): {query} -> {best_entry['question']}")
                return {
                    "answer": best_entry["answer"],
                    "source": "faq_semantic",
                    "confidence": round(best_score, 4),
                    "original_question": best_entry["question"]
                }
                
        except Exception as e:
            print(f"FAQ Semantic Check Failed: {e}")
            
        return None

faq_service = FAQService()
