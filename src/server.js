const express = require("express"); // importing express node module 
const server = express() // creating the server
const routes = require("./routes") // importing the routes file


// seting the ejs (Embedded JavaScript)
server.set("view engine", "ejs")


// enabling statics files
server.use(express.static("public"))


// routes
server.use(routes)

server.listen(3000, () => console.log('Servidor está rodando!'))