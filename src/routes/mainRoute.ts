import express from 'express'
const mainRoute=express.Router()
import employerRoute from '../routes/employerRoute'
import seekerRoute from '../routes/jobSeekerRoute'
mainRoute.use('/employer', employerRoute)
mainRoute.use('/jobSeeker', seekerRoute )

export default mainRoute