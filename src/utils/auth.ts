import express, { Request, Response, NextFunction } from 'express'
import employerM from "../models/employerModel"
import jobRoleModel from '../models/employerJobRolesModel'
import jwt from 'jsonwebtoken'
import seekerModel from '../models/jobSeekerModel'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token}: any = req.headers
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "No token"
            })
        }
        const isMatch: any = await jwt.verify(token, process.env.jwt_key)
        if (!isMatch.id) {
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            })
        }
        const employer = await employerM.findOne({ _id: isMatch.id })
        req.body.employer = employer

        next()
    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}

export const authForJobRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {token}:any = req.headers
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "where it went wrong?"
            })
        }
        const isRoleMatch:any = await jwt.verify(token, process.env.role_token_key)
        if (!isRoleMatch.jid) {
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            })
        }
        
        
const jobRole:any=await jobRoleModel.findOne({jobId:isRoleMatch.jid})
const employer=await employerM.findById(isRoleMatch.id)
req.body.role=jobRole
req.body.employer=employer
next()

    } catch (Err: any) {
        res.status(404).json({
            success: false,
            message: Err.message
        })
    }
}


export const seekeerAuth=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {token}: any = req.headers
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "No seeker token"
            })
        }
        const isSeekerMatch: any = await jwt.verify(token, process.env.seeker_jwt_token)
        if (!isSeekerMatch.id) {
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            })
        }


        const thatSeeker: any = await seekerModel.findById(isSeekerMatch.id)
        //const employer = await employerM.findById(isRoleMatch.id)
        req.body.seeker = thatSeeker
       // req.body.employer = employer
        next()



    }catch(Err:any){
res.status(404).json({
    success:false,
    message:Err.message
})
    }
}