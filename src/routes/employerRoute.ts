import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()

import { registerEmployer, generateOtp, getEmployerById, typeOfEmployer, companyDetails, jobRoleDetails, otpValidate, resendOTP, candidateRequirements, interviewDetails, subscriptionPlan, getPresentJobAddress } from '../controllers/employerController'

import { auth , authForJobRole} from '../utils/auth'

router.post('/register-employer',registerEmployer)
router.post('/generate-otp', generateOtp)
// router.get('/otp-validate/:id', getEmployerById)
router.post('/otp-validate/:id',otpValidate )
router.get('/resend-otp/:id', resendOTP)
router.patch('/type-of-employer', auth,typeOfEmployer)
router.patch('/company-details', auth,companyDetails)
router.post('/job-role-details', auth, jobRoleDetails)
router.patch('/candidate-requirements',authForJobRole, candidateRequirements )
router.patch('/update-interview-details', authForJobRole, interviewDetails)
router.get('/get-present-address', authForJobRole, getPresentJobAddress)
router.patch('/subscription-plan', authForJobRole, subscriptionPlan)
export default router
