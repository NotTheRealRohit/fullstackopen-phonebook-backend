const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI


mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(_result => {
    console.log('Connected to DB')
  }).catch(error => {
    console.log('Unable to conenct to DB with error::',error)
  })

const personSchema = mongoose.Schema({
  name: {
    type:String,
    minLength: 3,
    required:true,
  },
  number: {
    type: String,
    minLength: 8,
    validate:{
      validator: function(value){
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON',{
  transform: (_document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Person',personSchema)
