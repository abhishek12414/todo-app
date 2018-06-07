const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const reload = require('reload')
const assert = require('assert');
const bodyParser = require('body-parser');

//create a server object
const hostname = '127.0.0.1';
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

//connect to database
mongoose.connect('mongodb://localhost/todoapp');
let db = mongoose.connection;

const TODOSchema = mongoose.Schema({
    id: Number,
    text: String,
    isChecked: Number
});

const TODO = mongoose.model('TODO', TODOSchema);

//check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
}).on('error', function () {
    console.log('Error while connecting');
});

app.get("/", function (req, res) {
    res.render('index.html')
});

app.get("/api", function (req, res) {
    TODO.find({}, (err, allTODOs) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(allTODOs);
        }
    });
});

app.post("/api", function (req, response) {

    let data = JSON.parse(req.body.data);
    db.collection('todos').drop();

    TODO.insertMany(data, (err, res) => {
        if (err)
            console.log('err');
        else {
            TODO.find({}, (err, allTODOs) => {
                if (err) {
                    response.status(400).send(err)
                } else {
                    response.status(200).send(allTODOs);
                }
            });
        }
    });
});

app.delete("/api", function (req, response) {
    db.collection('todos').drop();
    response.send('deleted');
});

//to fetch data from the database
let promise = new Promise(function (resolve, reject) {
    TODO.find({}, (err, allTODOs) => {
        if (err) {
            // console.log(err);
            // return;
            reject(err);
        } else {
            // result = allTODOs;
            // console.log(allTODOs)
            // return allTODOs;
            // console.log(allTODOs)
            resolve(allTODOs)
        }
    });
});

app.listen(port, hostname, () => {
    console.log(`servre is running at http://${hostname}:${port}`);
});
