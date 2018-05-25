const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const reload = require('reload')
//connect to database
mongoose.connect('mongodb://localhost/todos');
let db = mongoose.connection;


//check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
})

//check for DB errors
db.on('error', function(err){
    console.log(err);
})

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

app.get("/", function(req, res){
    res.render('index.html')
})

reload(app);

app.listen(port, hostname, () => {
    console.log(`servre is running at http://${hostname}:${port}`);
});