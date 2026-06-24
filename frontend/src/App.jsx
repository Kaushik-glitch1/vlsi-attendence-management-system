import React, { useMemo, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { Sidebar, Topbar } from "./screens/Shell.jsx";
import Login from "./screens/Login.jsx";
import StudentDashboard from "./screens/StudentDashboard.jsx";
import FacultyDashboard from "./screens/FacultyDashboard.jsx";
import HODDashboard from "./screens/HODDashboard.jsx";
import AttendanceScreen from "./screens/AttendanceScreen.jsx";
import ApprovalsScreen from "./screens/ApprovalsScreen.jsx";
import LabAttendance from "./screens/LabAttendance.jsx";
import ProjectTracking from "./screens/ProjectTracking.jsx";
import InternshipTracking from "./screens/InternshipTracking.jsx";
import PlacementAnalytics from "./screens/PlacementAnalytics.jsx";
import Timetable from "./screens/Timetable.jsx";
import LeaveManagement from "./screens/LeaveManagement.jsx";
import Reports from "./screens/Reports.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import { CSS } from "./styles.js";

function StyleTag() {
  return <style>{CSS}</style>;
}

function Shell() {
  const { user } = useAuth();
  const [view, setView] = useState("dash");
  const [open, setOpen] = useState(false);

  const screen = useMemo(() => {
    if (view === "dash") {
      if (user.role === "FACULTY" || user.role === "LAB") return <FacultyDashboard />;
      if (user.role === "HOD" || user.role === "ADMIN") return <HODDashboard />;
      return <StudentDashboard />;
    }
    return {
      attendance: <AttendanceScreen />, approvals: <ApprovalsScreen />, labs: <LabAttendance />,
      projects: <ProjectTracking />, intern: <InternshipTracking />, placement: <PlacementAnalytics />,
      timetable: <Timetable />, leave: <LeaveManagement />, reports: <Reports />, settings: <SettingsScreen />,
    }[view];
  }, [view, user.role]);

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} open={open} setOpen={setOpen} />
      <div className="main">
        <Topbar setOpen={setOpen} view={view} />
        <main className="content" key={view}>{screen}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <>
      <StyleTag />
      {loading ? (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#8A94A6" }}>Loading…</div>
      ) : user ? (
        <Shell />
      ) : (
        <Login />
      )}
    </>
  );
}
