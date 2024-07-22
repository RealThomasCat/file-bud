# FileBud

This project is a backend application for file storage and management, inspired by Google Drive. It is built using MongoDB, Express, and Node.js, with various features such as user authentication, file uploads, folder management, and media streaming.

## [Demo](https://file-bud-frontend.vercel.app/)

## Features

- **User Authentication and Authorization**: Secure account creation and login using JWT and bcrypt.
- **File Uploads**: Store files in Cloudinary with support for multiple file types.
- **Folder Management**: Create, delete, and manage folders.
- **File Management**: Search, download, delete files, and view media in the browser.
- **Media Streaming**: Stream video files using efficient networking concepts like data chunking.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **File Handling**: Multer, Cloudinary
- **Middleware**: Cookie-parser

## Installation

1. **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/RealThomasCat/file-bud.git)
    cd file-bud
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=your_port
    CORS_ORIGIN=*
    MONGODB_URI=your_mongodb_api_key
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=your_access_token_expiry
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. **Start the application:**
    ```bash
    npm run dev
    ```

## Usage

- **Create an Account**: Sign up using the provided endpoint.
- **Upload Files**: Upload files to Cloudinary via the upload endpoint.
- **Manage Files and Folders**: Use the respective endpoints to create/delete folders, search, download, and delete files.
- **Stream Media**: View images and videos directly in the browser.

## Important Concepts

- **Mongoose Transactions**: Ensures consistent and reliable database operations.
- **Retry Mechanisms**: Handles failures and minimizes data loss.
- **Efficient Data Handling**: Optimized schema design for faster queries and minimal delays.
- **Production-level Code Quality**: Robust error handling and good coding practices.

## Acknowledgements

- Inspiration from Google Drive for the application's core concept.
- Libraries and frameworks used: Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary, and Cookie-parser.
