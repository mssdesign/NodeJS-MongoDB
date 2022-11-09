const mongoose = require('mongoose');

const connectDB = async () => {
    //o mongose.connect retorna uma promise (dá pra usar async await/catch then...)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB;