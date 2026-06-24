require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const DEMO_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "Passw0rd!";

// deterministic PRNG so re-running the seed produces the same dataset
let seed = 7;
function rnd() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const COURSES = [
  { code: "VL5101", name: "CMOS VLSI Design" },
  { code: "VL5202", name: "Verilog HDL Lab" },
  { code: "VL5303", name: "Physical Design & Verification" },
  { code: "VL5404", name: "Analog IC Design" },
  { code: "VL5505", name: "SoC Architecture" },
];

const FACULTY = [
  { email: "faculty@vlsi.ac.in", name: "Dr. Meena Sundaram", designation: "Associate Professor", avatarSeed: 45, courses: ["VL5101"] },
  { email: "hod@vlsi.ac.in", name: "Dr. Dilip Kumar", designation: "Head of Department", avatarSeed: 52, courses: ["VL5303"], role: "HOD" },
  { email: "lab@vlsi.ac.in", name: "K. Prakash", designation: "Lab Instructor", avatarSeed: 33, courses: ["VL5202"], role: "LAB" },
  { email: "s.iyer@vlsi.ac.in", name: "Dr. S. Iyer", designation: "Assistant Professor", avatarSeed: 51, courses: ["VL5404"] },
  { email: "r.senthil@vlsi.ac.in", name: "R. Senthil", designation: "Assistant Professor", avatarSeed: 60, courses: ["VL5505"] },
];

const STUDENTS = [
  ["Abirami S A", "714024169001", 91, 1], ["Ajaikumar G", "714024169002", 88, 2], ["Anand K", "714024169003", 78, 3],
  ["Ashwin S", "714024169004", 93, 4], ["Darshan R A", "714024169005", 86, 5], ["Dharaneesh A M", "714024169006", 72, 6],
  ["Dhivya G B", "714024169007", 95, 7], ["Gokul P", "714024169008", 77, 8], ["Harini D", "714024169009", 89, 9],
  ["Harini K S", "714024169010", 83, 10], ["Jai Aditya T", "714024169011", 90, 11], ["Jaiabinav T", "714024169012", 64, 12],
  ["Jithin Rio R", "714024169013", 85, 13], ["Kamalesh V K", "714024169014", 87, 14], ["Kavieshwara M", "714024169015", 92, 15],
  ["Kavya M", "714024169016", 94, 16], ["Kiruthika S", "714024169017", 88, 17], ["Monova M", "714024169018", 80, 18],
  ["Miruthula S", "714024169019", 81, 19], ["Mohamed Jaim M", "714024169020", 69, 20], ["Mohammed Ayman M", "714024169021", 78, 21],
  ["Monika M", "714024169022", 91, 22], ["Mukilan R", "714024169023", 85, 23], ["Nithikkannan J S", "714024169024", 89, 24],
  ["Nitin K R", "714024169025", 93, 25], ["Pratheep D", "714024169026", 67, 26], ["Prithika P", "714024169027", 82, 27],
  ["Pugaazhendhi S", "714024169028", 88, 28], ["Raghul Vasun V T", "714024169029", 75, 29], ["Rahul Prasath S", "714024169030", 90, 30],
  ["Rethika S", "714024169031", 84, 31], ["Roobashri S", "714024169032", 93, 32], ["Sakthishree D", "714024169033", 87, 33],
  ["Sanjeev G H", "714024169034", 73, 34], ["Sanjeykrishna V", "714024169035", 88, 35], ["Sankames V S", "714024169036", 79, 36],
  ["Santhosh Kumar S", "714024169037", 85, 37], ["Sasmitha S P", "714024169038", 92, 38], ["Shanmathi S", "714024169039", 86, 39],
  ["Soorya Velaa P", "714024169040", 90, 40], ["Sri Vatsan P", "714024169041", 83, 41], ["Sriram M R", "714024169042", 88, 42],
  ["Subashini N", "714024169043", 94, 43], ["Subiksha L", "714024169044", 89, 44], ["Suman S", "714024169045", 76, 45],
  ["Swetha R", "714024169046", 71, 46], ["Tharun M", "714024169047", 86, 47], ["Tharun R", "714024169048", 80, 48],
  ["Tharun R M", "714024169049", 87, 49], ["Thirumurugan S", "714024169050", 92, 50], ["Udhaya R", "714024169051", 83, 51],
  ["Vasra V R", "714024169052", 78, 52], ["Winston Churchill", "714024169053", 90, 53], ["Yogesh S", "714024169054", 88, 54],
  ["Abishek P", "714024169301", 76, 55], ["Kaushik R", "714024169302", 85, 56],
];

