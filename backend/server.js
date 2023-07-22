const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
* Connection MongoDB
* */

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

/*
* Routing
*/

const usersRouter = require('./routes/user');
const userAuth = require('./routes/auth');


app.use('/users',usersRouter);
app.use('/auth',userAuth);