# API Documentation
application/vnd.api+json
application/json


## Content

GET     /content - List all content
POST    /content - Create a new content
GET     /content/:id - View a content
PUT     /content/:id - Update a content
PATCH   /content/:id - Update a content
DELETE  /content/:id - Delete a content


## Regions

GET     /region - List all regions
POST    /region - Create a new region
GET     /region/:id - View a region
PUT     /region/:id - Update a region
PATCH   /region/:id - Update a region
DELETE  /region/:id - Delete a region

GET     /region/:id/content - List all the content for this region
PUT     /region/:id/content - Add a content to this region
PATCH   /region/:id/content - Add a content to this region
DELETE  /region/:id/content - Remove a content from this region


## Pages

GET     /page - List all pages
POST    /page - Create a new page
GET     /page/:id - View a page
PUT     /page/:id - Update a page
PATCH   /page/:id - Update a page
DELETE  /page/:id - Delete a page

GET     /page/:id/regions - List all the regions for this page
PUT     /page/:id/regions - Add a region to this page
PATCH   /page/:id/regions - Add a region to this page
DELETE  /page/:id/regions - Remove a region from this page


## Users

GET     /user - List all users
POST    /user - Create a new page
GET     /user/:id - View a user
PATCH   /user/:id - Update a user
PUT     /user/:id - Update a user
DELETE  /user/:id - Delete a user


## Example new page

### Create the page
POST /page
```json
{
  "data": {
    "attributes": {
      "url": "/",
      "title": "Homepage",
      "template": "homepage"
    }
  }
}
```

Returns ID: 567195bf35b9af28b01d6a85

### Create the page region
POST /region
```json
{
  "data": {
    "attributes": {
      "name": "main-content"
    }
  }
}
```

Returns ID: 567196d535b9af28b01d6a86

### Add the page region to the page

PUT /page/567195bf35b9af28b01d6a85/regions
```json
{
    "regions": "567196d535b9af28b01d6a86"
}
```


### Create content
POST /content
```json
{
  "data": {
    "attributes": {
      "type": "html",
      "data": {
        "html": "<strong>Main</strong> content"
      }
    }
  }
}
```

Returns ID: 56719882729a38749c876ef0


### Add the content to the page region

PUT /region/567196d535b9af28b01d6a86/content
```json
{
    "content": "56719882729a38749c876ef0"
}
```
