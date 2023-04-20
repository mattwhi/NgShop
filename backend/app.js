const express = require('express');
const app = express();
const morgon = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

//cors enabled
app.use(cors());
app.options('*', cors())

const api = process.env.API_URL

// Routes
const productsRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');

//Middleware
app.use(express.json());
app.use(morgon('tiny'));
app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoryRouter)


//Routers
//const Product = require('./routers/product');

//connect to MongoDB Atlas
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