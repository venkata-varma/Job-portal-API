import { StringFormat } from 'firebase/storage'
import mongoose from 'mongoose'
import { isEmail } from 'validator'
const seekerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        validate: [isEmail, "Enter valid email"]
    },
    mobile: {
        type: Number,
        unique: true
    },
    otp: {
        type: Number
    },
    otpExpiration: {
        type: Date
    },
    fullName: String,
    dateOfBirth: {
        type: String
    },
    gender: {
        type: String
    },
    photo: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    higherEducation: {
        type: String
    },
    degree: {
        type: String
    },
    specialisation: {
        type: String
    },
    collegeName: {
        type: String
    },
    educationType: {
        type: String
    },
    englishLevel: {
        type: String,
        enum: ['Basic', 'Intermediate', "Advanced"]
    },
    experienced: {
        type: Boolean
    },

    previousExperienceDetails: [{
        idString: String,
        jobRole: String,
        dept: String,
        companyName: String,
        city: String,
        state: String,
        industryType: String,
        startDate: String,
        endDate: String,
        years: Number,
        months: Number,
        currentlyWorkingHere: Boolean,
        salaryPerMonth: Number,
        currency: String,
        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Intern"]
        },
        noticePeriodBalance: String,
        paySlip: String,
        experienceCertificate: {
            type: String

        }
    }],
    skills: [{
        skillName: {
            type: String
        }
    }],
    resumeURL: String,
    haveLaptop: Boolean,
    website: String,
    suggestJobType1: String,
    suggestJobType2: String,
    suggestJobType3: String,

    myApps: [{

        employerIdStr: String,
        jobRole: String,
        jobId: Number,
        jobRoleIdStr: String,
        companyName: String,
        postedDate: Date,
        appliedDate: Date,
        updatedDate: Date,
        employerNumber: Date,
        companyCity: String,
        companyCountry: String,
        typeOfJob: String,
        nightShift: Boolean,
        jobLocation: {
            type: String,
            enum: ["Home", "Office", "Field-work"]
        },
        jobDescription: String,
        myReviewAboutJob: String,
        dept: String,
        industryType: String,
        category: String,
        statusUpdate: String,
        applied: Boolean,

        resumeURL: String,
        coverLetterURL: String,
        photoUrl: String,
        photoUploaded: Boolean,
        criminalCases: Boolean,
        experienceRequired: Boolean,
        experienceInYears: Number,
        experienceInMonths: Number,


    }]
},
    { timestamps: true })
const seekerModel = mongoose.model('seekerModel', seekerSchema)
export default seekerModel