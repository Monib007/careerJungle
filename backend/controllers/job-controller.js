
const Job = require('../models/job-model')

// ADMIN 
const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location|| !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: 'Something is missing!!',
                success: false,
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements : requirements.split(","),
            location,
            salary: Number(salary),
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
        })
        return res.status(201).json({
            message: 'New job created successfully!!',
            job,
            success: true,
        })
    } catch(err) {
        console.log(err)
    }
}

//Students
const getAllJobs = async(req, res) => {
    try {
        //filtering using keywords
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                {title: {$regex:keyword, $options: "i"}},
                {description: {$regex:keyword, $options: "i"}},
            ]
        }
        const jobs = await Job.find(query);

        if(!jobs) {
            return res.status(404).json({
                message: 'Jobs not found',
                success: false,
            })
        }

        return res.status(404).json({
            jobs,
            success: false,
        })

    } catch(err) {
        console.log(err)
    }
}

// Students
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
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

// ADMIN 
const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId});
        if(!jobs) {
            return res.status(404).json({
                message: 'Jobs not found.',
                success: false,
            })
        }
        return res.status(200).json({
            jobs,
            success: true,
        })
    } catch(err) {
        console.log(err);
    }
}


module.exports = {postJob, getAllJobs, getJobById, getAdminJobs};