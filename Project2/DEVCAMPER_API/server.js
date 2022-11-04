const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

//Carregando variáveis
dotenv.config({ path: './config/config.env' })

//connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps')


//iniciando variável app
const app = express()

//Body parser (permite o node reconhecer o json vindo da requisição)
app.use(express.json())

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

const server = app.listen(
  PORT,
  console.log(`Servidor rodando em ${process.env.NODE_ENV} na porta ${PORT}`.yellow.bold)
)

//Handle unhandled promise rejections (tornando erro de login mais compreensível)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)

  //Close server e exit process
  server.close(() => process.exit(1));
})
