import os
from dotenv import load_dotenv
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

def clean_text(text):
    # Remove whitespaces from beginning and end
    text = text.strip()

    # Replace multiple whitespaces with a single whitespace char
    text = ' '.join(text.split())

    # Take out 'Site Navigation' and 'References' (and anything beyond them)
    text = text.split('Site Navigation')[0]
    text = text.split('References')[0]

    return text

def split_text(text):
    # Determine how to split 
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=3000,
        chunk_overlap=20
    )

    # Split into multiple documents and return
    docs = text_splitter.create_documents([text])
    return docs

def get_text(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    except:
        print('Error reading file.')
    
    cleaned_text = clean_text(text)
    return cleaned_text

def get_file_paths(base_dir):
    file_paths = []

    for dir in os.listdir(base_dir):
        # Skip anything with a '.' in front
        if dir[0] == '.': 
            continue
        
        # Join directories together
        category_dir = os.path.join(base_dir, dir)

        # Get file paths
        file_names = os.listdir(category_dir)
        for file_name in file_names:
            file_path = os.path.join(category_dir, file_name)
            file_paths.append(file_path)
    
    return file_paths

if __name__ == '__main__':
    base_dir = '../scraper/scraped_html/parsed_content'
    file_paths = get_file_paths(base_dir)
    
    texts = []
    for file in file_paths:
        texts.append(get_text(file))
    
    # Embeddings setup
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY, model='text-embedding-3-small')

    index_name = 'rm-index'
    vector_store = PineconeVectorStore(index_name=index_name, embedding=embeddings)

    for text in texts:
        try:
            documents = split_text(text)
            vector_store.add_documents(documents)
        except:
            print('Error upserting text into Pinecone.')