import os
import requests

urls = {
    'characters': [
        'https://rickandmorty.fandom.com/wiki/Category:Characters',
        'https://rickandmorty.fandom.com/wiki/Category:Characters?from=Fungo',
        'https://rickandmorty.fandom.com/wiki/Category:Characters?from=Mr.+Goldenfold+%28Wasp+Universe%29',
        'https://rickandmorty.fandom.com/wiki/Category:Characters?from=Summer+Smith+%28C-1239%29'
        ],
    'episodes': [
        'https://rickandmorty.fandom.com/wiki/Category:Episodes',
        ],
    'episode_transcripts': [
        'https://rickandmorty.fandom.com/wiki/Category:Episodes',
    ],
    'locations': [
        'https://rickandmorty.fandom.com/wiki/Category:Locations',
        'https://rickandmorty.fandom.com/wiki/Category:Locations?from=The+Garage',
        ],
    'objects': [
        'https://rickandmorty.fandom.com/wiki/Category:Objects'
    ]
}

def save_html(dict, base_dir):
    # Make base directory 
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    
    for category, urls in dict.items():
        # Make category directory
        category_dir = os.path.join(base_dir, category)
        if not os.path.exists(category_dir):
            os.makedirs(category_dir)

        count = 1
        for url in urls:
            # Get response
            response = requests.get(url)
            if response.status_code != 200:
                print(f'Error returning a response for {url}')
                continue
            
            # Write to file
            file_name = os.path.join(category_dir, f'{category}_{count}.html')
            count += 1
            with open(file_name, 'w', encoding='utf-8') as file:
                file.write(response.text)
                file.close()

if __name__ == '__main__':        
    save_html(urls, 'html')