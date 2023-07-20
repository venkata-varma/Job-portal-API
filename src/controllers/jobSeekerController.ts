import express, { Request, Response, NextFunction } from 'express'
import seekerModel from '../models/jobSeekerModel'
import employerM from '../models/employerModel'
import jobRoleModel from '../models/employerJobRolesModel'
import { generateOTP } from '../utils/OTPsend'
import jwt from 'jsonwebtoken'

import db from '../fireBaseConnect'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, mobile } = req.body
        const seeker = await seekerModel.findOne({ email: email, mobile: mobile })
        if (!seeker) {
            const otp = generateOTP()
            const newDate = new Date()
            newDate.setSeconds(newDate.getSeconds() + 45)
            const newSeeker = await seekerModel.create({
                email,
                mobile,
                otp,
                otpExpiration: newDate
            })
            res.status(201).json({
                success: true,
                id:newSeeker._id,
                otp:newSeeker.otp,
                mobile:newSeeker.mobile
            })
        } else {
            const otp = generateOTP()
            const newDate = new Date()
            newDate.setSeconds(newDate.getSeconds() + 45)
            const updateSeeker = await seekerModel.findByIdAndUpdate(seeker._id, { $set: { otp: otp, otpExpiration: newDate } }, { new: true })
            res.status(200).json({
                success: true,
                id:updateSeeker._id,
                otp:updateSeeker.otp,
                mobile:updateSeeker.mobile,
                message: "Welcome Home ! Please raise bar of your profile"
            })
        }

    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}

export const otpValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const seeker = await seekerModel.findById(req.params.id)
        if (req.body.otp !== seeker.otp) {
            return res.status(404).json({
                success: false,
                message: "Wrong otp"
            })
        }
        const toDate = new Date()
        if (toDate > seeker.otpExpiration) {
            return res.status(404).json({
                success: false,
                message: "otp expired"
            })
        }
        const sToken = await jwt.sign({ id: seeker._id }, process.env.seeker_jwt_token, { expiresIn: '2d' })
        res.status(200).json({
            success: true,
            seekerEmail: seeker.email,
            sToken

        })


    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }

}

export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seeker = await seekerModel.findById(req.params.id)
        const otp = generateOTP()
        const exdare = new Date()
        exdare.setSeconds(exdare.getSeconds() + 45)

        const updateSeeker = await seekerModel.findByIdAndUpdate(seeker._id, { $set: { otp, otpExpiration: exdare } }, { new: true })
        res.status(200).json({
            mobile: updateSeeker.mobile,
            otp: updateSeeker.otp
        })
    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}


export const personalDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateSeeker = await seekerModel.findByIdAndUpdate(req.body.seeker._id, req.body, { new: true })
        const {_id:id, __v, ...others}:any=updateSeeker
        res.status(200).json({
            success: true,
        id,
        ...others

        })
    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}





export const addExperienceDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const seker: any = await seekerModel.findById(req.body.seeker._id)
        const { experienced, jobRole, dept, companyName, city, state, industryType, startDate, noticePeriodBalance, endDate, years, months, currentlyWorkingHere, salaryPerMonth, currency, employmentType } = req.body
        if (!req.file) {
            var downloadUri:any = undefined
        }else{

           
            const Tdate = Date.now()

            const storageref = ref(storage, `Experience certificates/${seker.fullName}_${Tdate}`)
            const metadata = {
                contentType: req.file.mimetype
            }
            const snapshot = await uploadBytesResumable(storageref, req.file.buffer, metadata)
            var downloadUri:any = await getDownloadURL(snapshot.ref)
        }
            const expBy: any = {
                jobRole,
                experienced,
                dept,
                companyName,
                city,
                state,
                industryType,
                startDate,
                endDate,
                currentlyWorkingHere,
                salaryPerMonth,
                currency,
                employmentType,
                years,
                months,
                noticePeriodBalance,
                experienceCertificate: downloadUri
            }
            seker.previousExperienceDetails = seker.previousExperienceDetails.concat(expBy)
            seker.experienced = experienced
            await seker.save()
            seker.previousExperienceDetails.forEach(n => {
                if (n.startDate === startDate && n.endDate === endDate && n.companyName === companyName) {
                    const toStr: any = n._id.toString()
                    n.idString = toStr
                }
            })
            await seker.save()
            res.status(200).json({
                success: true,
                id:seker._id,
                ...seker
            })
        
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}




export const uploadExperienceCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const seeker: any = await seekerModel.findById(req.body.seeker._id)
        const Tdate = Date.now()
        const storageref = ref(storage, `Experience certificates/${seeker.fullName}_${Tdate}`)
        const metadata = {
            contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageref, req.file.buffer, metadata)
        const downloadUri = await getDownloadURL(snapshot.ref)
        seeker.previousExperienceDetails.forEach((exp: any) => {
            if (exp.idString === req.params.id) {
                exp.experienceCertificate = downloadUri
            }
        })
        await seeker.save()
        res.status(200).json({
            success: true,
            message: "Cerificate uploaded",
            id:seeker._id,
            ...seeker
        })
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}


