import { useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminStats from "../components/admin/AdminStats";
import UserManagement from "../components/admin/UserManagement";
import ProblemManagement from "../components/admin/ProblemManagement";
import ContestManagement from "../components/admin/ContestManagement";
import SessionManagement from "../components/admin/SessionManagement";
import AppealManagement from "../components/admin/AppealManagement";
import { ShieldCheckIcon, UsersIcon, CodeIcon, TrophyIcon, VideoIcon, MessageSquareIcon } from "lucide-react";

function AdminPage() {
    const { isAdmin, isLoading } = useAdmin();
    const [activeTab, setActiveTab] = useState("dashboard");

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: ShieldCheckIcon },
        { id: "users", label: "Users", icon: UsersIcon },
        { id: "problems", label: "Problems", icon: CodeIcon },
        { id: "contests", label: "Contests", icon: TrophyIcon },
        { id: "sessions", label: "Sessions", icon: VideoIcon },
        { id: "appeals", label: "Appeals", icon: MessageSquareIcon },
    ];

    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-primary flex items-center gap-3">
                        <ShieldCheckIcon className="size-10" />
                        Admin Panel
                    </h1>
                    <p className="text-base-content/60 mt-2">Manage your platform from here</p>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed bg-base-200 mb-6 p-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`tab gap-2 font-bold ${activeTab === tab.id ? "tab-active" : ""
                                    }`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="bg-base-200 rounded-3xl p-6">
                    {activeTab === "dashboard" && <AdminStats />}
                    {activeTab === "users" && <UserManagement />}
                    {activeTab === "problems" && <ProblemManagement />}
                    {activeTab === "contests" && <ContestManagement />}
                    {activeTab === "sessions" && <SessionManagement />}
                    {activeTab === "appeals" && <AppealManagement />}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
