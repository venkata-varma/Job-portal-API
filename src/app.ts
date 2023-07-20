import express, {Request,Response,NextFunction} from 'express'
const app=express()
app.use(express.json())

const db=require('./fireBaseConnect')
// app.use('/images', express.static('photos'))





import mainRoute from './routes/mainRoute'
app.use('/', mainRoute)



export default app
