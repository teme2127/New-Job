// lib/seed.js
import dbConnect from "./mongodb";
import Job from "@/models/Job";

const initialJobs = [
  {
    title: "Senior Finance Officer",
    company: "NRC (Norwegian Refugee Council)",
    logo: "🏢",
    logoBg: "bg-orange-100 text-orange-700",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    category: "NGO",
    experience: "5+ Years",
    salary: "Negotiable / Attractive",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    careerLevel: "Senior Level",
    tags: ["Finance", "Accounting", "NGO", "IPSAS"],
    description: "The Norwegian Refugee Council is seeking a qualified Senior Finance Officer to oversee financial reporting, budgeting compliance, and compliance audits for our Dollo Ado and Shire regional hubs.",
    responsibilities: [
      "Manage day-to-day accounts and prepare monthly IPSAS financial reports.",
      "Track program budget allocations and review expenditure compliance.",
      "Support external audit preparations and execute tax declarations.",
      "Supervise assistant field accountants across Shire and Gambella hubs."
    ],
    requirements: [
      "Bachelor's degree in Accounting, Finance, or a related Business field.",
      "Minimum 5 years of finance experience in an international humanitarian NGO.",
      "Strong knowledge of IPSAS, donor guidelines, and Ethiopian tax regulations.",
      "Excellent communication skills in English and Amharic."
    ],
    benefits: [
      "Competitive NGO salary scale.",
      "Comprehensive medical insurance for employee and dependents.",
      "Subsidized transport allowance.",
      "Professional certification support (ACCA/CPA)."
    ],
    companyWebsite: "https://www.nrc.no",
    companyEmail: "nrc.ethiopia@et.nrc.no"
  },
  {
    title: "Public Health Consultant",
    company: "Hallelujah Consulting & Training Services",
    logo: "🩺",
    logoBg: "bg-blue-100 text-blue-700",
    location: "Hawassa, Ethiopia",
    type: "Contract",
    category: "Healthcare",
    experience: "3+ Years",
    salary: "40,000 ETB - 55,000 ETB",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    careerLevel: "Consultant",
    tags: ["Public Health", "Training", "Consulting", "Research"],
    description: "Provide advisory services, technical evaluations, and field support for public health training modules. Review healthcare program indicators and coordinate workshops with regional healthcare bureaus.",
    responsibilities: [
      "Conduct training workshops for community health workers on primary care.",
      "Design evaluation framework tools for regional clinical projects.",
      "Prepare technical data reports for UN agency stakeholders.",
      "Provide advisory services to Hawassa and Adama clinic networks."
    ],
    requirements: [
      "Master's degree in Public Health (MPH), Epidemiology, or Medicine.",
      "At least 3 years of clinical advisory or community health evaluation experience.",
      "Proven workshop moderation capabilities.",
      "Willingness to travel to southern region community clinics."
    ],
    benefits: [
      "Highly competitive daily consultancy rates.",
      "Travel and accommodation coverage during field tasks.",
      "Opportunity to network with national and international health organizations."
    ],
    companyWebsite: "https://hallelujahconsultancy.com",
    companyEmail: "hallelujahconsultancy@gmail.com"
  },
  {
    title: "Regional Liaison Officer",
    company: "Plan International Ethiopia",
    logo: "🌍",
    logoBg: "bg-emerald-100 text-emerald-700",
    location: "Bahir Dar, Ethiopia",
    type: "Full-time",
    category: "NGO",
    experience: "4+ Years",
    salary: "Attractive",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    careerLevel: "Mid Level",
    tags: ["Liaison", "Program Coordinator", "Bahir Dar", "Child Rights"],
    description: "Manage regional relations, child rights advocacy projects, and liaise with local government administrations and community elders to execute community resilience programming.",
    responsibilities: [
      "Maintain active relations with regional state bureaus and community stakeholders.",
      "Monitor the implementation of local child-centered community development plans.",
      "Prepare monthly progress tracking reports for national coordinators.",
      "Represent Plan International in regional coordination forums."
    ],
    requirements: [
      "Degree in Sociology, Development Studies, or Social Work.",
      "4+ years experience coordinating community development or child rights initiatives.",
      "Strong coordination, negotiation, and report writing capabilities.",
      "Knowledge of the Amhara regional cultural context is highly preferred."
    ],
    benefits: [
      "Comprehensive insurance package.",
      "Provident fund contributions.",
      "Annual training and professional development sponsorships."
    ],
    companyWebsite: "https://plan-international.org",
    companyEmail: "Merhawit.Tsegaye@plan-international.org"
  },
  {
    title: "Senior Agronomist",
    company: "BDA Agricultural Development PLC",
    logo: "🌾",
    logoBg: "bg-yellow-100 text-yellow-800",
    location: "Arba Minch, Ethiopia",
    type: "Full-time",
    category: "Agriculture",
    experience: "6+ Years",
    salary: "Negotiable",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    careerLevel: "Senior Level",
    tags: ["Agronomy", "Farming", "Horticulture", "Field Manager"],
    description: "Supervise coffee, fruit, and spice plantation agronomical practices. Drive modern crop cultivation, irrigation setups, and yield optimizations.",
    responsibilities: [
      "Direct agronomical activities across 150+ hectares of plantation lands.",
      "Develop soil fertilization schedules and pest control guidelines.",
      "Train local farming staff on quality control and harvesting techniques.",
      "Oversee sorting operations for export-ready crop variants."
    ],
    requirements: [
      "M.Sc or B.Sc in Agronomy, Horticulture, or Crop Science.",
      "6+ years experience managing large-scale farming or cash crop plantations.",
      "Deep understanding of irrigation setups and plant pathology.",
      "Excellent local leadership and coaching abilities."
    ],
    benefits: [
      "On-site housing and meals provided.",
      "Corporate vehicle and fuel allowance.",
      "Annual crop yield performance bonuses."
    ],
    companyWebsite: "https://flemingo-et.com",
    companyEmail: "yonas.shiferaw@flemingo-et.com"
  },
  {
    title: "International Trade Specialist",
    company: "Kerchanshe Trading Company",
    logo: "☕",
    logoBg: "bg-amber-100 text-amber-800",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    category: "Trading & Distribution",
    experience: "3+ Years",
    salary: "Attractive",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    careerLevel: "Mid Level",
    tags: ["Coffee Export", "Trade", "Logistics", "Customs"],
    description: "Manage global coffee export logistics, customs documentations, international buyer communications, and banking letter of credit (L/C) submissions.",
    responsibilities: [
      "Process export logistics documentations with Ethiopian customs and shipping lines.",
      "Manage letter of credit (L/C) and cash against documents (CAD) terms with banks.",
      "Communicate daily with European, Asian, and American coffee importers.",
      "Resolve warehouse and shipping line transport schedules."
    ],
    requirements: [
      "Degree in Logistics, International Trade, or Business Administration.",
      "3+ years experience managing exports (preferably coffee or agricultural goods).",
      "Familiarity with national bank declarations and single window custom platforms.",
      "Highly organized and detail-oriented negotiator."
    ],
    benefits: [
      "Canteen access at Addis Ababa headquarters.",
      "Daily staff shuttle bus services.",
      "Performance incentives based on export volumes."
    ],
    companyWebsite: "https://www.kerchanshe.com",
    companyEmail: "hr@kerchanshe.com"
  }
];

export async function seedJobs() {
  await dbConnect();
  // We can delete existing jobs and re-seed to update them to Ethiopian contexts
  const count = await Job.countDocuments();
  if (count <= 5) {
    console.log("Seeding realistic Ethiopian vacancies...");
    await Job.deleteMany({});
    await Job.insertMany(initialJobs);
    console.log("Seeding complete.");
  }
}
