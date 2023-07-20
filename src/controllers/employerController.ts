import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'
import employerM from '../models/employerModel'
import { generateOTP } from '../utils/OTPsend'
import { auth, authForJobRole } from '../utils/auth'
import jobRoleModel from '../models/employerJobRolesModel'
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
})
const crypto = require('crypto')

export const registerEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const spl: any = req.body.cliens.split(',')


        const { cliens, ...others } = req.body

        const employer: any = await employerM.create({
            ...others
        })

        for (let n of spl) {
            var cn: any = {
                clientName: n
            }
            employer.clientNames = employer.clientNames.concat(cn)
            await employer.save()
        }


        res.status(201).json({
            success: true,
            employer


        })


    } catch (Err: any) {
        res.status(404).json({
            message: Err.message
        })
    }
}


export const generateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mobile } = req.body



        const employer: any = await employerM.findOne({ mobile })
        if (!employer) {
            const opt: any = generateOTP()

            const exdate: any = new Date()
            exdate.setSeconds(exdate.getSeconds() + 45)

            const newEmployer = await employerM.create({
                mobile,
                otp: opt,
                otpExpiration: exdate

            })

            res.status(200).json({
                success: true,
            id:newEmployer._id,
            otp:newEmployer.otp,
            expiration:newEmployer.otpExpiration,
            mobile:newEmployer.mobile
            })
        } else {
            const opt: any = generateOTP()

            const exdate: any = new Date()
            exdate.setSeconds(exdate.getSeconds() + 45)
            employer.otp = opt
            employer.otpExpiration = exdate
            await employer.save()
            res.status(201).json({
                success: true,
                name:employer.fullName,
                id:employer._id,
                companyName:employer.companyName,
                mobile: employer.mobile,
                otp:employer.otp,
                otpExp:employer.otpExpiration

            })

        }
    } catch (Err: any) {
        res.status(404).json({
            message: Err.message
        })
    }

}

export const getEmployerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const exmployer: any = await employerM.findOne({ _id: id })
        if (!exmployer) {
            return res.status(404).json({
                success: false,
                message: "No such employer found"
            })
        }

        res.status(200).json({
            success: true,
            exmployer
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
        const employer = await employerM.findById(req.params.id)
        const otp = generateOTP()
        const exdare = new Date()
        exdare.setSeconds(exdare.getSeconds() + 45)
        employer.otp = otp
        employer.otpExpiration = exdare
        await employer.save()
        res.status(200).json({
            mobile: employer.mobile,
            id:employer._id,
            otp: employer.otp,
            otpExp:employer.otpExpiration
        })
    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}


export const otpValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employer: any = await employerM.findOne({ _id: req.params.id })
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: "Your details went missing"
            })
        }
        const presentDae = new Date()
        if (req.body.otp !== employer.otp) {
            return res.status(404).json({
                success: false,
                message: " Wrong otp"
            })
        }
        if (presentDae > employer.otpExpiration) {
            return res.status(404).json({
                success: false,
                message: "OTP expired"
            })
        }
        const token: any = await jwt.sign({ id: employer._id }, process.env.jwt_key, { expiresIn: '1d' })
        res.status(200).json({
            success: true,
            mobile: employer.mobile,
            id:employer._id,
            token
        })

    } catch (Err: any) {

        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}

export const typeOfEmployer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { FirstName, LastName, type } = req.body
        const id = req.body.employer._id
        const employername = await employerM.findByIdAndUpdate(id, { $set: { fullName: `${FirstName} ${LastName}`, typeOfEmployer: type } }, { new: true })
        res.status(200).json({
            success: true,
            name:employername.fullName,
            companyName:employername.companyName,
            id:employername._id
        })


    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })


    }

}


export const companyDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.body.employer._id
        if (req.body.myOwnCompany === true) {

            const updEmpl = await employerM.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json({
                success: true,
               id: updEmpl._id,
               companyName:updEmpl.companyName
            })
        } else if (req.body.consultancy === true) {

            const { clients, ...others } = req.body

            const updateEmp = await employerM.findByIdAndUpdate(id, { $set: { ...others } }, { new: true })
            const spl: any = clients.split(',')

            for (let n of spl) {
                var cn: any = {
                    clientName: n
                }

                updateEmp.clientNames = updateEmp.clientNames.concat(cn)
                await updateEmp.save()

            }
            res.status(200).json({
                success: true,
                id:updateEmp._id,
                consultancyName:updateEmp.consultancyName
            })

        }

    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })

    }
}

export const jobRoleDetails = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const employer = await employerM.findById(req.body.employer._id)
        const empstr: any = employer._id.toString()
        const newJobRole = await jobRoleModel.create({
            employerId: employer._id,

            empIdString: empstr,
            employerName: employer.fullName,
            companyName: employer.companyName,
            consultancyName: employer.consultancyName,
            jobRole: req.body.jobRole.toUpperCase(),
            ...req.body
        })
        const token: any = await jwt.sign({ id: req.body.employer._id, jid: req.body.jobId }, process.env.role_token_key, { expiresIn: "1d" })


        res.status(201).json({
            success: true,
            id:newJobRole._id,
            role:newJobRole.jobRole,
            employerCompany:newJobRole.companyName,
            token
        })
    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}

export const candidateRequirements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobRole = await jobRoleModel.findOne({ jobId: req.body.role.jobId })
        const { skills, ...others } = req.body
        const firstUpdate = await jobRoleModel.findByIdAndUpdate(jobRole._id, { $set: { ...others } }, { new: true })
        const skillsSplit: any = skills.split(',')
        for (let skill of skillsSplit) {
            var ss: any = {
                skillName: skill
            }
            firstUpdate.skills = firstUpdate.skills.concat(ss)
            await firstUpdate.save()
        }

        res.status(200).json({
            success: true,
            id:firstUpdate._id,
            ...firstUpdate
        })


    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
}

export const interviewDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobRole = await jobRoleModel.findOne({ jobId: req.body.role.jobId })
        const employer = await employerM.findById(req.body.employer._id)

        if (req.body.sameAsCompanyAddress === true) {
            const updInterviewAddress = await jobRoleModel.findByIdAndUpdate(jobRole._id, req.body, { new: true })
            const updateCoins = await employerM.findByIdAndUpdate(employer._id, { $set: { coinsPresent: 300 } }, { new: true })
            res.status(200).json({
                success: true,
               id: updInterviewAddress._id,
               ...updInterviewAddress,
                coinsPresent: updateCoins.coinsPresent
            })


        }

    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}

export const getPresentJobAddress = async (req: Request, res: Response, NextFunction) => {
    try {
        const jobRoleAddress = await jobRoleModel.findOne({ jobId: req.body.role.jobId })

        res.status(200).json({
            interviewCity: jobRoleAddress.jobCity,
            interviewArea: jobRoleAddress.jobState,
            interviewFullAddress: jobRoleAddress.googleLocation
        })
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }

}


export const subscriptionPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobRole = await jobRoleModel.findOne({ jobId: req.body.role.jobId })
        // let options = {
        //     amount: Number(10* 100),
        //     currency: 'INR'
        // }
        // const order = await instance.orders.create(options)


        const planPurcahsed = await jobRoleModel.findByIdAndUpdate(jobRole._id, req.body, { new: true })
        res.status(200).json({
            planPurchased: planPurcahsed.presentPlanType,
            targetPeople: planPurcahsed.targetPeople,
            paymentStatus: planPurcahsed.paymentStatus,
            coinsPerSeeker: planPurcahsed.coinsPerUser,
            transactionId: planPurcahsed.transactionId
        })

    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
} 
