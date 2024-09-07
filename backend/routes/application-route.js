

const express = require('express')

const isAuthenticated = require('../middlewares/isAuthenticated');
const { applyJob, getAppliedJobs, getApplicants, updateStatus } = require('../controllers/application-controller');

const router = express.Router();


router.route('/apply/:id').get(isAuthenticated, applyJob)
router.route('/get').get(isAuthenticated, getAppliedJobs)
router.route('/:id/applicants').get(isAuthenticated, getApplicants)
router.route('/status/:id/update').post(isAuthenticated, updateStatus)

module.exports = router;