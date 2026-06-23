import Application from "../Model/Application.js";
import Job from "../Model/jobmodel.js";

import { sendStatusEmail } from "../utlis/sendEmail.js";

export const applyjob = async (req, res) => {
  try {
    const userID = req.id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userID,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "you have already applied for this job",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userID,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "job applied successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userID = req.id;

    const applications = await Application.find({ applicant: userID })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatestatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // populate applicant email/name and job title + company name
    const application = await Application.findById(applicationId)
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        select: "title",
        populate: {
          path: "company",
          select: "name"
        }
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // update status
    application.status = status.toLowerCase();
    await application.save();

    // send email to student
    try {
      await sendStatusEmail(
        application.applicant.email,
        application.applicant.fullname,
        application.job.title,
        application.job.company.name,
        application.status
      );
    } catch (emailErr) {
      // email failed but status was already saved — don't fail the whole request
      console.log("Email sending failed:", emailErr.message);
    }

    return res.status(200).json({
      message: "status updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

