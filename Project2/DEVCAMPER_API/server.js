const express = require('express')
const dotenv = require('dotenv')

//Route files
const bootcamps = require('./routes/bootcamps')

//Carregando variáveis
dotenv.config({ path: './config/config.env' })

//iniciando variável app
const app = express()

//Montar rotas
app.use('/api/v1/bootcamps', bootcamps)

//escutando porta do env e se não tiver disponível escutar na 5000 msm
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Servidor rodando em ${process.env.NODE_ENV} na porta ${PORT}`)
)
