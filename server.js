//http é um dos módulos centrais do node (não precisa dar npm i para usar)
const { Console } = require('console');
const http = require('http');   

const todos = [
    {id: 1, text: 'Todo One'},
    {id: 2, text: 'Todo Two'},
    {id: 3, text: 'Todo Three'}
];

//Cria um server que aceita requisições e responde
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js'
    })

    let body = [];

    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log(body)
    })

    res.end(JSON.stringify({
        success: true,
        data: todos
    }));  
    //Finalizando a requisição e retornando algo ou nada
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
