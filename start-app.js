//Import the express app created and configured in app.js
var app = require('./app');
//Use the port environment variable for the http port. Default to 8080 if undefined.
const port = process.env.PORT || 8080;
//Start the app. It's accessible at `http://localhost:${port}` in a dev environment. Example http://localhost:8080/
app.listen(port, () => console.log(`Example app listening on port ${port}!`));