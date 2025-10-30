import { calculateRuleScore } from "../src/services/leadService.js";

describe("Rule Layer Scoring Tests", () => {
  const offer = {
    ideal_use_cases: ["B2B SaaS mid-market", "E-commerce"]
  };

  it("should give +20 for decision maker roles like 'Head' or 'Director'", () => {
    const lead = {
      name: "Ava Patel",
      role: "Head of Marketing",
      company: "FlowMetrics",
      industry: "B2B SaaS mid-market",
      location: "India",
      linkedin_bio: "Marketing leader with 10 years experience"
    };

    const score = calculateRuleScore(lead, offer);
    expect(score).toBeGreaterThanOrEqual(40); // 20 for role + 20 for industry
  });

  it("should give +10 for influencer roles like 'Executive'", () => {
    const lead = {
      name: "John Doe",
      role: "Sales Executive",
      company: "TechCorp",
      industry: "E-commerce",
      location: "USA",
      linkedin_bio: "Experienced Sales Executive"
    };

    const score = calculateRuleScore(lead, offer);
    expect(score).toBeGreaterThanOrEqual(20); // 10 for role + 10 for industry
  });

  it("should give +10 for data completeness if all fields are filled", () => {
    const lead = {
      name: "Jane Smith",
      role: "CEO",
      company: "DataFlow",
      industry: "B2B SaaS mid-market",
      location: "UK",
      linkedin_bio: "Founder and CEO at DataFlow"
    };

    const score = calculateRuleScore(lead, offer);
    expect(score).toBeGreaterThanOrEqual(50); // role,industry,data completeness
  });

  it("should give lower score if fields are missing", () => {
    const lead = {
      role: "Intern",
      industry: "Unknown"
    };

    const score = calculateRuleScore(lead, offer);
    expect(score).toBeLessThan(20);
  });

  it("should return a number between 0 and 50", () => {
    const lead = {
      name: "Random",
      role: "Executive",
      company: "TestCorp",
      industry: "Manufacturing",
      location: "India",
      linkedin_bio: "Bio"
    };

    const score = calculateRuleScore(lead, offer);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(50);
  });
});