const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="Admin Panel"'
    );

    return res.status(401).json({
      error: "Admin authentication required"
    });
  }

  const encodedCredentials =
    authHeader.split(" ")[1];

  const decodedCredentials =
    Buffer.from(
      encodedCredentials,
      "base64"
    ).toString("utf8");

  const [username, password] =
    decodedCredentials.split(":");

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="Admin Panel"'
    );

    return res.status(401).json({
      error: "Invalid admin credentials"
    });
  }

  next();
}


/* GET ALL LEADS */

router.get(
  "/leads",
  adminAuth,
  async (req, res) => {
    try {
      const leads = await Lead.find()
        .sort({ createdAt: -1 })
        .lean();

      res.json(leads);
    } catch (error) {
      console.error(
        "Failed to fetch leads:",
        error.message
      );

      res.status(500).json({
        error: "Failed to fetch leads"
      });
    }
  }
);


/* DELETE ONE LEAD */

router.delete(
  "/leads/:id",
  adminAuth,
  async (req, res) => {
    try {
      const lead = await Lead.findByIdAndDelete(
        req.params.id
      );

      if (!lead) {
        return res.status(404).json({
          error: "Lead not found"
        });
      }

      res.json({
        message: "Lead deleted successfully",
        lead_id: lead._id
      });
    } catch (error) {
      console.error(
        "Failed to delete lead:",
        error.message
      );

      res.status(500).json({
        error: "Failed to delete lead"
      });
    }
  }
);


module.exports = router;