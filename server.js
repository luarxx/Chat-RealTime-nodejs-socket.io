const express = require("express"); // importando o express para o projeto
const app = express(); // chamanado a função express e atribuindo a uma variável app para iniciar o servidor

app.use(express.static("public")); // definindo o diretório onde ficarão os arquivos estáticos (css, js, imagens, etc ...)

const http = require("http").Server(app); // importando o http e passando a função app para o servidor http para que ele possa ouvir as requisições
const serverSocket = require("socket.io")(http); // importando o socket.io para o projeto

const porta = 8000; // definindo a porta que o servidor vai ouvir

http.listen(porta, function () {
  // iniciando o servidor na porta definida na constante porta e passando uma função de callback para mostrar no console que o servidor está rodando
  console.log(`Servidor rodando na porta ${porta}`);
});

app.get("/", function (req, res) {
  // definindo a rota raiz do projeto
  res.sendFile(__dirname + "/index.html"); // enviando o arquivo index.html para o navegador quando o usuário acessar a rota raiz do projeto (localhost:8000)
});

serverSocket.on("connection", function (socket) {
  // função que é executada quando um cliente se conecta ao servidor socket (quando o usuário acessa o site)

  socket.on("login", function (nickname) {
    console.log("Usuário entrou:" + nickname); // mostrando no console o id do usuário que se conectou
    serverSocket.emit("chat msg", `Usuário ${nickname} conectou.`);
    socket.nickname = nickname; // atribuindo o id do usuário a uma variável nickname dentro do socket para que possamos usar esse id depois
  });

  socket.on("chat msg", function (msg) {
    // função que é executada quando o servidor recebe uma mensagem do cliente (quando o usuário envia uma mensagem)
    console.log(`Mensagem recebida ${socket.nickname}: ${msg}`); // mostrando no console a mensagem recebida e o id do usuário que enviou a mensagem
    socket.broadcast.emit("chat msg", `${socket.nickname}: ${msg}`); // enviando a mensagem recebida para todos os clientes(menos eu) conectados ao servidor socket
  });

  socket.on("status", function (msg) { // função que é executada quando o servidor recebe uma mensagem do cliente (quando o usuário envia uma mensagem)
    serverSocket.emit("status", msg); // enviando a mensagem recebida para todos os clientes conectados ao servidor socket
  });
});

// função que é executada quando um cliente se desconecta do servidor socket (quando o usuário fecha a aba do site)
