import {isEmail} from 'validator'
import mongoose from 'mongoose'

const jobRolesSchema = new mongoose.Schema({

    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employerM'
    },

    empIdString:String,
    companyName: {
        type: String
    },
    consultancyName:{
        type:String
    },
    employerName: {
        type: String
    },
    jobRole: {
        type: String
    },
    jobId:Number,
    fillUpStatus:String,
    vacancies:{
        type:Number
    },
    
    Dept: {
        type: String,
        enum:["IT services", "Customer-support", "Supply&chain", "Advertising", "Cloud-services", "Medical", "Building&Construction", "Web-design"]
    },
    category: {
        type: String
    },
    typeOfJob: {
        type: String
    },
    nightShift: {
        type: Boolean
    },
    jobLocation: {
        type: String,
        enum: ["Office", "Home", "Field-Work"]
    },
    jobCity: {
        type: String
    },
    jobState: {
        type: String
    },
    jobCountry:String,
    googleLocation: {
        type: String
    },
    specficCity: {
        type: Boolean
    },
    wfhCity: {
        type: String
    },
    anywhereInIndia: {
        type: Boolean
    },
    fieldSpecificArea: {
        type: Boolean
    },
    fieldArea: {
        type: String
    },
    anyFieldArea: {
        type: Boolean
    },
    receiveAppsFrom: {
        type: String,
        enum: ["WithIn 10 KM", "WithIn 25 KM", "Entire city"]
    },
    relocationOption: {
        type: Boolean
    },
    compensationType: {
        type: String,
        enum: ["Fixed", "Fixed and Incentive", "Incentive only"]
    },
    salaryLakhPerAnnum:{
        type:Number
    },
    avgIncentivePerMonth: {
        type: Number
    },

joiningFee:{
    type:Boolean
},
fee:{
    type:Number
},
reason:{
    type:String
},
timeForPayment:{
    type:String,
    enum:["Before", "After", "Deducted from salary"]
},
joiningBonus:{
    type:String
},
overtimePay:{
    type:Boolean
},
annualBonus:{
    type:Boolean
},
PF:{
    type:Boolean
},
minimumEducation:{
    type:String,
    enum:["10", "10+2", "Graduation", "Diploma", "PostGraduation"]
},
gender:{
    type:String,
    enum:["male", "Female", "Any"]
},
anyAgeCriteria:{
    type:Boolean

},
ageCriteria:{
    type:String,
    enum:["below 35"]
},
experienceRequired:{
    type:String,
    enum:["Fresher", "Experienced", "Fresher/Experienced"]
},
experienceMandatoryInYears:{
type:String, 
enum:["Fresher/Experienced","1 year", "2 years", "3 years", "4 years", "5 years", "6 years", "7 years", "8 years", "9 years"]
},
englishLevel:{
    type:String,
    enum:["Basic", "Intermediate", "Advanced"]
},
skills:[{
    skillName:{
                 type:String
    }
}],
laptop:{
    type:Boolean
},
jobDescription:{
    type:String
},
interviewerDetails:{
    type:String,
    enum:["Myself", "Other recruiter"]
},
interviewType:{
    type:String,
    enum:["FtF", "online"]
},
interviewCity:{
    type:String
},
interviewState:{
    type:String
},
interviewFullAddress:{
    type:String
},
communicationType:{
    type:String,
    enum:["Calls plus whatsapp", "Whatsapp", "Website plus Excel download"]
},
presentPlanType:{
    type:String,
    enum:["Small", "Gold", "Platinum"]
},
// planId:{
//     type:mongoose.Types.ObjectId,
//     ref:'plan'
// }
targetPeople:{
    type:String
},
paymentStatus:{
    type:String
},
transactionId:{
    type:String
},
coinsPerUser:{
    type: Number
},
applications: [{
seekerIdStr:String,
seekerName:String,
sscPercen:Number,
interPercen:Number,
gradCGPA:Number,
pgCGPA:Number,
resumeURL:String,
coverLetterURL:String,
messageForHr:String,
seekerMobile:Number,
seekerEmail:{
    type:String,
validate:[isEmail,"Please enter valid email"]
},
seekerAlternateMobile:String,
criminalCases:Boolean,
experienceInRelavantField:Boolean,
experienceInYears:Number,
experienceInMonths:Number,
skills:String


    }]

},

{timestamps:true})

const jobRoleModel=mongoose.model('jobRolesModel',jobRolesSchema )
export default jobRoleModel