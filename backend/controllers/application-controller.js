
const Application = require('../models/application-model')
const Job = require('../models/job-model')

const applyJob = async (req, res) => {
    try {
        const userId = req.Id;
        const jobId = req.params.id;

        if(!jobId) {
            return res.status(400).json({
                message: 'Job Id is required.',
                success: false,
            })
        }

        //check if user has already applied for the job
        const existingApplication = await Application.findOne({job: jobId, applicant: userId});

        if(existingApplication) {
            return res.status(400).json({
                message: 'You have already applied for this job',
                success: false,
            })
        }

        //check if the job exists
        const existingJob = await Job.findById(jobId);
        if(!existingJob){
            return res.status(404).json({
                message: 'Job not found.',
                success: false,
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        })

        Job.applications.push(newApplication._id);
        await Job.save;
        return res.status(201).json({
            message: 'Job applied successfully.',
            success: true,
        })
    } catch (err) {
        console.log(err);
    }
}

const getAppliedJobs = async (req, res) => {
    try {
            const userId = req.Id;
            const application = await Application.find({applicant: userId}).sort({createdAt: -1}).populate({
                path: 'Job',
                options: {
                    sort:{
                        createdAt: -1,
                    }
                },
                populate:{
                    path: 'company',
                    options: {
                        sort:{
                            createdAt: -1,
                        }
                    }
                }, 
            })
            if(!application){
                return res.status(404).json({
                    message: 'No Applications',
                    success: false,
                })
            }
            return res.status(200).json({
                application,
                success: true,
            })

    } catch (err) {
        console.log(err);
    } 
}


//for Admin to see no of applicants
const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: {
                sort: {
                    createdAt: -1,
                },
            },
            populate: {
                path: 'applicant',
            },
        })

        if(!job){
            return res.status(404).json({
                message: 'Job not found',
                success: false,
            })
        }

        return res.status(200).json({
            job,
            success: true,
        })
    } catch(err) {
        console.log(err);
    }
}

const updateStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false,
            })
        }

        //find Application by applicant id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message: 'Application not found',
                success: false,
            })
        }

        // update status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: 'Status updated successfully.',
            success: true,
        })

    } catch(err) {
        console.log(err);
    }
}

module.exports = {applyJob, getAppliedJobs, getApplicants, updateStatus};