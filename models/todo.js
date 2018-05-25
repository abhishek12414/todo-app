let mongoose = require('mongoose');

let todoSchema = mongoose.Schema({
    text:{
        type: String,
        require: true
    },
    isChecked:{
        type: String,
        require: true
    }
});

let todo = module.exports = mongoose.model('todo', todoSchema);
