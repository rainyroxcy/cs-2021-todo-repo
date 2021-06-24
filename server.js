//This file is in charge of api endpoints and the api server stuff

//Import Express Package to use some of the functionality
const express = require("express");
const { Model } = require("mongoose");
const { store, Todo } = require("./model");
const cors = require("cors");
//Instantiate your app/server
const app = express();
app.use(cors());

app.use(express.static("static"));

//tell our app
app.use(express.json({}));

let nextid = 0;

//This is where we will do our own middleware
app.use((req, res, next) => {
  console.log(
    "Time:",
    Date.now(),
    "- Method:",
    req.method,
    " - Path",
    req.originalURL,
    " - Body",
    req.body
  );
  next();
});

//Get - gets all of the to-dos (does not have a URL parameter)
app.get("/todo", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let findQuery = {};
  console.log("getting all todos");
  console.log(req.query);
  if (req.query.name !== null && req.query.name !== undefined) {
    findQuery.name = { $regex: req.query.name, $options: "i" };
  }
  if (
    req.query.afterDeadline !== null &&
    req.query.afterDeadline !== undefined
  ) {
    findQuery.deadline = { $gt: new Date(req.query.afterDeadline) };
  }
  if (req.query.done !== null && req.query.done !== undefined) {
    findQuery.done = req.query.done;
  }
  if (req.query.description !== null && req.query.description !== undefined) {
    findQuery.description = { $regex: req.query.description, $options: "i" };
  }

  console.log("getting all todos with find query", findQuery);
  // return all of the todos in the store
  Todo.find(findQuery, function (err, todos) {
    //check if there was an error
    if (err) {
      console.log(`there was error finding`, err);
      //send back error
      res.status(500).json({ message: `unable to list todos`, error: err });
      return;
    }
    //return all of the todos in the store
    res.status(200).json(todos);
  });
});

//Get - gets the to-do with the given id

app.get("/todo/:id/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`getting todo with id: ${req.params.id}`);

  Todo.findById(req.params.id, (err, todo) => {
    //Check if there was an error
    if (err) {
      console.log(
        `there was an error finding a tod0 with id ${req.params.id}`,
        err
      );
      //send back error
      res.status(500).json({
        error: `Unable to find todo with id ${req.params.id}`,
        error: err,
      });
      return;
    } else if (todo === null) {
      res.status(404).json({
        error: `Returns Null`,
        error: err,
      });
      return;
    }
    res.status(200).json(todo);
  });
});

//Post = creates one to-do. (Does not have url parameter)
app.post("/todo", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`posting a to-do`, req.body);

  let creatingTodo = {
    name: req.body.name || " ",
    description: req.body.description || " ",
    done: req.body.done || false,
    deadline: req.body.deadline || new Date(),
    notes: req.body.notes || " ",
  };

  Todo.create(creatingTodo, (err, todo) => {
    if (err) {
      console.log(`unable to create todo`);
      res.status(500).json({
        message: "unable to create todo",
        error: err,
      });
      return;
    }
    res.status(201).json(todo);
  });
});

//Delete - delete one
app.delete("/todo/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`deleting todo with id: ${req.params.id}`);
  Todo.findByIdAndDelete(req.params.id, (err, todo) => {
    if (err) {
      console.log(
        `there was an error finding a tod with id ${req.params.id}`,
        err
      );
      res.status(500).json({
        error: `Unable to find todo with id ${req.params.id}`,
        error: err,
      });
    } else if (todo === null) {
      res.status(404).json({
        error: `Returns Null`,
        error: err,
      });
      return;
    }
    res.status(200).json(todo);
  });
});

//Patch - Update
app.patch("/todo/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`updating todo with id: ${req.params.id} with body`, req.body);
  //curate update object
  let updateTodo = {};
  if (req.body.name != null && req.body.name != undefined) {
    updateTodo.name = req.body.name;
  }
  if (req.body.description != null && req.body.description != undefined) {
    updateTodo.description = req.body.description;
  }
  if (req.body.done != null && req.body.done != undefined) {
    updateTodo.done = req.body.done;
  }
  if (req.body.deadline != null && req.body.date != undefined) {
    updateTodo.deadline = req.body.deadline;
  }
  if (req.body.notes != null && req.body.notes != undefined) {
    updateTodo.notes = req.body.notes;
  }

  Todo.updateOne(
    { _id: req.params.id },
    { $set: updateTodo },
    function (err, updateResult) {
      //check error
      if (err) {
        console.log("unable to patch", err);
        res.status(500).json({
          message: "unable to patch todo",
          error: err,
        });
      } else if (updateResult.n === 0) {
        console.log("");
        res.status(404).json({
          error: "Returns Null",
          error: err,
        });
        return;
      }
      res.status(200).json(updateTodo);
    }
  );
});

//Put - Replace
app.put("/todo/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`replacing todo sith id:${req.params.id} with body`, req.body);
  let updateTodo = {
    name: req.body.name || " ",
    description: req.body.description || " ",
    done: req.body.done || false,
    deadline: req.body.deadline || new Date(),
    notes: req.body.notes || " ",
  };

  Todo.updateOne(
    { _id: req.params.id },
    {
      $set: updateTodo,
    },
    function (err, updateResult) {
      //check error
      if (err) {
        console.log("unable to ut", err);
        res.status(500).json({
          message: "unable to put todo",
          error: err,
        });
      } else if (updateResult.n === 0) {
        console.log("");
        res.status(404).json({
          error: "Returns Null",
          error: err,
        });
        return;
      }
      res.status(200).json(updateTodo);
    }
  );
});

//exporting the entire file as app
module.exports = app;
