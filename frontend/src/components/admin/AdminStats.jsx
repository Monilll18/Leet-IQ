import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../../api/admin";
import { UsersIcon, CodeIcon, TrophyIcon, CheckCircleIcon } from "lucide-react";

function AdminStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: getAdminStats,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Users",
            value: stats?.stats?.totalUsers || 0,
            icon: UsersIcon,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Total Problems",
            value: stats?.stats?.totalProblems || 0,
            icon: CodeIcon,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Total Contests",
            value: stats?.stats?.totalContests || 0,
            icon: TrophyIcon,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            title: "Acceptance Rate",
            value: `${stats?.stats?.acceptanceRate || 0}%`,
            icon: CheckCircleIcon,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-base-300 rounded-2xl p-6 border border-base-content/10"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-base-content/60 text-sm font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-black mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                                    <Icon className="size-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-base-300 rounded-2xl p-6 border border-base-content/10">
                    <h3 className="text-xl font-bold mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {stats?.recentUsers?.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 bg-base-100 rounded-lg"
                            >
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-base-content/60">{user.email}</p>
                                </div>
                                <p className="text-xs text-base-content/40">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-base-300 rounded-2xl p-6 border border-base-content/10">
                    <h3 className="text-xl font-bold mb-4">Recent Submissions</h3>
                    <div className="space-y-3">
                        {stats?.recentSubmissions?.slice(0, 5).map((submission) => (
                            <div
                                key={submission._id}
                                className="flex items-center justify-between p-3 bg-base-100 rounded-lg"
                            >
                                <div>
                                    <p className="font-semibold">{submission.userId?.name}</p>
                                    <p className="text-sm text-base-content/60">
                                        {submission.problemId}
                                    </p>
                                </div>
                                <span
                                    className={`badge ${submission.status === "Accepted"
                                            ? "badge-success"
                                            : "badge-error"
                                        }`}
                                >
                                    {submission.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminStats;
