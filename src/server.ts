import express from 'express'
import router from './router'

const app = express()

app.use('/api', router)

app.get('/', (req, res) => {
  console.log('hello from express')
  res.status(200)
  res.json({message: "hello"})
})


export default app