const express = require("express"); // // importa o node express
const server = express() // cria o servidor
const routes = require("./routes") // importa o arquivo de rotas


// setando o ejs
server.set("view engine", "ejs")


// ativando a pasta de arquivos estáticos
server.use(express.static("public"))


// ativando o corpo da request
server.use(express.urlencoded({extended: true}))

// rotas
server.use(routes)

// confirmando que o servidor ta on
server.listen(3000, () => console.log('Servidor está rodando!'))