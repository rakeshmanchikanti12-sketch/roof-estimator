const Config = require("../models/Config");

const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne()
      .sort({ config_version: -1 })
      .lean();

    if (!config) {
      return res.status(404).json({
        error: "Configuration not found"
      });
    }

    const activeQuestions = config.questions
      .filter((question) => question.active)
      .map((question) => ({
        key: question.key,
        label: question.label,
        type: question.type,
        unit: question.unit,
        required: question.required,
        min: question.min,
        max: question.max,
        active: question.active,
        options: question.options
      }));

    res.json({
      config_version: config.config_version,
      business: config.business,
      questions: activeQuestions,
      modifiers: config.modifiers
    });
  } catch (error) {
    console.error(
      "Get config error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to load configuration"
    });
  }
};


const updateConfig = async (req, res) => {
  try {
    const {
      business,
      questions,
      modifiers
    } = req.body;

    if (!business) {
      return res.status(400).json({
        error: "Business information is required"
      });
    }

    if (!questions) {
      return res.status(400).json({
        error: "Questions are required"
      });
    }

    if (!modifiers) {
      return res.status(400).json({
        error: "Modifiers are required"
      });
    }

    const currentConfig = await Config.findOne()
      .sort({ config_version: -1 });

    if (!currentConfig) {
      return res.status(404).json({
        error: "Configuration not found"
      });
    }

    currentConfig.business = business;
    currentConfig.questions = questions;
    currentConfig.modifiers = modifiers;

    await currentConfig.save();

    res.json({
      config_version: currentConfig.config_version,
      business: currentConfig.business,
      questions: currentConfig.questions,
      modifiers: currentConfig.modifiers
    });
  } catch (error) {
    console.error(
      "Update config error:",
      error.message
    );

    res.status(500).json({
      error: "Failed to update configuration"
    });
  }
};


module.exports = {
  getConfig,
  updateConfig
};