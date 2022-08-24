const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.get('/' , (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes' , (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.statusMessage = "This note does not exist"
    response.status(404).end()
  }
})


app.delete('/api/notes/:id' , (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 // if exists any notes
    ? Math.max(...notes.map(n => n.id)) // check the max id number mapping t/ all the notes
    : 0 //otherwise set id to 0 (no notes in the notes array)
  return maxId + 1
}

app.post('/api/notes' , (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note) // add the notes to the end of the array

  response.json(note)

})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
