import app from './app'
import dotenv from 'dotenv'
dotenv.config()
const post: any = process.env.postm
import dbConnect from './dbConnect'
dbConnect()
app.listen(post, () => {
    console.log('Server is up on', post)
})