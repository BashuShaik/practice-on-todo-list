const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
// console.log(dbPath);

let database = undefined;

const initializingDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is Running..! #Bashu");
    });
  } catch (e) {
    console.log(`Database Error: ${e.message}`);
    process.exit(1);
  }
};

initializingDbAndServer();

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;

  /* console.log(status);
  console.log(priority);
  console.log(search_q); */

  const one = `select * from todo where status like '${status}';`;
  const statusArray = await database.all(one);
  response.send(statusArray);

  const two = `select * from todo where priority like '${priority}';`;
  const priorityArray = await database.all(two);
  response.send(priorityArray);

  const three = `select * from todo where priority like '${priority}' and status like '${status}';`;
  const oneAndTwoArray = await database.all(three);
  response.send(oneAndTwoArray);

  const four = `select * from todo where todo like '%${search_q}%';`;
  const playTodo = await database.all(four);
  response.send(playTodo);
});

app.get("/todos/:id/", async (request, response) => {
  const { id } = request.params;
  // console.log(id);
  const five = `select * from todo where id like '${id}';`;
  const todoIdArray = await database.get(five);
  response.send(todoIdArray);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  // console.log(id, priority, status, todo);

  const six = `insert into todo(id,todo,priority,status)
  values 
  (
      '${id}',
      '${todo}',
      '${priority}',
      '${status}'
 );`;

  const addTodo = await database.run(six);
  response.send("Todo Successfully Added");
});

app.put("/todos/:id/", async (request, response) => {
  const { id } = request.params;
  const { status, priority, todo } = request.body;

  const seven = `update todo set status = '${status}' where id = '${id}';`;
  const updateTodoStatus = await database.run(seven);
  response.send("status updated");

  const eight = `update todo set todo = '${todo}' where id = '${id}';`;
  const updateTodo = await database.run(eight);
  response.send("Todo updated");

  const nine = `update todo set priority = '${priority}' where id = '${id}';`;
  const updatePriority = await database.run(nine);
  response.send("Priority updated");
});

app.delete("/todos/:id/", async (request, response) => {
  const { id } = request.params;
  const ten = `delete from todo where id = '${id}';`;
  const deleteId = await database.run(ten);
  response.send("Todo deleted");
});

module.exports = app;
