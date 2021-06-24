//import your Todo model here
const model = require("./model.js");

let counter = 0;

function myCountingProcess() {
  console.log(`ran ${counter} times`);
  counter++;
}

function myCleanupProcess() {
  //delete todo with done ===true
  //and 1 day past deadline
  //
  //use your todo model here

  let date = new Date();
  date.setDate(date.getDate() - 1);
  model.Todo.deleteMany(
    { done: true, deadline: { $gt: date } },
    (err, deleteResult) => {
      console.log(`deleted ${deleteResult.deletedCount} todos`);
    }
  );
}

module.exports = {
  myCountingProcess,
  myCleanupProcess,
};
