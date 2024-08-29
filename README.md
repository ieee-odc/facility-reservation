🚀 Facility Reservation System
This project is a MERN stack application for managing facility reservations, including user authentication, event management, and notifications.

🔧 Installation
1️⃣ Clone the Repository

git clone https://github.com/ieee-odc/facility-reservation.git

2️⃣ Navigate to the Project Directory

cd facility-reservation

3️⃣ Install Dependencies

Backend:

Navigate to the backend directory and install dependencies:

cd backend
npm install

Frontend:

Navigate to the frontend directory and install dependencies:

cd ../frontend
npm install

4️⃣ Environment Variables Setup
Backend:

Create a .env file in the backend directory and fill in the required environment variables:

touch backend/.env

Fill in the .env file with the following details:

MONGODB_URL=<your MongoDB connection URL>
PORT=<the port you want your backend server to run on>
EMAIL_USER=<email address used for sending notifications>
EMAIL_PASS=<email password for the sender>
Frontend:

Create a .env file in the frontend directory and fill in the required environment variables:

touch frontend/.env

Fill in the .env file with the following details:

REACT_APP_API_KEY=<your Firebase API key>
REACT_APP_AUTH_DOMAIN=<your Firebase Auth domain>
REACT_APP_PROJECT_ID=<your Firebase project ID>
REACT_APP_STORAGE_BUCKET=<your Firebase storage bucket>
REACT_APP_MESSAGING_SENDER_ID=<your Firebase messaging sender ID>
REACT_APP_FIREBASE_APP_ID=<your Firebase app ID>
REACT_APP_MEASUREMENT_ID=<your Firebase measurement ID>

5️⃣ Firebase Configuration
Create a firebase.json file in the root directory if needed for Firebase configuration:

touch firebase.json

Add your Firebase configuration details as required.

6️⃣ Test Environment Setup

Creating the .env.test File

In your project directory, create a .env.test file:

touch backend/.env.test

This file is specifically used to configure environment variables for running tests. It typically contains the following variables:

MONGODB_URL="<your test MongoDB connection URL>"
PORT=<a different port to avoid conflicts>
NODE_ENV=test
When running tests using the command:

npm test

The environment variables from .env.test will be used, so your application will connect to the test database and run on the specified port.

🔑 Obtaining Required Keys

1️⃣ MongoDB Connection URL
Sign up for MongoDB Atlas: Go to MongoDB Atlas and create an account.
Create a Cluster: Once logged in, create a new cluster and database.
Get the Connection String: After creating the cluster, click on "Connect" to get the connection string. Replace <username>, <password>, and <your-cluster-url> with your database username, password, and cluster URL.

2️⃣ Firebase Configuration
Go to the Firebase Console: Visit Firebase Console and sign in with your Google account.
Create a New Project: Click on "Add Project" and follow the steps to create a new Firebase project.
Add Firebase to Your Web App: After the project is created, click on the "Web" icon to register your app. Firebase will provide you with the configuration details, including the API key, Auth domain, Project ID, Storage bucket, Messaging sender ID, App ID, and Measurement ID.
Copy and paste these details into your .env file in the frontend directory.

🚀 Usage

Running the Backend Server
Navigate to the backend directory:

cd backend

Start the backend server:

npm start

Running the Frontend
Navigate to the frontend directory:

cd frontend

Start the frontend development server:

npm run dev

Testing the Application
Open your browser and go to http://localhost:3000/login.
Create an account and log in to test the application.
Continue using the app to explore the various features, such as facility reservations, event management, and notifications.

📂 Project Structure
Backend

Models: Contains Mongoose schemas for database models.
Controllers: Handles the business logic and communication between the models and routes.
Routes: Defines the API endpoints and routes for handling requests.
Utils: Includes .env and other config files.
Config: Contains configuration files such as Firebase configuration.

Frontend
Components: Contains subfolders that include the main pages of the application and React components for the UI.
