const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack-open:${password}@first-cluster.jmn7lpk.mongodb.net/fullstack-phonebook?retryWrites=true&w=majority&appName=first-cluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person',personSchema)

if(process.argv.length === 5){
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const person = new Person({
    name: personName,
    number: personNumber
  })

  person.save().then(result => {
    console.log('Added',result.name,'with number:', result.number,'to phonebook')
    mongoose.connection.close()
  })
}

if(process.argv.length === 3){
  Person.find({}).then(result => {
    result.forEach(element => {
      console.log(element.name,element.number)
    })
    mongoose.connection.close()
  })
}