export const addMySkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { skills } = req.body
        const skillsSplit: any = skills.split(',')
        for (let skill of skillsSplit) {
            var eachSkill: any = {
                skillName: skill
            }
            req.body.seeker.skills = req.body.seeker.skills.concat(eachSkill)
            await req.body.seeker.save()
        }
        res.status(200).json({
            success: true,
            seker: req.body.seeker.skills
        })

    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.file) {
        return res.status(404).json({
            message: "Resume  needed"
        })
    }
    const Tdate = Date.now()
    const storageref = ref(storage, `Resumes/${req.body.seeker.fullName}_${Tdate}`)
    const metadata = {
        contentType: req.file.mimetype
    }
    const snapshot = await uploadBytesResumable(storageref, req.file.buffer, metadata)
    const downloadUri = await getDownloadURL(snapshot.ref)
    const updateSeeker: any = await seekerModel.findByIdAndUpdate(req.body.seeker._id, { $set: { resumeURL: downloadUri } }, { new: true })
    res.status(200).json({
        success: true,
        id:updateSeeker._id,
        ...updateSeeker
    })
}

export const suggestJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const preferences: any = await seekerModel.findByIdAndUpdate(req.body.seeker._id, req.body, { new: true })
        res.status(200).json({
            Type1: preferences.suggestJobType1,
            Type2: preferences.suggestJobType2,
            Type3: preferences.suggestJobType3
        })


    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

///////////////////////////////Get jobs by preferences and Filters //////////////////////////////////////

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seeker: any = await seekerModel.findById(req.body.seeker._id)

        if (req.query.salary) {
            var queStr: any = req.query.salary.toString()
            var [min, max]: any = queStr.split('-')
            var [minN, maxN]: any = [Number(min), Number(max)]
        } else {
            var [minN, maxN]: any = [1.5, 50.0]
        }
        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 3
        const sort: any = req.query.sort
        const asc: any = req.query.asc || -1
        const dsc = req.query.dsc || 1
        const skip = (page - 1) * 10



        if (seeker.suggestJobType1) {
            var jobType1: any = await jobRoleModel.find({ Dept: seeker.suggestJobType1, paymentStatus: 'Completed', nightShift: req.query.nightShift || false, joiningFee: req.query.deposit || false, jobLocation: req.query.jobLocation || "Office", englishLevel: req.query.englishLevel || seeker.englishLevel, salaryLakhPerAnnum: { $gte: minN, $lte: maxN }, jobState: req.query.jobState || seeker.state, jobCountry: req.query.country || seeker.country, typeOfJob: req.query.jobType || 'Full-time' }, 'jobRole jobState englishLevel joiningFee Dept jobId jobLocation nightShift companyName salaryLakhPerAnnum').skip(skip).limit(limit)
            //nightShift: req.body.nightShift || false, jobLocation: req.body.jobLocation || 'Work from office', joiningFee: req.body.noDeposit || false, englishLevel: req.body.englishLevel || seeker.englishLevel, jobState: req.body.jobState || seeker.state, typeOfJob: req.body.jobType || 'Full-time' 
        }
        if (seeker.suggestJobType2) {
            var jobType2: any = await jobRoleModel.find({ Dept: seeker.suggestJobType2, paymentStatus: 'Completed', nightShift: req.query.nightShift || false, joiningFee: req.query.deposit || false, jobLocation: req.query.jobLocation || "Office", englishLevel: req.query.englishLevel || seeker.englishLevel, salaryLakhPerAnnum: { $gte: minN, $lte: maxN }, jobState: req.query.jobState || seeker.state, jobCountry: req.query.country || seeker.country, typeOfJob: req.query.jobType || 'Full-time' }, 'jobRole jobState englishLevel joiningFee Dept jobId jobLocation nightShift companyName salaryLakhPerAnnum').skip(skip).limit(limit)

        }
        if (seeker.suggestJobType3) {
            var jobType3: any = await jobRoleModel.find({ Dept: seeker.suggestJobType3, paymentStatus: 'Pending', nightShift: req.query.nightShift || false, joiningFee: req.query.deposit || false, jobLocation: req.query.jobLocation || "Office", englishLevel: req.query.englishLevel || seeker.englishLevel, salaryLakhPerAnnum: { $gte: minN, $lte: maxN }, jobState: req.query.jobState || seeker.state, jobCountry: req.query.country || seeker.country, typeOfJob: req.query.jobType || 'Full-time' }, 'jobRole jobState englishLevel joiningFee Dept jobId jobLocation nightShift companyName salaryLakhPerAnnum').skip(skip).limit(limit)

        }
        res.json({
            jobType1,
            jobType2,
            jobType3
        })




    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

export const filterBySalary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.salary) {
            var queStr: any = req.query.salary.toString()
            var [min, max]: any = queStr.split('-')
            var [minN, maxN]: any = [Number(min), Number(max)]
        } else {
            var [minN, maxN]: any = [1.5, 50.0]
        }
        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 2
        const sort: any = req.query.sort
        const asc: any = req.query.asc || -1
        const dsc = req.query.dsc || 1
        const skip = (page - 1) * 2


        const jobs: any = await jobRoleModel.find({ salaryLakhPerAnnum: { $gte: minN, $lte: maxN } }, 'jobRole companyName jobCity salaryLakhPerAnnum').skip(skip).limit(limit).sort({ salaryLakhPerAnnum: 1 })
        res.send(jobs)




        // res.json({
        //     min:min,
        //     max:max
        // })

    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

