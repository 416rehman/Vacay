# VACAY

(LIVE DEMO)[http://web322.ahmadz.ai/]

A mock bnb/travel web application for WEB322 Seneca.

Using Express, Handlebars for backend/frontend, Mongo/Mongoose for DB, and Passport for authentication.

## TODO

1. Highlight invalid form fields
2. Finish Search
3. Add activation system (New accounts should be validated via email)
4. Add Password Reset system

## Installation

1. Highlight invalid form fields
2. Finish Search
3. Add account activation and Password Reset system (New accounts should be validated via email)

## Installation

1. Clone the repo
2. Run `npm i` in the directory
3. Rename the `sample.env` file to `.env`
4. Fill the .env file with your mongo URI, and other fields.
5. Run `nodemon` in the directory
6. Visit http://localhost:3000/ 

## Directory Structure

```
.
├── controllers
│   ├── middleware
│   └── new
├── models
│   └── plugins
├── public
│   ├── assets
│   │   └── logo
│   ├── css
│   │   ├── pages
│   │   │   ├── articles
│   │   │   ├── listings
│   │   │   ├── new
│   │   │   └── user
│   │   └── partials
│   ├── js
│   │   └── partials
│   └── uploads
│       ├── articles
│       ├── listings
│       ├── locations
│       └── types
└── views
    ├── helpers
    ├── layouts
    ├── pages
    │   ├── articles
    │   ├── listings
    │   ├── new
    │   └── user
    └── partials
```
**views** ​- Handlebars files/helpers

**public** - files to be served on your frontend.
public/uploads contains user uploaded content.

**models** - Contains mongoose models and any custom mongoose plugins

**controllers** - Express/Server-side routes, controllers, and custom middleware.
