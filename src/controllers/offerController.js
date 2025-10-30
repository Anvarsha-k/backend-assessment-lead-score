import * as offerService from "../services/offerService.js";

export const createOffer = async (req, res) => {
  try {
    const offer = await offerService.saveOffer(req.body);
    res.status(201).json({ message: "Offer saved successfully", offer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
