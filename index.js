//This file is in charge of starting the application

const server = require("./server.js");
const persist = require("./persist.js");

//Define a port
const port = process.argv[2] || process.env.PORT || 3000;

//Connect to the database
persist.connect(() => {
  //start the server
  server.listen(port, () => {
    console.log(`Server Running! on ${port}`);
  });
});

//testing comment
