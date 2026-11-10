/*
 * Botha Digital — project list.
 *
 * To add a project, copy one block and edit it.
 *   title       – name shown on the card
 *   description – one or two short sentences
 *   category    – "demo" (client demo sites, shown first) or "tool" (business software)
 *   url         – live Vercel site URL
 *   image       – screenshot URL (placeholder for now; swap in a real screenshot later)
 *   tags        – short labels shown under the description
 */
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
    url: "https://divine-beauty-booking.vercel.app",
    image: placeholder("Divine Beauty"),
    tags: ["Booking", "Beauty", "TypeScript"],
  },
  {
    title: "Lavee Spa",
    description: "Elegant spa website where clients browse treatments and reserve a time slot online.",
    category: "demo",
    url: "https://lavee-spa-booking-rho.vercel.app",
    image: placeholder("Lavee Spa"),
    tags: ["Booking", "Spa", "TypeScript"],
  },
  {
    title: "Salomy Aesthetics",
    description: "Booking platform for an aesthetics clinic, showcasing treatments and taking appointments.",
    category: "demo",
    url: "https://salomy-aesthetics-booking.vercel.app",
    image: placeholder("Salomy Aesthetics"),
    tags: ["Booking", "Aesthetics", "TypeScript"],
  },
  {
    title: "Salon Ulanda",
    description: "Modern hair and beauty salon website with services, gallery and contact details.",
    category: "demo",
    url: "https://salon-ulanda-demo.vercel.app",
    image: placeholder("Salon Ulanda"),
    tags: ["Salon", "Website", "TypeScript"],
  },
  {
    title: "Due Vine",
    description: "Reservation website that lets guests view what is on offer and book online in a few clicks.",
    category: "demo",
    url: "https://due-vine-booking.vercel.app",
    image: placeholder("Due Vine"),
    tags: ["Booking", "Hospitality", "TypeScript"],
  },
  {
    title: "Reform Pilates Studio",
    description: "Pilates studio website presenting classes, instructors and membership options.",
    category: "demo",
    url: "https://reform-pilates-studio-seven.vercel.app",
    image: placeholder("Reform Pilates Studio"),
    tags: ["Fitness", "Website", "HTML"],
  },
  {
    title: "Reform Pilates",
    description: "Alternative design for a reformer pilates studio, with class schedule and booking enquiries.",
    category: "demo",
    url: "https://reform-pilates-site.vercel.app",
    image: placeholder("Reform Pilates"),
    tags: ["Fitness", "Website", "TypeScript"],
  },
  {
    title: "DefZoo Booking",
    description: "Visitor booking system for tickets and experiences, with a simple step-by-step checkout.",
    category: "demo",
    url: "https://defzoo-booking.vercel.app",
    image: placeholder("DefZoo Booking"),
    tags: ["Booking", "Tickets", "TypeScript"],
  },
  {
    title: "TheFM Platform",
    description: "Web platform demo with a clean, responsive interface built for growth.",
    category: "demo",
    url: "https://thefm-platform.vercel.app",
    image: placeholder("TheFM Platform"),
    tags: ["Platform", "Web App", "TypeScript"],
  },
  {
    title: "Aviation Inventory",
    description: "Inventory tracker for aviation parts — stock levels, part numbers and locations in one place.",
    category: "tool",
    url: "https://aviation-inventory.vercel.app",
    image: placeholder("Aviation Inventory"),
    tags: ["Inventory", "Business Tool", "TypeScript"],
  },
  {
    title: "Business Dashboard",
    description: "Management dashboard that brings key business figures and reports together on one screen.",
    category: "tool",
    url: "https://dashboard-xi-gules-45.vercel.app",
    image: placeholder("Business Dashboard"),
    tags: ["Dashboard", "Business Tool", "TypeScript"],
  },
  {
    title: "Tool Register",
    description: "Register for tracking company tools and equipment: who has what, and where it is.",
    category: "tool",
    url: "https://lamm-tool-register.vercel.app",
    image: placeholder("Tool Register"),
    tags: ["Asset Tracking", "Business Tool", "JavaScript"],
  },
  {
    title: "Timesheet",
    description: "Timesheet app for capturing employee hours and simplifying payroll reporting.",
    category: "tool",
    url: "https://timesheet-iota-nine.vercel.app",
    image: placeholder("Timesheet"),
    tags: ["HR", "Business Tool", "TypeScript"],
  },
  {
    title: "School Registration",
    description: "Online enrolment system where parents register learners and schools manage applications.",
    category: "tool",
    url: "https://school-registration-beige.vercel.app",
    image: placeholder("School Registration"),
    tags: ["Education", "Registration", "Next.js"],
  },
];
