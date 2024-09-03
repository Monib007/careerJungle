
const Job = require('../models/job-model')

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

module.exports = {postJob};