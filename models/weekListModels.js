const mongoose = require('mongoose');


// user schema
const theWeekListSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    }
  });
  
  const theweeklist = mongoose.model('theweeklist', theWeekListSchema);

  module.exports = theweeklist;