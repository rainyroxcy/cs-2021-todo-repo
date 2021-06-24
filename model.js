const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  name: String,
  description: String,
  done: Boolean,
  deadline: Date,
  notes: String,
});

const Todo = mongoose.model("Todo", todoSchema);

const store = {};

module.exports = {
  Todo,
  store,
};
