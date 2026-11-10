/*
 * Botha Digital — project list.
 *
 * To add a project, copy one block and edit it.
 *   title       – name shown on the card
 *   description – one or two short sentences
 *   category    – "demo" (client demo sites, shown first) or "tool" (business software)
 *   demo        – live site URL (leave "" if there is none)
 *   github      – GitHub repository URL
 *   image       – screenshot URL (placeholder for now; swap in a real screenshot later)
 *   tags        – short labels shown under the description
 */
const GITHUB = "https://github.com/christiaanpbotha";

// Generates a simple grey placeholder image with the project name.
const placeholder = (text) =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">` +
      `<rect width="100%" height="100%" fill="#eef1f5"/>` +
      `<g fill="none" stroke="#c5ceda" stroke-width="2"><rect x="360" y="170" width="80" height="60" rx="6"/>` +
      `<circle cx="382" cy="190" r="7"/><path d="M360 220 l25 -22 l18 14 l12 -9 l25 17"/></g>` +
      `<text x="400" y="280" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#1f3a5f">${text}</text>` +
    `</svg>`
  );

const PROJECTS = [
  {
    title: "Divine Beauty",
    description: "Online booking site for a beauty salon, with service menu, pricing and appointment scheduling.",
    category: "demo",
    demo: "https://divine-beauty-booking.vercel.app",
    github: `${GITHUB}/divine-beauty-booking`,
    image: placeholder("Divine Beauty"),
    tags: ["Booking", "Beauty", "TypeScript"],
  },
  {
    title: "Lavee Spa",
    description: "Elegant spa website where clients browse treatments and reserve a time slot online.",
    category: "demo",
    demo: "https://lavee-spa-booking-rho.vercel.app",
    github: `${GITHUB}/lavee-spa-booking`,
    image: placeholder("Lavee Spa"),
    tags: ["Booking", "Spa", "TypeScript"],
  },
  {
    title: "Salomy Aesthetics",
    description: "Booking platform for an aesthetics clinic, showcasing treatments and taking appointments.",
    category: "demo",
    demo: "https://salomy-aesthetics-booking.vercel.app",
    github: `${GITHUB}/salomy-aesthetics-booking`,
    image: placeholder("Salomy Aesthetics"),
    tags: ["Booking", "Aesthetics", "TypeScript"],
  },
  {
    title: "Salon Ulanda",
    description: "Modern hair and beauty salon website with services, gallery and contact details.",
    category: "demo",
    demo: "https://salon-ulanda-demo.vercel.app",
    github: `${GITHUB}/salon-Ulanda-demo`,
    image: placeholder("Salon Ulanda"),
    tags: ["Salon", "Website", "TypeScript"],
  },
  {
    title: "Due Vine",
    description: "Reservation website that lets guests view what is on offer and book online in a few clicks.",
    category: "demo",
    demo: "https://due-vine-booking.vercel.app",
    github: `${GITHUB}/due-vine-booking`,
    image: placeholder("Due Vine"),
    tags: ["Booking", "Hospitality", "TypeScript"],
  },
  {
    title: "Reform Pilates Studio",
    description: "Pilates studio website presenting classes, instructors and membership options.",
    category: "demo",
    demo: "https://reform-pilates-studio-seven.vercel.app",
    github: `${GITHUB}/reform-pilates-studio`,
    image: placeholder("Reform Pilates Studio"),
    tags: ["Fitness", "Website", "HTML"],
  },
  {
    title: "Reform Pilates",
    description: "Alternative design for a reformer pilates studio, with class schedule and booking enquiries.",
    category: "demo",
    demo: "https://reform-pilates-site.vercel.app",
    github: `${GITHUB}/reform-pilates-site`,
    image: placeholder("Reform Pilates"),
    tags: ["Fitness", "Website", "TypeScript"],
  },
  {
    title: "DefZoo Booking",
    description: "Visitor booking system for tickets and experiences, with a simple step-by-step checkout.",
    category: "demo",
    demo: "https://defzoo-booking.vercel.app",
    github: `${GITHUB}/defzoo-booking`,
    image: placeholder("DefZoo Booking"),
    tags: ["Booking", "Tickets", "TypeScript"],
  },
  {
    title: "TheFM Platform",
    description: "Web platform demo with a clean, responsive interface built for growth.",
    category: "demo",
    demo: "https://thefm-platform.vercel.app",
    github: `${GITHUB}/thefm-platform`,
    image: placeholder("TheFM Platform"),
    tags: ["Platform", "Web App", "TypeScript"],
  },
  {
    title: "Aviation Inventory",
    description: "Inventory tracker for aviation parts — stock levels, part numbers and locations in one place.",
    category: "tool",
    demo: "",
    github: `${GITHUB}/aviation-inventory`,
    image: placeholder("Aviation Inventory"),
    tags: ["Inventory", "Business Tool", "TypeScript"],
  },
  {
    title: "Business Dashboard",
    description: "Management dashboard that brings key business figures and reports together on one screen.",
    category: "tool",
    demo: "",
    github: `${GITHUB}/lamm-dashboard`,
    image: placeholder("Business Dashboard"),
    tags: ["Dashboard", "Business Tool", "TypeScript"],
  },
  {
    title: "Tool Register",
    description: "Register for tracking company tools and equipment: who has what, and where it is.",
    category: "tool",
    demo: "",
    github: `${GITHUB}/lamm-tool-register`,
    image: placeholder("Tool Register"),
    tags: ["Asset Tracking", "Business Tool", "JavaScript"],
  },
  {
    title: "Timesheet",
    description: "Timesheet app for capturing employee hours and simplifying payroll reporting.",
    category: "tool",
    demo: "",
    github: `${GITHUB}/timesheet`,
    image: placeholder("Timesheet"),
    tags: ["HR", "Business Tool", "TypeScript"],
  },
];
