
# Social Pulse

Welcome to **Social Pulse**, an application designed to empower small businesses by providing insights into their social media presence and customer interactions. Using AI-powered sentiment analysis and data visualization, Social Pulse helps small business owners make data-driven decisions to enhance their marketing strategies and customer engagement.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Technologies Used](#technologies-used)
7. [Contact](#contact)

## Overview

Social Pulse is a full-stack application designed to integrate with social media APIs like Twitter, Facebook, and Instagram, along with Firebase, to gather and analyze data. It uses AI to provide sentiment analysis and trend detection, offering small businesses actionable recommendations based on real-time data. Emojis and tags are also generated using AI code written in Python, enhancing the user experience.

## Prerequisites

Ensure you have the following installed on your system:

- Java 11 or higher
- Maven
- Docker
- Node.js and npm

## Backend Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:suvinarx/socialpulse-CongressionalApp.git
   cd socialpulse-CongressionalApp/social-pulse-service
   ```

2. **Set up environment variables**:

   Configure the application using the `application.yaml` file. The following credentials are required:

   - **Twitter API credentials**: Set up a Twitter developer account at [Twitter Developer Portal](https://developer.twitter.com/). Create an app and configure the callback URL to `http://localhost:3000/twitter-callback` as specified in the `application.yaml`.
   - **Facebook and Instagram API credentials**: Create an app using your Facebook developer account at [Facebook for Developers](https://developers.facebook.com/). Set callback URLs in the `application.yaml` file as follows:
     ```
     facebook-callback-url: http://localhost:3000/facebook-callback
     instagram-callback-url: http://localhost:3000/instagram-callback
     ```
   - **Firebase configuration**: Set up a Firebase project. Navigate to **Project Settings** > **Service accounts**, and generate a new private key. Rename this file to `firebase-service-account.json` and place it in `social-pulse-service/src/main/resources`. Update the project ID in the `application.yaml` file.

3. **Build the backend using Maven**:
   ```bash
   mvn clean install
   ```

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../social-pulse-ui
   ```

2. **Create a `.env` file**:

   Set up environment variables in the `.env` file:
   ```
   REACT_APP_FB_API_KEY=AIzaSy******************************
   REACT_APP_FB_AUTH_DOMAIN=**********.firebaseapp.com
   REACT_APP_FB_PROJECT_ID=********
   REACT_APP_FB_STORAGE_BUCKET=**************.appspot.com
   REACT_APP_FB_MESSAGING_SENDER_ID=*********
   REACT_APP_FB_APP_ID=1:**********************
   REACT_APP_FB_MEASUREMENT_ID=*********
   ```
   - Retrieve these values from the Firebase console under **Project Settings** > **General**.

3. **Install frontend dependencies**:
   ```bash
   npm install
   ```

4. **Start the frontend development server**:
   ```bash
   npm start
   ```

## Running the Application

To start the application using Docker:

```bash
docker-compose up -d
```

Access the application at `http://localhost:3000`.

## Technologies Used

- **Backend**: Java, Spring Boot, Maven
- **Frontend**: React, Node.js, npm
- **APIs**: Twitter API, Facebook API, Instagram API, Firebase
- **AI Integration**: Python (for generating emojis and tags)
- **Containerization**: Docker

## Contact

For any questions or support, please reach out:

- **GitHub**: [suvinarx](https://github.com/suvinarx)
- **Email**: your-email@example.com
