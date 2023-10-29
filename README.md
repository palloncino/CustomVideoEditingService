# Custom Video Editing Service

## Overview
This repository contains the code for a custom video editing service built using Node.js and Express. The service allows users to upload videos and apply basic editing features like background color changes.

## Features
- Video Upload
- Video Editing using FFmpeg
- Background Color Change

## Technologies Used
- Node.js
- Express
- FFmpeg
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js
- FFmpeg installed and added to the system path

### Installation
1. Clone the repository

```shell
git clone https://github.com/palloncino/CustomVideoEditingService.git
```

2. Navigate to the project directory

```shell
cd CustomVideoEditingService
```

3. Install dependencies

```shell
npm install
```

### Running the Application
To run the application in development mode, use:

```shell
npm run dev
```

To run the application in production mode, use:

```shell
npm start
```

## API Endpoints

| Endpoint                | Method | Description                        | Body Type  | Parameters                                   | Optional Parameters                         |
|-------------------------|--------|------------------------------------|------------|---------------------------------------------|--------------------------------------------|
| `/api/video-upload`     | POST   | Uploads and processes the video file. | form-data  | `video`: *.mp4, *.mov (type: file)          | `bgcolor`: CSS color (type: text)         |


## Contributing
Feel free to open issues and pull requests!
