// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function initDashboard() {
      try {
        // Fetch current user session
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) {
          router.push("/login");
          return;
        }
        const userData = await userRes.json();
        if (!userData.user) {
          router.push("/login");
          return;
        }
        setUser(userData.user);

        // Fetch applications list
        const appsRes = await fetch("/api/applications");
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(appsData);
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local status state
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      } else {
        const err = await res.json();
        alert(`Error updating application status: ${err.error || "Please try again."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update application status.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-emerald-50 text-emerald-800 border-emerald-250";
      case "reviewed":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-xs text-muted">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading Dashboard Panel...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Top Intro banner */}
      <div className="bg-white border border-border p-6 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded capitalize">
            {user.role} Dashboard
          </span>
          <h1 className="text-xl font-bold text-foreground mt-1">
            Welcome Back, {user.name}
          </h1>
          <p className="text-xs text-muted">
            {user.role === "candidate"
              ? "Track your submitted vacancy applications and responses."
              : "Review CV submissions and manage candidates applying to your vacancies."}
          </p>
        </div>

        {user.role === "employer" && (
          <Link
            href="/post-a-job"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow hover:bg-secondary transition-all"
          >
            Post new vacancy
          </Link>
        )}
      </div>

      {/* Main Roster Panel */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/50">
          <h2 className="font-extrabold text-foreground text-sm">
            {user.role === "candidate" ? "My Applied Vacancies" : "Received CV Submissions"}
          </h2>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-2xl mb-2 block">📭</span>
            <h3 className="font-bold text-foreground text-sm">No applications recorded yet</h3>
            <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
              {user.role === "candidate"
                ? "You haven't applied to any job vacancies yet. Visit the directory to start applying."
                : "No candidates have applied to your vacancies yet."}
            </p>
            {user.role === "candidate" && (
              <Link
                href="/jobs"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-secondary transition-all"
              >
                Browse Vacancies
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {user.role === "candidate" ? (
              // Candidate Table View
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-muted font-bold">
                    <th className="p-4">Vacancy Title</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground font-normal">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold">
                        {app.jobId ? (
                          <Link href={`/jobs/${app.jobId._id}`} className="hover:underline text-primary">
                            {app.jobId.title}
                          </Link>
                        ) : (
                          "Expired Vacancy"
                        )}
                      </td>
                      <td className="p-4">{app.jobId ? app.jobId.company : "N/A"}</td>
                      <td className="p-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Employer Cards/Row List View
              <div className="divide-y divide-border">
                {applications.map((app) => (
                  <div key={app._id} className="p-5 flex flex-col md:flex-row justify-between gap-4 hover:bg-slate-50/50">
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{app.name}</span>
                        <a href={`mailto:${app.email}`} className="text-xs text-primary hover:underline">
                          ({app.email})
                        </a>
                        <span className="text-[10px] text-muted">
                          applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="text-xs text-foreground">
                        Vacancy: <span className="font-bold">{app.jobId ? app.jobId.title : "Unknown Vacancy"}</span>
                      </div>

                      <div className="bg-slate-50 border border-border p-3 rounded-lg text-xs text-muted max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed font-normal">
                        <strong>CV Details / Cover Letter:</strong><br />
                        {app.cvText}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-between gap-3 min-w-[150px]">
                      <span className={`inline-flex items-center rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>

                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(app._id, "shortlisted")}
                          className="px-2.5 py-1 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Shortlist
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(app._id, "reviewed")}
                          className="px-2.5 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleUpdateStatus(app._id, "rejected")}
                          className="px-2.5 py-1 text-[10px] bg-red-600 hover:bg-red-500 text-white rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
