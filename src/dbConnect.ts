import mongoose from 'mongoose'
mongoose.set('strictQuery', false);

const dbConnect = async () => {
    try {

       await  mongoose.connect(process.env.db_uri, 
            { useNewUrlParser: true }as any) 


        // mongoose.connection.once('open', () => {
        //     console.log('Database successfully connected')
        // })

        // mongoose.connection.on('error', () => {
        //     console.log('Error connecting database')
        // })

console.log("DB connected")

    } catch (Err:any) {
        console.log(Err.message)
    }
}

export default dbConnect