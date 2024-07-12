# Getting Started with Create React App

This is a full-stack web application created using React.js, Node.js and Express with styling elements from Bootstrap.

Upon loading the page, a JWT token is generated which allows the user to use the 'search' functionality for up to 3 hours before it expires.

The user is able to use this web application to send requests to the iTunes Search API which is done by using the input field and dropdown menu to search for any type of media content available on iTunes. 

The user is then able to scroll through the search results and add any of the results to their 'Favourites', which will pop up another mapped array to clearly display all the added results.

From here, the user can continue to add as well as remove them from the 'Favourites' section.

Any search results are logged in the console. If the user's adds a result to 'Favourites' then that specific result is also returned in the console.

## Available Scripts

In the project directory, to start the back-end server you can run:

### `node server.js`

In the front-end directory, to start the front-end application you can run:

### `npm start`

Runs the app in the development mode.