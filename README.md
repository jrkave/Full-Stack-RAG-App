# Rickipedia: An Interactive Fan Platform for Rick and Morty

## Table of Contents
- Introduction
- Features
- Technologies Used
  - Backend
  - Frontend
  - Chatbot
  - Authentication and Security
- Screenshots

## Introduction

With origins dating back to 1893, fandoms – or communities of fans passionate about a specific interest – have been around for decades, fostering active engagement and camaraderie among their members. Today, many fandoms exist on the Web as Wikipedia-like websites, providing a place for users to contribute information and celebrate their shared interests. Aiming to be “one-stop-shop” resources, some sites, such as Fandom.com, can amass hundreds of pages on a single piece of entertainment, with articles ranging from character analyses to popular fan theories. While informative, this approach can lead to unanticipated consequences. For example, focusing on content volume may lead sites to sacrifice interactivity, leading to decreased user engagement. Additionally, with hundreds of pages to choose from, users may find themselves overwhelmed, unable to find a specific resource, and stuck in a navigational nightmare.

To address these shortcomings, a fandom site inspired by the popular Adult Swim television show “Rick and Morty” was created. Dubbed “Rickipedia,” the site leverages modern web technologies and artificial intelligence (AI) to enhance user interaction and pare down content. The website achieves this through several key features, as detailed in the 'Features' section. 

## Features

- **Card Collection System**: Provides a way to track viewing history and favorite episodes/characters. 
- **Rating System**: Enables the logging of user impressions about epiosdes/characters.
- **Retrieval-Augmented Chatbot**: Uses context provided through retrieval-augmented generation (RAG) to respond accurately to queries and mimic characters.

## Technologies Used

### Backend
- Django
- Django REST Framework (DRF)
- SQLite

### Frontend
- React
  - React Router
  - React Alert
  - React-Responsive-3D-Carousel
- Axios
- The Rick and Morty API
- Tailwind CSS

### Chatbot
- LangChain
- Pinecone
- OpenAI API
- Requests
- Beautiful Soup

### Authentication and Security
- JSON Web Tokens (JWT)

## System Architecture 
The application's architecture is illustrated below:
![system_architecture](https://github.com/user-attachments/assets/a6ce21a9-dc17-405a-8fd1-c2e06f2af16f)
Application Architecture


## Screenshots

<img width="1504" alt="Screenshot 2024-08-05 at 7 04 57 PM" src="https://github.com/user-attachments/assets/2cf0199d-e244-400c-a2c8-e5b1484ca623">
Home Page
<br>
<br>
<br>
<br>
<img width="1512" alt="Screenshot 2024-08-05 at 7 21 13 PM" src="https://github.com/user-attachments/assets/d5c16857-4957-41dd-acdd-b5518daff2d8">
Characters Page 
<br>
<br>
<br>
<br>
<img width="565" alt="Screenshot 2024-08-05 at 7 20 25 PM" src="https://github.com/user-attachments/assets/06c70b36-25e0-4409-ae9c-99138941721f">
Episodes Page
<br>
<br>
<br>
<br>
<img width="1512" alt="Screenshot 2024-08-05 at 7 09 20 PM" src="https://github.com/user-attachments/assets/0740e834-aefa-4039-bf78-d342c0cf7236">
Character Collection (Light Theme)
<br>
<br>
<br>
<br>
<img width="1512" alt="Screenshot 2024-08-05 at 7 06 07 PM" src="https://github.com/user-attachments/assets/83c50d7a-c236-4bdb-9c9e-db339cfbd8b0">
Character Collection (Dark Theme)
<br>
<br>
<br>
<br>
<img width="1512" alt="Screenshot 2024-08-05 at 7 11 21 PM" src="https://github.com/user-attachments/assets/196417fc-ce14-47b1-8080-7d1aa508f17c">
Profile
<br>
<br>
<br>
<br>
<img width="568" alt="Screenshot 2024-08-05 at 7 19 09 PM" src="https://github.com/user-attachments/assets/2e09ad7d-188f-42e7-878b-ece64cad49b7">
Profile (Smaller)
<br>
<br>
<br>
<br>
<img width="1511" alt="<img width="570" alt="Screenshot 2024-08-05 at 7 07 12 PM" src="https://github.com/user-attachments/assets/63008f8c-4f6c-4c34-b8ee-b8701ce7a406">
Chatbot Landing Page
<br>
<br>
<br>
<br>
<img width="1512" alt="Screenshot 2024-08-05 at 7 08 26 PM" src="https://github.com/user-attachments/assets/1a78654f-aca9-478a-bcef-e08ee3a9abe6">
Chatbot Conversation
