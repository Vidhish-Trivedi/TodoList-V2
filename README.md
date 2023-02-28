# TodoList-V2
#### - A simple web app which allows a user to create and manage multiple Todo lists and save data persistently using MongoDB.

## Features
---
- By default, all lists are displayed to the user as a grid on the root route ("/").  
- The application will create routes on the fly, allowing the user to create multiple lists on different routes such as "/home/open", "/work/open", "/", etc.
- "/<list_name>/open" will create a seperate list with <list_name> as its name. If a list with this name already exists, it will be displayed to the user.
- The user can delete a completed task using the checkbox next to it, or delete an entire list.
- The user can add a new task using the + button.

## Tech
---
- NodeJS
- Express and EJS
- MongoDB with Mongoose
- HTML, CSS, Bootsrap, JavaScript

## How To Use
---
- Clone this repository
- Install the dependencies.
```sh
cd TodoList-V2
npm i
```
- Run
```sh
node app.js
```
- Go to http://localhost:3000 to access the root route.
- To create a new list or view an existing list on its own, go to http://localhost:3000/<list_name>/open
- Note that inorder for the app to work as intended, the user must have a MongoDB server running on port 27017 on localhost, or alternatively, make appropriate changes to the code.
