# API Documentation


## Content

GET    /content - List all content
POST   /content - Create a new content
GET    /content/:id - View a content
PATCH  /content/:id - Update a content
DELETE /content/:id - Delete a content

## Content Containers

GET    /content-container - List all content containers
POST   /content-container - Create a new content container
GET    /content-container/:id - View a content container
PATCH  /content-container/:id - Update a content container
DELETE /content-container/:id - Delete a content container

GET    /content-container/:id/content - List all the content for this container

## Pages

GET    /page - List all pages
POST   /page - Create a new page
GET    /page/:id - View a page
PATCH  /page/:id - Update a page
DELETE /page/:id - Delete a page

GET    /page/:id/containers - List all the content-containers for this page


## Users

GET    /user - List all users
POST   /user - Create a new page
GET    /user/:id - View a user
PATCH  /user/:id - Update a user
DELETE /user/:id - Delete a user
