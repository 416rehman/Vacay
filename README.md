# VACAY
<div align="center">
    <img src="https://img.shields.io/badge/Live-Demo-blueviolet?logo=heroku" alt="Live - Demo">
	<img src="https://img.shields.io/badge/Course-WEB322-2ea44f" alt="Course - WEB322">
	<img src="https://img.shields.io/badge/Grade-A%2B-informational" alt="Grade - A">
</div>

A mock bnb/travel web application for WEB322 Seneca.<br>
Using Express, Handlebars for backend/frontend, Mongo/Mongoose for DB, Passport for authentication, and AWS S3 storage for user uploads/content.

**[LIVE DEMO](http://web322.ahmadz.ai/)**

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
