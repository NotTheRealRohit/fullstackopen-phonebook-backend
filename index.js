let data= require('./persons.json')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const generateId =()=>{
    const min=1;
    const max=1000;
    let id =1;
    while(data.some(person=>person.id === id)){
        id = Math.floor(Math.random()*(max-min+1))+min;
    }
    return id;
}

// const requestLogger = (req,res,next)=>{
//     console.log("method::",req.method);
//     console.log("path::",req.path);
//     console.log("body::",req.body);
//     next();
// }

// const unknownEndpoint = (req,res,next)=>{
//     console.log("Unknown endpoint MW")
//     res.status(404).json({
//         error:"unknown end point"
//     });
//     // next();
// }

// create custom token :body
morgan.token("body",(req,res)=>{
    const body = req.body;
    body.param = req.params;
    console.log(body);
    return JSON.stringify(body)
})

app.use(express.json());
app.use(cors());
//Logging of format example :- POST /api/persons 201 54 - 2.601 ms {"name":"Dana Abramov","number":"040-123456"}
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/',(req,res)=>{
    res.json("Hello world")
})

app.get('/api/persons',(req,res)=>{
    res.json(data)
})

app.get('/info',(req,res)=>{
    const info = `
    <p>Phone book has info for ${data.length} people</p>
    <p>${new Date()}</p>
    ` 
    res.send(info);
})

app.get('/api/persons/:id',(req,res)=>{
    const reqId = Number(req.params.id);
    const person = data.find(person=>person.id === reqId);
    
    if(!person){
        res.statusMessage= "Person not found";
        res.status(404).end();
    }else{
        res.json(person)
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const reqId = Number(req.params.id);
    const person = data.find(person=>person.id === reqId);
    
    if(person){
        data = data.filter(person=> person.id !== reqId);
    }

    res.status(204).end();
    
})

app.post("/api/persons",(req,res)=>{
    const body = req.body;
    console.log(body);

    if(!body || !body.name || !body.number){
        return res.status(400).json({
            error:"Required params missing in body"
        })
    }

    if(data.some(person=> person.name === body.name)){
        return res.status(400).json({
            error:"name must be unique"
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    data = data.concat(newPerson);
    res.status(201).json(newPerson);
})



const PORT = process.env.PORT|| 3001;

app.listen(PORT,()=>{
    console.log("app listening on ",PORT)
})


