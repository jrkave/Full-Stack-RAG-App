import os
import random
import time
import requests
from bs4 import BeautifulSoup

info = { 
    'characters': {
        'files': ['characters_1.html', 'characters_2.html', 'characters_3.html', 'characters_4.html'],
        'items': []
    },
    'episodes': {
        'files': ['episodes_1.html'],
        'items': []
    },
    'episode_transcripts': {
        'files': ['episode_transcripts_1.html'],
        'items': []
    },
    'locations': {
        'files': ['locations_1.html', 'locations_2.html'],
        'items': []
    },
    'objects': {
        'files': ['objects_1.html'],
        'items': []
    }
}

user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0'
]

base_url = 'https://rickandmorty.fandom.com'
base_dir = 'html_categories'

def parse_for_links(file_name, category, base_dir):
    # Read File
    file_path = os.path.join(base_dir, category, file_name)
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Parse HTML with BeautifulSoup 
    soup = BeautifulSoup(content, 'html.parser')
    results = soup.find_all('a', class_='category-page__member-link')
    # Return list of items 
    text = []
    for result in results:
        if result['href'][:15] == '/wiki/Category:':
            continue
        text.append(result['href'])
    return text

def append_items(dict, base_dir):
    for category, data in dict.items():
        for file_name in data['files']:
            results = parse_for_links(file_name, category, base_dir)
            data['items'].extend(results)

def get_html(dict, base_dir, new_dir, base_url):
    # Put links into dictionary
    append_items(dict, base_dir)
    
    # Make directory to contain pages
    if not os.path.exists(new_dir):
        os.makedirs(new_dir)
    
    for category, data in dict.items():
        # Make directory pertaining to category
        category_dir = os.path.join(new_dir, category)
        if not os.path.exists(category_dir):
            os.makedirs(category_dir)
        
        for item in data['items']:
            user_agent = user_agents[random.randint(0, 9)]
            headers = {'User-Agent': user_agent}
            
            # Get response and write to file 
            try:
                # Response
                if category == 'episode_transcripts':
                    response = requests.get(base_url + item + '/Transcript')
                else:
                    response = requests.get(base_url + item)   
                time.sleep(random.randint(2, 10))
                
                # Write
                split_text = item.split('/')
                name = split_text[2]
                file_name = os.path.join(category_dir, f'{name}.html')
                with open(file_name, 'w', encoding='utf-8') as file:
                    file.write(response.text)
                    file.close()
            
            except requests.exceptions.RequestException as request_error:
                print(f'Request error for {base_url + item}: {request_error}')
            except IOError as IO_error:
                print(f'Error writing to file for {base_url + item}: {IO_error}')
                
if __name__ == '__main__':
    get_html(info, base_dir, 'html_pages', base_url)