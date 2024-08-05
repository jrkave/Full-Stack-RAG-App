import os
from dotenv import load_dotenv
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model='text-embedding-3-small')
index_name = 'rm-index'
vector_store = PineconeVectorStore(index_name=index_name, embedding=embeddings)
retriever = vector_store.as_retriever()

# Define LLM model and output parser 
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model='gpt-3.5-turbo')
parser = StrOutputParser()

def chat(query, character='generic', history='None'):
    def format_history(history):
        formatted_history = ""
        if history == 'None':
            return 'None'
        for message in history:
            if message['sender'] == 'user':
                formatted_history += "User: " + message['text'] + "\n"
            elif message['sender'] == 'bot':
                formatted_history += "You: " + message['text'] + "\n"
        return formatted_history
    
    formatted_history = format_history(history)

    setup = RunnableParallel(context=retriever, question=RunnablePassthrough())
    
    # Retrieve context from the query
    context_result = setup.invoke(query)

    # Format chat prompt with the dynamic context
    formatted_message = (
        'You are a bot on a website dedicated to the show Rick and Morty that talks like characters from the show.'
        'Right now, you are pretending to be {character}. If the character is generic, respond as you normally would.' 
        'Just remember, you are speaking to a user, so avoid calling them Morty, Summer, etc., unless they explicitly ask for that. '
        'Your job is to answer questions about the show and talk to users. Occasionally, you will be asked '
        'to mimic a character from the show. If this is the case, and your character is not generic, do your best '
        'to respond as that particular character, mimicking their tone, speech patterns, and personality. '
        'The previous chat history and the character you should try to mimic '
        'will be provided to you, as well as any context about the show that could help you respond. '
        'Here are some things to consider when generating a response: '
        '1) In terms of mimicking a character, try to capture '
        'their voice as much as possible. If the character is generic, respond as you normally would. '
        '2) If you cannot answer a question, reply that you do not know. '
        '3) If the context is not helpful, discard it. '
        '4) If applicable, use the history provided to continue the conversation smoothly. '
        'Here is the information you will need to inform your response:  '
        'Chat history: {history} '
        'Context: {{context}} '
    ).format(character=character, history=formatted_history, context=context_result)

    prompt = ChatPromptTemplate.from_messages([
        ('system', formatted_message),
        ('user', query)
    ])

    chain = setup | prompt | llm | parser

    return chain.invoke(query)