export const getJobByRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inUpper: any = req.query.role
        if (req.query.salary) {
            var queStr: any = req.query.salary.toString()
            var [min, max]: any = queStr.split('-')
            var [minN, maxN]: any = [Number(min), Number(max)]
        } else {
            var [minN, maxN]: any = [1.5, 50.0]
        }
        const seeker: any = await seekerModel.findById(req.body.seeker._id)
        const jobs: any = await jobRoleModel.find({ jobRole: { $regex: `${inUpper}`, $options: 'i' }, paymentStatus: 'Completed', experienceRequired: req.query.experience || "Fresher/Experienced", nightShift: req.query.nightShift || false, joiningFee: req.query.deposit || false, jobLocation: req.query.jobLocation || "Office", salaryLakhPerAnnum: { $gte: minN, $lte: maxN }, jobState: req.query.jobState || seeker.state, jobCountry: req.query.country || seeker.country, typeOfJob: req.query.jobType || 'Full-time' }, 'jobRole typeOfJob jobState englishLevel joiningFee Dept jobId jobLocation nightShift companyName salaryLakhPerAnnum')
        res.status(200).send(jobs)

        //const jobs: any = await jobRoleModel.find({ jobRole: { $regex: `${inUpper}`, $options: 'i' } }, 'jobRole Dept')
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

///////////////ApplyforJob/////////  Long Req.body
///////// As there are no particular screens, all details in one route//////////////

export const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seeker: any = await seekerModel.findById(req.body.seeker._id)
        const employer: any = await employerM.findOne({ companyName: req.body.companyName })
        const jobRole: any = await jobRoleModel.findOne({ jobId: req.body.jobId })
        var reqF: any = req.files

        var Tdate = Date.now()
        if (!req.body.changeResume) {
            var downloadUri: any = req.body.Resume || seeker.resumeURL

        } else if (req.body.changeResume) {
            const storageref = ref(storage, `Resumes/${seeker.fullName}_${Tdate}`)
            const metadata = {
                contentType: reqF.Resume[0].mimetype
            }
            const snapshot = await uploadBytesResumable(storageref, reqF.Resume[0].buffer, metadata)
            var downloadUri: any = await getDownloadURL(snapshot.ref)

        }

        if (!reqF.coverLetter) {
            var cdownloadUri: any = undefined

        } else {
            const storageref = ref(storage, `Cover letters/${seeker.fullName}_${Tdate}`)
            const metadata = {
                contentType: reqF.coverLetter[0].mimetype
            }
            const snapshot = await uploadBytesResumable(storageref, reqF.coverLetter[0].buffer, metadata)
            var cdownloadUri: any = await getDownloadURL(snapshot.ref)
        }

        const seekerApp: any = {
            jobRole: req.body.jobRole,
            employerIdStr: jobRole.empIdString,
            jobRoleIdStr: jobRole._id.toString(),
            jobId: req.body.jobId,
            companyName: req.body.companyName,
            appliedDate: new Date(),
            updatedDate: new Date(),
            companyCity: req.body.companyCity,
            companyCountry: req.body.companyCountry,
            typeOfJob: req.body.jobType,
            nightShift: req.body.nightShift,
            jobLocation: req.body.jobLocation,
            jobDescription: req.body.jobDescription,

            resumeURL: downloadUri,
            coverLetterURL: cdownloadUri,
            dept: req.body.dept || jobRole.Dept,
            industryType: req.body.industryType,
            category: req.body.category || jobRole.category,
            statusUpdate: 'Pending. Application received at desk',
            criminalCases: req.body.criminalCases,
            experienceRequired: req.body.experienceRequired,

            experienceInYears: req.body.expInYears,
            experienceInMonths: req.body.expInMonths
        }


        const employerPOV: any = {
            seekerIdStr: seeker._id.toString(),
            seekerName: req.body.fullName,
            sscPercen: req.body.ssc,
            interPercen: req.body.interPercen,
            gradCGPA: req.body.gradCGPA,
            resumeURL: downloadUri,
            coverLetterURL: cdownloadUri,
            messageForHr: req.body.messageForHr,
            seekerMobile: req.body.mobile,
            seekerEmail: req.body.email,
            criminalCases: req.body.criminalCases,
            experienceInRelavantField: req.body.experienced,
            experienceInYears: req.body.expInYears,
            experienceInMonths: req.body.expInMonths,
            skills: req.body.skills
        }
        seeker.myApps = seeker.myApps.concat(seekerApp)
        jobRole.applications = jobRole.applications.concat(employerPOV)
        seeker.resumeURL = downloadUri
        await seeker.save()
        await jobRole.save()
        res.json({
            appl: seeker.myApps,
            empovv: jobRole.applications
        })


    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}
