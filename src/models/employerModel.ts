import mongoose from 'mongoose'

const employerSchema = new mongoose.Schema({

    mobile: {
        type: Number,
        unique:true
    },
    email: {
        type: String
    },
    otp: {
        type: Number
    },
    otpExpiration: {
        type: Date
    },
    fullName: {
        type: String
    },
    typeOfEmployer: {
        type: String,
        enum:["I am a full-time HR hiring for openings", "consultancy/staffing service","Freelancer","Contactual recruiter","Business owner"]
    },
    myOwnCompany:{
        type:Boolean
    },
    consultancy:{
        type:Boolean
    },
    companyName: {
        type: String
    },
    industryType: {
        type: String,
        enum:["IT services", "Multi-Service-based", "Service and Product-based","no-code",  "customer-support", "Proctoring", "Sales&services","Supply&chain"]

    },
    numberOfPeople:{
        type:Number
    },
    consultancyName:{
        type:String
    },
    
    companyWebsite:{
        type:String
    },
    consultancyWebsite:{
        type:String
    },
    clientNames:[{
          clientName:{
            type:String
          }
              
    }],
    coinsPresent:{
        type:Number
    }

},
{timestamps:true}
)

const employerM = mongoose.model('employerModel', employerSchema)
export default employerM