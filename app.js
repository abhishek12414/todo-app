const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const reload = require('reload')
const assert = require('assert');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connect to database
mongoose.connect('mongodb://localhost/todos');
let db = mongoose.connection;

//check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
}).on('error',function(){
    console.log('Error while connecting');
});

// const fs = require('fs');

//create a server object
const hostname = '127.0.0.1';
const port = 3001;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     const myReadStream = fs.createReadStream(__dirname + '/../index.html', 'utf8')
//     myReadStream.pipe(res)
// });

app.use(express.static("public"));

app.get("/data", function(req, res){
    // console.log(req.query['data']);
    insertData(req.query.data);
    res.send(req.query);
});

// reload(app);

app.listen(port, hostname, () => {
    console.log(`servre is running at http://${hostname}:${port}`);
});

function insertData(data) {
    //Drop the collection
    // mongoose.connection.collections.drop(function() {
    //     done();
    // });
    console.log(data)
    let x = {name : "a", age:34};
    
    db.collection('todos').drop();
    db.collection("todos").insert(data, function(err, res){
        if(err)
            console.log(err);        
    });
    
    console.log(db.collection('todos').find({}));
}