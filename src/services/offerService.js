import Offer from "../models/offerModel.js";

export const saveOffer = async (data) => {
  await Offer.deleteMany();
  return await Offer.create(data);
};

export const getLatestOffer = async () => {
  return await Offer.findOne().sort({ createdAt: -1 });
};
