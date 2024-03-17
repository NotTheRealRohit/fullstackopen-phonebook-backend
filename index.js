require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const Person = require('./model/person');

const errorHandler = (error,req,res,next)=>{
    console.error(error);
    if(error.name === "CastError"){
        return res.status(400).json({
            message:"malformatted id"
        });
    }

    next(error);
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
    return JSON.stringify(body)
})

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
//Logging of format example :- POST /api/persons 201 54 - 2.601 ms {"name":"Dana Abramov","number":"040-123456"}
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons',(req,res)=>{
    Person.find({}).then(person=>{
        console.log(person);
        res.json(person);
    })
})

app.get('/info',(req,res)=>{
    Person.find({}).then(data=>{
        const info = `
        <p>Phone book has info for ${data.length} people</p>
        <p>${new Date()}</p>
        ` 
        res.send(info);
    })
})

app.get('/api/persons/:id',(req,res,next)=>{
    const reqId = (req.params.id);
    Person.findById(reqId).then(person=>{
        if(person)
            res.json(person);
        else
            res.status(404).end();
    }).catch(error=>{
        next(error);
    })
})

app.delete('/api/persons/:id',(req,res,next)=>{
    const reqId = req.params.id;

    Person.findByIdAndDelete(reqId).then(result=>{
        res.status(204).end();
    }).catch(err=> next(err));
    
})

app.post("/api/persons",(req,res,next)=>{
    const body = req.body;

    if(!body || !body.name || !body.number){
        return res.status(400).json({
            error:"Required params missing in body"
        })
    }

   
    const newPerson =new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save().then(updatedPerson=>{
        res.status(201).json(updatedPerson);
    }).catch(err=> next(err));
        
})

app.put('/api/persons/:id',(req,res,next)=>{
    const id = req.params.id;
    const body = req.body;
    const updatedPerson={
        name:body.name,
        number:body.number,
    }
    
    Person.findByIdAndUpdate(id,updatedPerson,{new:true}).then(result=>{
        res.json(result);
    }).catch(error=>next(error));
})

app.use(errorHandler);

const PORT = process.env.PORT|| 3001;

app.listen(PORT,()=>{
    console.log("app listening on ",PORT)
})


