const Config = require("../models/Config");
const Lead = require("../models/Lead");
const { calculateEstimate } = require("../services/calculator");

async function createEstimate(req, res) {
  try {
    const {
      name,
      phone,
      email,
      answers
    } = req.body;

    if (!name || !phone || !email || !answers) {
      return res.status(400).json({
        error: "Name, phone, email and answers are required"
      });
    }

    const config = await Config.findOne()
      .sort({ config_version: -1 });

    if (!config) {
      return res.status(404).json({
        error: "Configuration not found"
      });
    }

    const roofArea = Number(answers.roof_area);

    if (
      Number.isNaN(roofArea) ||
      roofArea < 300 ||
      roofArea > 12000
    ) {
      return res.status(400).json({
        error: "Roof area must be between 300 and 12000 sq ft"
      });
    }

    const estimate = calculateEstimate(
      config,
      answers
    );

    const lead = await Lead.create({
      config_version: config.config_version,
      name,
      phone,
      email,
      answers,
      estimate_low: estimate.estimate_low,
      estimate_high: estimate.estimate_high
    });

    res.status(201).json({
      lead_id: lead._id,
      config_version: config.config_version,
      estimate_low: estimate.estimate_low,
      estimate_high: estimate.estimate_high
    });
  } catch (error) {
    console.error(
      "Estimate error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to calculate estimate"
    });
  }
}

module.exports = {
  createEstimate
};