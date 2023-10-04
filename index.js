const express = require("express")
const bodyParser = require("body-parser")
const morgan = require('morgan');
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(bodyParser.json())

morgan.token('custom', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'));

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send("<h1>Persons API</h1>")
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people<br>${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("requested id", id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    if (!persons.some(person => person.id === id)) {
        res.status(404).end()
    }
    persons = persons.filter(person => person.id !== id)
    console.log("deleted id if exists", id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length ? Math.max(...persons.map(person => person.id)) : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    // console.log(body.content)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "content missing"
        })
    }

    if (persons.some(person => person.name === body.name)) {
        // console.log(persons)
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)