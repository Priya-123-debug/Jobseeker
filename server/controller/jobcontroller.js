import Job  from "../Model/jobmodel.js";
import { company } from "../Model/company.js";
import User from "../Model/usermodel.js";

export const postjob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      Salary,
      location,
      jobtype,
      experience,
      position,
      company,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !Salary ||
      !location ||
      !jobtype ||
      !experience ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      Salary: Number(Salary),
      location,
      jobtype,
			position,
      experience,
      company: company,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
export const getAlljobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const industry = req.query.industry || "";
    const minSalary = Number(req.query.minSalary) || 0;  // ← fix
    const maxSalary = Number(req.query.maxSalary) || 0;  // ← fix
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filterConditions = {
      title: { $regex: keyword, $options: "i" },
      location: { $regex: location, $options: "i" },
      industry: { $regex: industry, $options: "i" },
    };

    // ← add salary filter
    if (minSalary > 0 || maxSalary > 0) {
      filterConditions.Salary = {};
      if (minSalary > 0) filterConditions.Salary.$gte = minSalary;
      if (maxSalary > 0) filterConditions.Salary.$lte = maxSalary;
    }

    const totalJobs = await Job.countDocuments(filterConditions);
    const jobs = await Job.find(filterConditions)
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

export const getjobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("company", "name logo")
      .populate("applications");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      job,
      applicantsCount: job.applications.length,
    });
  } catch (error) {
    console.log(error);
  }
};

// admin ke liye
export const getadminjobs = async (req, res) => {
  try {
    const adminId = req.id;
  

    const jobs = await Job.find({ created_by: adminId })
      .populate("company", "name logo")
      .populate("applications")
      .sort({ createdAt: -1 });
       console.log("JOBS FOUND =", jobs.length);

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.log(err);
  }
};


// recruiter dashboard stats
export const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.id;

    // fetch user from DB to check role, since JWT payload only has userId
    const requestingUser = await User.findById(recruiterId);
    if (!requestingUser || requestingUser.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters can view this dashboard",
      });
    }

    // get all jobs posted by this recruiter, with applications populated
    const jobs = await Job.find({ created_by: recruiterId }).populate("applications");

    const totalJobs = jobs.length;

    // flatten all applications across all jobs into one array
    let allApplications = [];
    jobs.forEach((job) => {
      allApplications = allApplications.concat(job.applications);
    });

    const totalApplicants = allApplications.length;
    const accepted = allApplications.filter((app) => app.status === "accepted").length;
    const rejected = allApplications.filter((app) => app.status === "rejected").length;
    const pending = allApplications.filter((app) => app.status === "pending").length;

    const acceptanceRate =
      totalApplicants === 0 ? 0 : Math.round((accepted / totalApplicants) * 100);

    return res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalApplicants,
        accepted,
        rejected,
        pending,
        acceptanceRate,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};