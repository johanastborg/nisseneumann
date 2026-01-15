import dspy
from typing import List
from .kg_service import KnowledgeGraphService
from .spanner_service import SpannerService
import os

# Define the signature for the QA task
class PhysicsQA(dspy.Signature):
    """Answer questions about physics using context from Knowledge Graph and Spanner Graph (Papers)."""

    question = dspy.InputField(desc="The physics question to answer")
    context = dspy.InputField(desc="Context retrieved from Knowledge Graph and Physics Papers")
    answer = dspy.OutputField(desc="A detailed answer to the question based on the context")

class DSPyService:
    def __init__(self):
        # Initialize Services
        self.kg_service = KnowledgeGraphService(api_key=os.getenv("KG_API_KEY", "mock_key"))
        self.spanner_service = SpannerService()

        # Configure DSPy with a Language Model.
        # In DSPy 3.x, we use dspy.LM with a model string, e.g., 'openai/gpt-4o' or 'gemini/gemini-pro'.
        # We check for API keys to configure the LM.

        gemini_key = os.getenv("GEMINI_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")

        if gemini_key:
             # Configure Gemini
             # Note: You might need to set 'GOOGLE_API_KEY' env var for litellm used by dspy
             os.environ['GOOGLE_API_KEY'] = gemini_key
             dspy.settings.configure(lm=dspy.LM('gemini/gemini-1.5-flash'))
        elif openai_key:
             # Configure OpenAI
             dspy.settings.configure(lm=dspy.LM('openai/gpt-4o-mini'))
        else:
             print("Warning: No API key found (GEMINI_API_KEY or OPENAI_API_KEY). DSPy LM not configured.")

        self.generate_answer = dspy.ChainOfThought(PhysicsQA)

    def process_query(self, question: str):
        # 1. Retrieve data from Knowledge Graph
        kg_data = self.kg_service.search_entity(question)

        # 2. Retrieve data from Spanner Graph (Physics Papers)
        spanner_data = self.spanner_service.get_physics_papers(question)

        # 3. Combine context
        context = f"Knowledge Graph Data: {kg_data}\n\nPhysics Papers: {spanner_data}"

        # 4. Use DSPy to generate answer
        try:
            # Check if LM is configured before running
            if not dspy.settings.lm:
                raise ValueError("DSPy Language Model is not configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.")

            prediction = self.generate_answer(question=question, context=context)
            return {
                "question": question,
                "answer": prediction.answer,
                "context": {
                    "kg": kg_data,
                    "papers": spanner_data
                }
            }
        except Exception as e:
            return {
                "question": question,
                "answer": f"Error generating answer with DSPy: {str(e)}",
                "context": {
                    "kg": kg_data,
                    "papers": spanner_data
                }
            }
