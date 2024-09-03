const Company = require("../models/company-model");

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You cannot register same company.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.id; //logged in userid
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    //cloudinary .....

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company details updated.",
      company,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };
