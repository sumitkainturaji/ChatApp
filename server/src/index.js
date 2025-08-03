import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import connectDB from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket.js'

dotenv.config()
const PORT = process.env.PORT

connectDB()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://chatapp-6vdf.onrender.com',
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '5mb' }))

app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, () => {
  console.log(`server ruunig at ${PORT}`)
})
