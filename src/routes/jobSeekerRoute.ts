import express, { Request, Response, NextFunction } from 'express'
const router = express.Router()
import multer from 'multer'
import path from 'path'
var stp = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'photos/')
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname).replace(/\\/g, "/"))
    }
})
const  upload = multer({
storage:stp,
    limits: {
        fileSize: 2000000
    },
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //     }
    // }
});

import { registerUser, otpValidate, resendOTP, personalDetails ,getJobs,  addExperienceDetails,getFileType, matchIdString,uploadResume,suggestJobs,applyForJob, filterBySalary , uploadExperienceCertificate,addMySkills,getJobByRole} from '../controllers/jobSeekerController'
import {seekeerAuth} from '../utils/auth'
router.post('/register-seeker',registerUser )
router.post('/otp-validate/:id', otpValidate)
router.get('/resend-seeker-otp/:id', resendOTP)
router.patch('/personal-details',seekeerAuth, personalDetails)


const uploadE = multer({

    limits: {
        fileSize: 2000000
    },
    fileFilter: (req:any, file:any, cb:any) => {
        if (file.mimetype ==='application/pdf'  ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only images format allowed!'));
        }
    }
});
const multipleUploads:any=uploadE.fields([{name:'Resume'},{name:'coverLetter'} ])













router.patch('/add-experience-details', uploadE.single('certificate'), seekeerAuth, addExperienceDetails,
    (err: any, req: any, res: any, next: any) => {
        res.status(404).json({
            success: false,
            message: "Some error found",
            error: err.message
        })
    })
router.get('/get-file-type', upload.single('Eimage'), getFileType)
router.get('/match-id-string/:ids', seekeerAuth,matchIdString)
router.patch('/upload-experience-certificate/:id', uploadE.single('certificate'),seekeerAuth,  uploadExperienceCertificate,
    (err: any, req: any, res: any, next: any) => {
        res.status(404).json({
            success: false,
            message: "Some error found",
            error: err.message
        })
    })
router.patch('/add-my-skills', seekeerAuth,addMySkills)
router.patch('/upload-resume',uploadE.single('resume'), seekeerAuth,uploadResume,
    (err: any, req: any, res: any, next: any) => {
        res.status(404).json({
            success: false,
            message: "Some error found",
            error: err.message
        })
    })

    router.patch('/my-preferences',seekeerAuth,suggestJobs )
    router.get('/get-jobs', seekeerAuth, getJobs)
    router.get('/filter-by-salary', seekeerAuth,filterBySalary)
    router.get('/get-job-by-role', seekeerAuth, getJobByRole)

router.post('/apply-job', multipleUploads, seekeerAuth,applyForJob)

export default router