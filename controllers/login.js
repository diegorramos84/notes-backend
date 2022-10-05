const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username }) // find the user
  const passwordCorrect = user === null
    ? false // if user does not exist, return false
    : await bcrypt.compare(password, user.passwordHash) // if user exist check passwords

  if (!(user && passwordCorrect)) { // if any is false return error
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // if pd and username are correct a token is created

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
