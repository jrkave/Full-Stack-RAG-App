import os
import re
from bs4 import BeautifulSoup

def parse(file_name, base_dir, category):
    # Open file for reading
    file_path = os.path.join(base_dir, category, file_name)
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Put content into BeautifulSoup object for parsing
    soup = BeautifulSoup(content, 'lxml')
    
    # Take out unnecessary elements from soup 
    for tag in soup.find_all(['aside', 'figure']):
        tag.extract()
    
    classes = ['toc', 'mw-references-wrap mw-references-columns']
    for i in classes:
        for tag in soup.find_all('div', class_=i):
              tag.extract()

    # Find p, li, h2 elements
    content = []
    elements = soup.find('div', {'class':'page-content'}).findChildren(['li', 'p', 'h2'])
    for element in elements:
        content.append(element.get_text())
        
    # Replace substrings
    text = [string.replace('\n', '').replace('[]', ':').replace('Gallery:', '').replace('Biography', 'Biography:') for string in content]
    text = ' '.join(text)
    
    # Remove reference numbers (e.g. [12], [2])
    pattern = r'\[\d{1,2}\]' 
    text = re.sub(pattern, '', text)
    
    # Remove text after 'See Also'
    pattern = r'See also:*'
    text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    pattern = r'Site navigation:*'
    text = re.sub(pattern, '', text)
    
    # Episode-Specific Text Cleaning 
    if category == 'episodes':
        pattern = r'Gallery.*'
        text = re.sub(pattern, '', text)
        pattern = r'Transcript.*'
        text = re.sub(pattern, '', text)
    
    # Episode-Transcripts-Specific Text Cleaning
    if category == 'episode_transcripts':
        # If there isn't any 
        pattern = r'There is currently no text in this page.*'
        if re.search(pattern, text):
            text = re.sub(pattern, '', text)
            episode_name = file_name.split('.')[0]
            pattern = r'_'
            episode_name = re.sub(pattern, ' ', episode_name)
            pattern = r'%27'
            episode_name = re.sub(pattern, "'", episode_name)
            text = f'No transcript is available for the episode "{episode_name}."'
    
    return text

def write_to_file(file_name, write_dir, category, content):
    category_dir = os.path.join(write_dir, category)
    if not os.path.exists(category_dir):
        os.makedirs(category_dir)
    
    file_path = os.path.join(category_dir, file_name)
        
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    
if __name__ == '__main__':
    base_dir = 'html_pages'
    write_dir = 'parsed_content'
    
    directories = os.listdir(base_dir)
    for category in directories:
        path_to_files = os.path.join(base_dir, category)
        files = os.listdir(path_to_files)
        
        for file in files:
            # Get parsed content
            text = parse(file, base_dir, category) 
            
            # Write content to new file
            new_file_name = file.replace('html', 'txt')
            write_to_file(new_file_name, write_dir, category, text)