//http é um dos módulos centrais do node (não precisa dar npm i para usar)
const { Console } = require('console')
const http = require('http')

const todos = [
  { id: 1, text: 'Todo One' },
  { id: 2, text: 'Todo Two' },
  { id: 3, text: 'Todo Three' },
]

//Cria um server que aceita requisições e responde
const server = http.createServer((req, res) => {
  const { method, url } = req

  let body = []

  req
    .on('data', (chunk) => {
      //'data' é o evento ativado
      body.push(chunk)
      console.log(chunk) // O chunk (pedaço) gerado é um buffer (dados em memória temporária)
    })
    .on('end', () => {
      body = Buffer.concat(body).toString() //enviando pro cliente o body em string

      let status = 404 //Status padrão
      const response = { //Resposta padrão
        success: false,
        data: null,
        error: null,
      }

      //Métodos sem express
      if (method === 'GET' && url === '/todos') {
        status = 200
        response.success = true
        response.data = todos
      } else if (method === 'POST' && url === '/todos');
      {
        const { id, text } = JSON.parse(body) //Pegando id e text do texto enviado na requisição POST

        if (!id || !text) { //validação simples de dados vindos do cliente
          status = 400;
          response.error = 'Por favor, adicione id e text';
        } else {
          todos.push({ id, text }) //inserindo novo objeto
          status = 201;
          response.success = true;
          response.data = todos;
        }
      }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'x-Powered-By': 'Node.js',
      })

      res.end(JSON.stringify(response))
    })
})

const PORT = 5000

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
