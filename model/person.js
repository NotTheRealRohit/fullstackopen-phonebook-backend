const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI


mongoose.connect(url)
    .then(result=>{
        console.log("Connected to DB")
    }).catch(error=>{
        console.log("Unable to conenct to DB with error::",error);
    })

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON",{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
module.exports = mongoose.model("Person",personSchema);
