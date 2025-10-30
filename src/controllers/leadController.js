import * as leadService from "../services/leadService.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

export const uploadLeads = async (req, res) => {
  try {
    const leads = await leadService.uploadLeads(req.file.path);
    res.status(200).json({ message: "Leads uploaded", count: leads.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

