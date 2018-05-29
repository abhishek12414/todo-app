const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const reload = require('reload')
const assert = require('assert');
const bodyParser = require('body-parser');

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
db.once('open', function() {
    console.log('Connected to MongoDB');
}).on('error',function(){
    console.log('Error while connecting');
});

//create a server object
const hostname = '127.0.0.1';
const port = 3001;


app.get("/clear", function(req, response){
    db.collection('todos').drop();
    response.send('deleted')
});


app.get("/data", function(req, response){

    let data = req.query.data;

    if(data == null) {
        // console.log(getAllTODOs())
        // return getAllTODOs()

        // promise.then((res)=> {
        //     response.send(res);
        // });

        TODO.find({}, (err, allTODOs)=>{
            if(err) {
                reject(err);
            } else {
                response.send(allTODOs)
            }
        });

    } else {
        //for drop collection and insert new collection
        db.collection('todos').drop();
        
        TODO.insertMany(data, (err, res)=>{
            if(err)
                console.log('err');
            else {
                // return getAllTODOs();
                // promise.then((res)=> {
                //     response.send(res);
                // });
                
                TODO.find({}, (err, allTODOs)=>{
                    if(err) {
                        reject(err);
                    } else {
                        response.send(allTODOs)
                    }
                });
            }
        });    
    }            
});

// function getAllTODOs() {
//     // get all the collection
//     let result;
//     TODO.find({}, (err, allTODOs)=>{
//         if(err) {
//             console.log(err);
//             return "asdfasdf";
//         } else {
//             result = allTODOs;
//             // console.log(allTODOs)
//             console.log("-------")
//             return allTODOs;
//         }
//     });

// }


//to fetch data from the database
let promise = new Promise( function(resolve, reject) {
    TODO.find({}, (err, allTODOs)=>{
        if(err) {
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


// getAllTODOs = () => {
//     promise.then((res)=> {
//         console.log(res);
//     });

//     // TODO.find({}, (err, allTODOs)=>{
//     //     if(err) {
//     //         console.log(err);
//     //         return;
//     //     } else {
//     //         // result = allTODOs;
//     //         // console.log(allTODOs)
//     //         return allTODOs;
//     //     }
//     // });
// }

// reload(app);

app.listen(port, hostname, () => {
    console.log(`servre is running at http://${hostname}:${port}`);
});


// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     const myReadStream = fs.createReadStream(__dirname + '/../index.html', 'utf8')
//     myReadStream.pipe(res)
// });
