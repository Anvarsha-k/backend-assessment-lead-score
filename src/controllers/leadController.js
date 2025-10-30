import * as leadService from "../services/leadService.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

// Controller for handling leads data
export const uploadLeads = async (req, res) => {
  try {
    const leads = await leadService.uploadLeads(req.file.path);
    res.status(200).json({ message: "Leads uploaded", count: leads.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for handling Score for the leads
export const scoreLeads = async (req, res) => {
  try {
    const results = await leadService.scoreLeads();
    res.status(200).json({ message: "Scoring completed", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Show the Result 
export const getResults = async (req, res) => {
  try {
    const data = await leadService.getResults();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export the result to CSV
export const exportResultsToCSV = async (req, res) => {
  try {
    await leadService.exportResultsToCSV(res);
  } catch (err) {
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
};

