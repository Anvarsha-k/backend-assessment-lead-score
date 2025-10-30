import Lead from "../models/leadModel.js";
import dotenv from "dotenv";
import { parseCSV } from "../utils/csvParserUtils.js";
import { getLatestOffer } from "./offerService.js";
import OpenAI from "openai";
import fs from "fs";
import { format } from "@fast-csv/format";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log(process.env.OPENAI_API_KEY)

// --- RULE LAYER (Max 50 pts)
const calculateRuleScore = (lead, offer) => {
  let score = 0;

  // Role relevance
  const decisionRoles = ["founder", "ceo", "head", "director", "manager"];
  if (decisionRoles.some(r => lead.role?.toLowerCase().includes(r))) score += 20;
  else if (lead.role?.toLowerCase().includes("executive")) score += 10;

  // Industry match
  const offerICPs = offer.ideal_use_cases.map(i => i.toLowerCase());
  if (offerICPs.includes(lead.industry?.toLowerCase())) score += 20;
  else if (offerICPs.some(i => lead.industry?.toLowerCase().includes(i.split(" ")[0]))) score += 10;

  // Data completeness
  if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) score += 10;

  return score;
};


// This layer help to get the score using open AI

const getAIScore = async (lead, offer) => {
  if (!process.env.OPENAI_API_KEY) {
    // Mock AI scoring
    const intents = ["High", "Medium", "Low"];
    const intent = intents[Math.floor(Math.random() * 3)];
    const aiPoints = intent === "High" ? 50 : intent === "Medium" ? 30 : 10;
    const reasoning = `Mock AI reasoning for ${lead.name} with intent ${intent}`;
    return { intent, aiPoints, reasoning };
  }

  try {
    const prompt = `
You are an AI sales assistant. Based on the product offer and prospect details, 
classify the buying intent as High, Medium, or Low and explain why in 1–2 sentences.

Offer:
${JSON.stringify(offer, null, 2)}

Lead:
${JSON.stringify(lead, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const aiText = response.choices[0].message.content;
    let intent = "Low";
    let aiPoints = 10;

    if (/high/i.test(aiText)) { intent = "High"; aiPoints = 50; }
    else if (/medium/i.test(aiText)) { intent = "Medium"; aiPoints = 30; }

    return { intent, aiPoints, reasoning: aiText };
  } catch (err) {
    console.error("OpenAI API error:", err.message);

    // fallback to mock

    const intents = ["High", "Medium", "Low"];
    const intent = intents[Math.floor(Math.random() * 3)];
    const aiPoints = intent === "High" ? 50 : intent === "Medium" ? 30 : 10;
    const reasoning = `Fallback AI reasoning for ${lead.name} with intent ${intent}`;
    return { intent, aiPoints, reasoning };
  }
};






//Main Logic

// Business Logic of Upload Leads

export const uploadLeads = async (filePath) => {
  const leads = await parseCSV(filePath);
  return await Lead.insertMany(leads);
};

// For Identifyin the Score of the leads with data of each leads

export const scoreLeads = async () => {
  const offer = await getLatestOffer();
  if (!offer) throw new Error("No offer found. Please create an offer first.");

  const leads = await Lead.find();
  const results = [];

  for (const lead of leads) {

    const ruleScore = calculateRuleScore(lead, offer);
    const { intent, aiPoints, reasoning } = await getAIScore(lead, offer);
    const finalScore = ruleScore + aiPoints;

    lead.score = finalScore;
    lead.intent = intent;
    lead.reasoning = reasoning;
    await lead.save();

    results.push({
      name: lead.name,
      role: lead.role,
      company: lead.company,
      industry: lead.industry,
      location: lead.location,
      intent,
      score: finalScore,
      reasoning
    });
  }

  return results;
};

//Bussiness logic for showing the calculated results
export const getResults = async () => {
  return await Lead.find().sort({ score: -1 });
};

// Export leads results to CSV
export const exportResultsToCSV = async (res) => {
  const leads = await Lead.find().sort({ score: -1 });

  // Stream CSV to response
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=results.csv");

  const csvStream = format({ headers: true });
  csvStream.pipe(res);

  leads.forEach((lead) => {
    csvStream.write({
      name: lead.name,
      role: lead.role,
      company: lead.company,
      industry: lead.industry,
      location: lead.location,
      intent: lead.intent,
      score: lead.score,
      reasoning: lead.reasoning,
    });
  });

  csvStream.end();
};