const mongoose = require('mongoose')

const tasksSchema = new  mongoose.Schema({
    type : {
        type : "string",
        required : true,
        trim : true
    },
    description : {
        type : "string",
        required : true,
        trim : true        
    },
    completed : {
        type : Boolean,
        default : false
    },
    ownerID  : { 
        type : mongoose.Schema.Types.ObjectId ,
        required:true
     }  
    
})
const Task = mongoose.model('Task',tasksSchema)

module.exports = Task