const COMPANIES = [
  { name: "Cygnus Semiconductors", color: "#4263FF", ctcTop: "₹28 LPA" },
  { name: "Northwind Silicon", color: "#15A05A", ctcTop: "₹24 LPA" },
  { name: "Aether Microsystems", color: "#E0853D", ctcTop: "₹21 LPA" },
  { name: "Helix EDA", color: "#8B5CF6", ctcTop: "₹19 LPA" },
  { name: "Vertex Design Systems", color: "#0EA5E9", ctcTop: "₹18 LPA" },
];

const PROJECTS = [
  { title: "16-bit RISC-V Core in SystemVerilog", lead: "714024169014", team: ["714024169017", "714024169042", "714024169023"], stage: "RTL Verification", tag: "CAPSTONE", due: "2026-04-12", img: "code" },
  { title: "Low-Power SRAM Compiler", lead: "714024169017", team: ["714024169016", "714024169042"], stage: "Physical Design", tag: "RESEARCH", due: "2026-04-28", img: "circuit" },
  { title: "AXI4 Interconnect — UVM Verification", lead: "714024169042", team: ["714024169014", "714024169016", "714024169023", "714024169008"], stage: "Testbench", tag: "CAPSTONE", due: "2026-05-03", img: "server" },
  { title: "FPGA CNN Accelerator", lead: "714024169016", team: ["714024169017", "714024169042"], stage: "Bitstream / Demo", tag: "SPONSORED", due: "2026-04-09", img: "data" },
  { title: "Sub-threshold Bandgap Reference", lead: "714024169008", team: ["714024169023"], stage: "Schematic", tag: "RESEARCH", due: "2026-05-17", img: "security" },
  { title: "Secure AES-256 Crypto Core", lead: "714024169023", team: ["714024169017", "714024169008"], stage: "Synthesis", tag: "CAPSTONE", due: "2026-04-21", img: "circuit" },
];

const INTERNSHIPS = [
  { roll: "714024169017", company: "Cygnus Semiconductors", role: "Design Verification Intern", stipend: "₹45,000", stage: "ONGOING", mentor: "Industry · A. Rao" },
  { roll: "714024169016", company: "Northwind Silicon", role: "Physical Design Intern", stipend: "₹50,000", stage: "ONGOING", mentor: "Industry · S. Menon" },
  { roll: "714024169042", company: "Aether Microsystems", role: "RTL Design Intern", stipend: "₹40,000", stage: "OFFER", mentor: "Pending" },
  { roll: "714024169023", company: "Helix EDA", role: "Analog Layout Intern", stipend: "₹38,000", stage: "COMPLETED", mentor: "Industry · V. Krishnan" },
  { roll: "714024169014", company: "Cygnus Semiconductors", role: "DV Intern", stipend: "₹45,000", stage: "APPLIED", mentor: "Pending" },
];

const PLACEMENTS = [
  { roll: "714024169016", company: "Northwind Silicon", ctc: "₹24 LPA", role: "Physical Design Engineer" },
  { roll: "714024169017", company: "Cygnus Semiconductors", ctc: "₹28 LPA", role: "DV Engineer" },
  { roll: "714024169042", company: "Aether Microsystems", ctc: "₹21 LPA", role: "RTL Design Engineer" },
  { roll: "714024169023", company: "Helix EDA", ctc: "₹19 LPA", role: "Analog Layout Engineer" },
];

const LEAVE_REQS = [
  { roll: "714024169008", type: "MEDICAL", from: "2026-03-18", to: "2026-03-20", doc: true, status: "PENDING" },
  { roll: "714024169019", type: "ON_DUTY", from: "2026-03-22", to: "2026-03-22", doc: true, status: "PENDING" },
  { roll: "714024169046", type: "CASUAL", from: "2026-03-25", to: "2026-03-26", doc: false, status: "PENDING" },
  { roll: "714024169042", type: "ON_DUTY", from: "2026-03-11", to: "2026-03-12", doc: true, status: "APPROVED" },
];

