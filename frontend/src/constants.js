import {
  LayoutDashboard, CalendarCheck, ClipboardCheck, FlaskConical, FolderKanban,
  Briefcase, GraduationCap, CalendarDays, FileBarChart2, Settings, ListChecks,
} from "lucide-react";

export const BLUE = "#4263FF", BLUE_2 = "#7E92FF", COPPER = "#E0853D",
  GREEN = "#15A05A", AMBER = "#D98A0B", RED = "#DC3A3A",
  INK = "#0B1220", GRID = "#EBEEF3", MUTED = "#8A94A6";

export const img = (id, w = 480, h = 320) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
export const av = (n) => `https://i.pravatar.cc/120?img=${((n - 1) % 70) + 1}`;

export const PHOTO = {
  circuit: "1518770660439-4636190af475",
  code: "1498050108023-c5249f4df085",
  data: "1551288049-bebda4e38f71",
  person: "1581091226825-a6a2a5aee158",
  server: "1558494949-ef010cbdcc31",
  security: "1550751827-4bd374c3f58b",
};

export const ROLE_META = {
  STUDENT: { label: "Student" },
  FACULTY: { label: "Faculty" },
  HOD: { label: "HOD" },
  LAB: { label: "Lab Instructor" },
  ADMIN: { label: "Department Admin" },
  PARENT: { label: "Parent" },
};

export const DEMO_PASSWORD = "Passw0rd!";
export const DEMO_ACCOUNTS = [
  { role: "STUDENT", label: "Student", email: "student@vlsi.ac.in", name: "Kamalesh V K", avatarSeed: 14 },
  { role: "FACULTY", label: "Faculty", email: "faculty@vlsi.ac.in", name: "Dr. Meena Sundaram", avatarSeed: 45 },
  { role: "HOD", label: "HOD", email: "hod@vlsi.ac.in", name: "Dr. Dilip Kumar", avatarSeed: 52 },
  { role: "LAB", label: "Lab Instructor", email: "lab@vlsi.ac.in", name: "K. Prakash", avatarSeed: 33 },
  { role: "ADMIN", label: "Department Admin", email: "admin@vlsi.ac.in", name: "S. Anitha", avatarSeed: 24 },
  { role: "PARENT", label: "Parent", email: "parent@vlsi.ac.in", name: "K. Saravanan", avatarSeed: 60 },
];

export const NAV = [
  { group: "Overview", items: [{ key: "dash", label: "Dashboard", icon: LayoutDashboard }] },
  { group: "Attendance", items: [
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "approvals", label: "Corrections & Approvals", icon: ClipboardCheck },
  ]},
  { group: "VLSI Department", items: [
    { key: "labs", label: "Lab Attendance", icon: FlaskConical },
    { key: "projects", label: "Project Tracking", icon: FolderKanban },
    { key: "intern", label: "Internship Tracking", icon: Briefcase },
    { key: "placement", label: "Placement Analytics", icon: GraduationCap },
  ]},
  { group: "Academics", items: [
    { key: "timetable", label: "Timetable", icon: CalendarDays },
    { key: "leave", label: "Leave Management", icon: ListChecks },
  ]},
  { group: "Insights", items: [{ key: "reports", label: "Analytics & Reports", icon: FileBarChart2 }] },
  { group: "Account", items: [{ key: "settings", label: "Settings & Security", icon: Settings }] },
];

export const TITLES = {
  dash: ["Dashboard", "Your day at a glance"],
  attendance: ["Attendance", "Mark, review and audit class attendance"],
  approvals: ["Corrections & Approvals", "Pending requests routed to you"],
  labs: ["Lab Attendance", "Live sessions across VLSI design labs"],
  projects: ["Project Tracking", "Capstone and research projects in the department"],
  intern: ["Internship Tracking", "Industry internships, mentors and stipends"],
  placement: ["Placement Analytics", "Offers, packages and recruiter activity"],
  timetable: ["Timetable", "Department, faculty and lab schedules"],
  leave: ["Leave Management", "Apply, route and approve leave"],
  reports: ["Analytics & Reports", "Generate and export institutional reports"],
  settings: ["Settings & Security", "Sessions, devices and access control"],
};

export const STATUS_LABEL = { PRESENT: "Present", ABSENT: "Absent", LATE: "Late", ON_DUTY: "On Duty", LEAVE: "Leave" };
export const STATUS_TONE = { PRESENT: "green", ABSENT: "red", LATE: "amber", ON_DUTY: "blue", LEAVE: "slate" };
export const LEAVE_TYPE_LABEL = { MEDICAL: "Medical Leave", CASUAL: "Casual Leave", ON_DUTY: "On Duty", OTHER: "Other" };
export const PROJECT_TAG_LABEL = { CAPSTONE: "Capstone", RESEARCH: "Research", SPONSORED: "Sponsored" };
export const PROJECT_TAG_TONE = { CAPSTONE: "blue", RESEARCH: "copper", SPONSORED: "green" };
export const INTERN_STAGE_LABEL = { APPLIED: "Applied", OFFER: "Offer", ONGOING: "Ongoing", COMPLETED: "Completed" };
export const INTERN_STAGE_TONE = { APPLIED: "slate", OFFER: "amber", ONGOING: "blue", COMPLETED: "green" };
export const INTERN_STAGES = ["APPLIED", "OFFER", "ONGOING", "COMPLETED"];
export const METHOD_LABEL = { MANUAL: "Manual", QR: "QR", FACE: "Face", RFID: "RFID", GEO: "Geo", BIOMETRIC: "Biometric" };

export const HEAT_C = ["#F1F3F7", "#FBE3CF", "#BBD0FF", "#4263FF"];
export const TT_C = { blue: ["#EDF0FF", "#3147C9"], copper: ["#FCEFE2", "#B5642A"], green: ["#E7F6EE", "#0F7A45"], amber: ["#FBF1DD", "#9A6406"] };
export const TT_ROWS = ["09:00", "10:50", "12:40", "14:30", "16:00"];
export const TT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const pctColor = (p) => (p >= 85 ? GREEN : p >= 75 ? AMBER : RED);
