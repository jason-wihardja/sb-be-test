# Sayurbox Backend Engineer Test

This project uses Express.js as the web development framework, with SQLite database as the data store. Sequelize ORM is used to handle the database operations.

This project needs only 2 environment variable:
1. `PORT`

   Use this variable to set which port the web server will be listening to (defaults to `3000`).

2. `LOG_LEVEL`

   Use this variable to set which log level will be printed out to the console. Possible values are `trace`, `debug`, `info`, `warn`, `error`, and `fatal` (defaults to `trace`).

The server also supports graceful exit, meaning that the process will only exit after the server and database connection are already closed.

In addition, node's `cluster` module is also used, enabling the server to survive crashes from worker processes.

To start the web server, simply type `npm start`. To start the web server in development mode using `nodemon` (for automatic restarting when changes occurs), type `npm run dev`.

To seed the database when setting up the project for first time, run `npm run seed`.
