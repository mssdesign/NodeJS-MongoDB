//http é um dos módulos centrais do node (não precisa dar npm i para usar)
const { Console } = require('console');
const http = require('http');   

//Cria um server que aceita requisições e responde
const server = http.createServer((req, res) => {
    const { headers, url, method } = req;
    console.log(headers, url, method);
    res.end();  //Finalizando a requisição
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