const TT_CELLS = [
  ["Mon", 0, "VL5101", "blue"], ["Mon", 1, "VL5303", "copper"], ["Mon", 2, "VL5202", "green"],
  ["Tue", 0, "VL5404", "amber"], ["Tue", 2, "VL5505", "blue"], ["Tue", 3, "VL5202", "green"],
  ["Wed", 0, "VL5101", "blue"], ["Wed", 1, "VL5505", "blue"], ["Wed", 3, "VL5303", "copper"],
  ["Thu", 1, "VL5404", "amber"], ["Thu", 2, "VL5404", "green"], ["Thu", 4, "VL5101", "blue"],
  ["Fri", 0, "VL5303", "copper"], ["Fri", 2, "VL5202", "green"], ["Fri", 3, "VL5505", "blue"],
];

const LABS = [
  { name: "Cadence Virtuoso Lab", courseCode: "VL5202", instructorEmail: "lab@vlsi.ac.in", seats: 30, presentRatio: 0.9, status: "LIVE", imageKey: "circuit" },
  { name: "Synopsys Design Lab", courseCode: "VL5303", instructorEmail: "r.senthil@vlsi.ac.in", seats: 28, presentRatio: 0.78, status: "LIVE", imageKey: "server" },
  { name: "FPGA Prototyping Lab", courseCode: "VL5505", instructorEmail: "lab@vlsi.ac.in", seats: 24, presentRatio: 0, status: "SCHEDULED", imageKey: "data" },
  { name: "Analog Characterization Lab", courseCode: "VL5404", instructorEmail: "s.iyer@vlsi.ac.in", seats: 20, presentRatio: 0.9, status: "LIVE", imageKey: "security" },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.auditLog.deleteMany(), prisma.deviceSession.deleteMany(), prisma.notification.deleteMany(),
    prisma.timetableSlot.deleteMany(), prisma.leaveApprovalStep.deleteMany(), prisma.leaveRequest.deleteMany(),
    prisma.correctionRequest.deleteMany(), prisma.approvalRequest.deleteMany(), prisma.placement.deleteMany(),
    prisma.internship.deleteMany(), prisma.projectMember.deleteMany(), prisma.project.deleteMany(),
    prisma.studentLabAttendance.deleteMany(), prisma.labSession.deleteMany(), prisma.lab.deleteMany(),
    prisma.attendanceRecord.deleteMany(), prisma.classSession.deleteMany(), prisma.enrollment.deleteMany(),
    prisma.parentLink.deleteMany(), prisma.company.deleteMany(), prisma.course.deleteMany(),
    prisma.studentProfile.deleteMany(), prisma.facultyProfile.deleteMany(), prisma.user.deleteMany(),
  ]);

  console.log("Creating courses...");
  const courseByCode = {};
  for (const c of COURSES) {
    courseByCode[c.code] = await prisma.course.create({ data: { code: c.code, name: c.name, semester: 3 } });
  }

  console.log("Creating faculty...");
  const facultyByEmail = {};
  for (const f of FACULTY) {
    const user = await prisma.user.create({
      data: {
        email: f.email,
        passwordHash,
        role: f.role || "FACULTY",
        name: f.name,
        avatarSeed: f.avatarSeed,
      },
    });
    const profile = await prisma.facultyProfile.create({
      data: { userId: user.id, designation: f.designation, avatarSeed: f.avatarSeed },
    });
    facultyByEmail[f.email] = profile;
  }

  console.log("Creating admin and parent...");
  await prisma.user.create({
    data: { email: "admin@vlsi.ac.in", passwordHash, role: "ADMIN", name: "S. Anitha", avatarSeed: 24 },
  });
  const parentUser = await prisma.user.create({
    data: { email: "parent@vlsi.ac.in", passwordHash, role: "PARENT", name: "K. Saravanan", avatarSeed: 60 },
  });

  console.log("Creating students + enrollments...");
  const studentByRoll = {};
  for (const [name, roll, targetPct, avatarSeed] of STUDENTS) {
    const email = roll === "714024169014" ? "student@vlsi.ac.in" : `${roll}@vlsi.ac.in`;
    const user = await prisma.user.create({
      data: { email, passwordHash, role: "STUDENT", name, avatarSeed },
    });
    const profile = await prisma.studentProfile.create({
      data: { userId: user.id, rollNo: roll, batch: "2024 Batch", semester: 3, avatarSeed },
    });
    studentByRoll[roll] = { profile, targetPct };
    for (const code of COURSES.map((c) => c.code)) {
      await prisma.enrollment.create({ data: { studentId: profile.id, courseId: courseByCode[code].id } });
    }
  }

  await prisma.parentLink.create({
    data: { parentUserId: parentUser.id, studentId: studentByRoll["714024169014"].profile.id },
  });

  console.log("Creating class sessions + attendance for the last 8 weeks...");
  const courseFaculty = {
    VL5101: "faculty@vlsi.ac.in",
    VL5202: "lab@vlsi.ac.in",
    VL5303: "hod@vlsi.ac.in",
    VL5404: "s.iyer@vlsi.ac.in",
    VL5505: "r.senthil@vlsi.ac.in",
  };
  const studentList = Object.values(studentByRoll);
  // spread each course's weekly lecture across a distinct weekday so the
  // per-student attendance heatmap shows a realistic daily spread
  const WEEKDAY_FOR_COURSE = { VL5101: 1, VL5303: 2, VL5202: 3, VL5404: 4, VL5505: 5 };
  function mostRecentWeekday(targetDow, weeksAgo) {
    const d = new Date();
    const diff = (d.getDay() - targetDow + 7) % 7;
    d.setDate(d.getDate() - diff - weeksAgo * 7);
    d.setHours(9, 0, 0, 0);
    return d;
  }
  for (const course of COURSES) {
    const facultyProfile = facultyByEmail[courseFaculty[course.code]];
    for (let wk = 7; wk >= 0; wk--) {
      const date = mostRecentWeekday(WEEKDAY_FOR_COURSE[course.code], wk);
      const session = await prisma.classSession.create({
        data: {
          courseId: courseByCode[course.code].id,
          facultyId: facultyProfile.id,
          room: "LH-204",
          date,
          startTime: "09:00",
          endTime: "10:40",
          status: wk === 0 ? "LIVE" : "COMPLETED",
          locked: wk !== 0,
        },
      });
      for (const { profile, targetPct } of studentList) {
        const roll = rnd();
        const status = roll < targetPct / 100 ? "PRESENT" : roll < targetPct / 100 + 0.04 ? "ON_DUTY" : roll < targetPct / 100 + 0.08 ? "LATE" : "ABSENT";
        await prisma.attendanceRecord.create({
          data: { sessionId: session.id, studentId: profile.id, status, method: ["MANUAL", "QR", "FACE", "RFID"][Math.floor(rnd() * 4)] },
        });
      }
    }
  }

  console.log("Seeding today's live classes for the demo student timetable...");
  const todaySlots = [
    { code: "VL5101", t: "09:00", end: "10:40", room: "LH-204" },
    { code: "VL5303", t: "10:50", end: "12:30", room: "LH-204" },
    { code: "VL5202", t: "12:40", end: "14:10", room: "Cadence Lab" },
    { code: "VL5404", t: "14:30", end: "16:00", room: "LH-201" },
  ];
  for (const slot of todaySlots) {
    const facultyProfile = facultyByEmail[courseFaculty[slot.code]];
    const session = await prisma.classSession.create({
      data: {
        courseId: courseByCode[slot.code].id,
        facultyId: facultyProfile.id,
        room: slot.room,
        date: new Date(),
        startTime: slot.t,
        endTime: slot.end,
        status: "LIVE",
      },
    });
    if (slot.t <= "12:00") {
      await prisma.attendanceRecord.create({
        data: { sessionId: session.id, studentId: studentByRoll["714024169014"].profile.id, status: "PRESENT", method: "QR" },
      });
    }
  }

  console.log("Creating timetable...");
  for (const [day, rowIndex, code, colorTag] of TT_CELLS) {
    const facultyProfile = facultyByEmail[courseFaculty[code]];
    await prisma.timetableSlot.create({
      data: { day, rowIndex, courseId: courseByCode[code].id, facultyId: facultyProfile.id, room: "LH-204", colorTag },
    });
  }

  console.log("Creating labs...");
  for (const l of LABS) {
    const lab = await prisma.lab.create({
      data: {
        name: l.name,
        courseId: courseByCode[l.courseCode].id,
        instructorId: facultyByEmail[l.instructorEmail].id,
        seats: l.seats,
        imageKey: l.imageKey,
      },
    });
    if (l.presentRatio > 0) {
      const labSession = await prisma.labSession.create({ data: { labId: lab.id, status: l.status } });
      const presentCount = Math.round(l.seats * l.presentRatio);
      const shuffled = [...studentList].sort(() => rnd() - 0.5).slice(0, presentCount);
      for (const { profile } of shuffled) {
        await prisma.studentLabAttendance.create({
          data: { labSessionId: labSession.id, labId: lab.id, studentId: profile.id, status: "PRESENT" },
        });
      }
    } else {
      await prisma.labSession.create({ data: { labId: lab.id, status: l.status } });
    }
  }

  console.log("Creating companies...");
  const companyByName = {};
  for (const c of COMPANIES) {
    companyByName[c.name] = await prisma.company.create({ data: c });
  }

  console.log("Creating projects...");
  for (const p of PROJECTS) {
    await prisma.project.create({
      data: {
        title: p.title,
        leadId: studentByRoll[p.lead].profile.id,
        stage: p.stage,
        progress: 30 + Math.floor(rnd() * 60),
        tag: p.tag,
        dueDate: new Date(p.due),
        imageKey: p.img,
        members: { create: p.team.map((roll) => ({ studentId: studentByRoll[roll].profile.id })) },
      },
    });
  }

  console.log("Creating internships...");
  for (const i of INTERNSHIPS) {
    await prisma.internship.create({
      data: {
        studentId: studentByRoll[i.roll].profile.id,
        companyId: companyByName[i.company].id,
        role: i.role,
        stipend: i.stipend,
        stage: i.stage,
        mentor: i.mentor,
      },
    });
  }

  console.log("Creating placements...");
  for (const p of PLACEMENTS) {
    await prisma.placement.create({
      data: {
        studentId: studentByRoll[p.roll].profile.id,
        companyId: companyByName[p.company].id,
        ctc: p.ctc,
        role: p.role,
      },
    });
  }

  console.log("Creating leave requests...");
  const STEP_NAMES = ["Submitted", "Faculty review", "HOD approval", "Recorded"];
  for (const l of LEAVE_REQS) {
    const doneSteps = l.status === "APPROVED" ? 4 : 2;
    await prisma.leaveRequest.create({
      data: {
        studentId: studentByRoll[l.roll].profile.id,
        type: l.type,
        fromDate: new Date(l.from),
        toDate: new Date(l.to),
        days: Math.round((new Date(l.to) - new Date(l.from)) / 86400000) + 1,
        hasDocument: l.doc,
        status: l.status,
        steps: {
          create: STEP_NAMES.map((name, i) => ({ name, order: i, done: i < doneSteps, actedAt: i < doneSteps ? new Date() : null })),
        },
      },
    });
  }

  console.log("Creating approval requests...");
  await prisma.approvalRequest.createMany({
    data: [
      { studentId: studentByRoll["714024169008"].profile.id, type: "ATTENDANCE_CORRECTION", detail: "VL5404 marked absent, was on duty" },
      { studentId: studentByRoll["714024169019"].profile.id, type: "LEAVE", detail: "3 days, certificate attached" },
      { studentId: studentByRoll["714024169046"].profile.id, type: "ATTENDANCE_CORRECTION", detail: "VL5202 RFID not detected" },
    ],
  });

  console.log("Creating notifications for the demo student...");
  const demoStudentUser = await prisma.user.findUnique({ where: { email: "student@vlsi.ac.in" } });
  await prisma.notification.createMany({
    data: [
      { userId: demoStudentUser.id, type: "risk", title: "Attendance below 75%", body: "Analog IC Design is trending below the eligibility threshold." },
      { userId: demoStudentUser.id, type: "leave", title: "Leave request approved", body: "Approved by Dr. Meena S." },
      { userId: demoStudentUser.id, type: "timetable", title: "Verilog HDL Lab moved", body: "Session relocated to Cadence Lab." },
      { userId: demoStudentUser.id, type: "placement", title: "Cygnus Semiconductors drive opens Monday", body: "Register before Friday to be eligible." },
    ],
  });

  console.log("Seed complete. Demo login password for every account:", DEMO_PASSWORD);
  console.log("Demo emails: student@vlsi.ac.in, faculty@vlsi.ac.in, hod@vlsi.ac.in, lab@vlsi.ac.in, admin@vlsi.ac.in, parent@vlsi.ac.in");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
