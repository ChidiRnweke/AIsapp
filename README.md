# Aisapp Django Web Application

Welcome to the Aisapp Django web application! This README provides an overview of the Django project, its directory structure, associated applications, and how to get started.

## Overview

Aisapp is a scheduling and agenda application that harnesses AI to prioritize tasks and schedules. It is structured with Django and its architecture comprises two main applications: `aisapp` (backend) and `aisapp_frontend` (frontend).


The directory structure in your README does seem to lack the front-end TypeScript files and the compiled JavaScript. Here's how you could redo the directory part to reflect the suggested changes:

## Directory Structure & Description
```
app/

|-- aisapp/
| |-- models/
| | |-- calendar/ # Models related to the calendar functionality
| | |-- todo/ # Models related to the todo functionality
| |-- serializers/ 
| |-- views/
| | |-- todo/ 
| |-- signals
|
|-- aisapp_frontend/
| |-- src/ # TypeScript source code
| | |-- main.ts # Main TypeScript entry point
| | |-- components/ # Individual components or modules
| | |-- handlers/ # Give components specific behavior
| | |-- utils/ # Utility functionality that is shared
| |-- static/
| | |-- aisapp/ # Static frontend assets: CSS, JS, and images
| |-- templates/
| | |-- aisapp/
| | | |-- home.html # Entry point for the application's frontend
```
## Applications

### aisapp (Backend)

Contains all backend-related logic, models, serializers, views, and signal handlers. The key components are:

- **Models**: 
  - `calendar`: Models related to calendar functionality.
  - `todo`: Models related to the todo functionality.
  
- **Serializers**: Handles serialization and deserialization of models.
- **Views**: 
  - `todo`: Views specific to the todo functionality.
- **Signals**: Handlers for Django's built-in signals.
  
### Browsable API

You can browse to localhost:8000/api/ to view the endpoints that are currently available.

## Frontend: AISAPP Frontend

### Technology Stack:

- **Vanilla Typescript**: The application avoids heavy frameworks, opting for a lightweight, efficient approach.
- **Web Components**: For creating reusable, encapsulated HTML tags for use in web pages.

### Routing:

A client-side routing mechanism is implemented in `main.ts`. Based on the URL path, different "views" or "pages" are rendered, giving the application a Single Page Application (SPA) feel without relying on a frontend framework.

### Web Components and Templating:

The application employs the `<template>`, content within the `<template>` isn't rendered upon page load but is accessed and rendered later using JavaScript, as evident in the `loadView` function in `main.ts`.

### Key Functions:

1. **handleRouteChange**: Decides which view to render based on the URL path.
2. **loadView**: Utilizes the `<template>` tag to render views.

### Usage:

On accessing the application, `main.ts` listens for route changes and loads the relevant views:

- **`/` or `''`**: Loads the home page.
- **`/register`**: Takes the user to the registration page.
- **`/login`**: Directs the user to the login page.
- **Any other page**: Displays a 404 error page.

## Setup with Poetry

1. **Installation**: If you haven't already, install Poetry:
   ```bash
   curl -sSL https://install.python-poetry.org | python3
   ```

2. **Setup Environment**: Navigate to the project's root directory and install the dependencies using:
   ```bash
   poetry install
   ```

3. **Activate Virtual Environment**:
   ```bash
   poetry shell
   ```

## Getting Started

1. **Environment Setup**: With the Poetry virtual environment activated, ensure you have Django installed.
2. **Database Setup**: Run migrations to create the database schema for the models.
3. **Static Files Collection**: Use the `collectstatic` Django command to gather all the static files.
4. **Run the Server**: Use Django's `runserver` command to start the development server and access the app through the `home.html` entry point.
5. **API Usage**: For backend interactions, utilize the provided views or the Django Rest Framework's built-in API views.

