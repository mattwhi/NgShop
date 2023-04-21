const express = require('express');
const app = express();
const morgon = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Include .env configurations
require('dotenv/config');

//cors enabled
app.use(cors());
app.options('*', cors())

const api = process.env.API_URL

// Routes (API)
const productsRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const usersRouter = require('./routers/users');

//Middleware
app.use(express.json());
app.use(morgon('tiny'));
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/users`, usersRouter)



//connect to MongoDB Atlas
//connection string and credentials stored in .env
mongoose.connect(process.env.MONGO_CONNECT)
.then(()=>{
    console.log('Connection is ready')
})
.catch((err)=> {
    console.log(err)
});

app.listen(3000, ()=>{
    console.log(api);
    console.log("the service is running on http://localhost:3000")
})