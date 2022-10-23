const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

//Route files
const bootcamps = require('./routes/bootcamps')

//Carregando variáveis
dotenv.config({ path: './config/config.env' })

//iniciando variável app
const app = express()

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//Middleware (função que tem acesso a cada requisiçaõ e é executada após cada requisição)
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  )
  next() //Mover para o próximo trecho da middleware
}

app.use(logger)

//Montar rotas
app.use('/api/v1/bootcamps', bootcamps)

//escutando porta do env e se não tiver disponível escutar na 5000 msm
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Servidor rodando em ${process.env.NODE_ENV} na porta ${PORT}`)
)
