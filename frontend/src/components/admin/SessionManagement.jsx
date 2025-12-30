import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSessions, deleteSession } from "../../api/admin";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

function SessionManagement() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["adminSessions"],
        queryFn: getAllSessions,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSession,
        onSuccess: () => {
            toast.success("Session terminated successfully");
            queryClient.invalidateQueries(["adminSessions"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to terminate session");
        },
    });

    const handleDelete = (sessionId) => {
        if (window.confirm("Are you sure you want to terminate this session?")) {
            deleteMutation.mutate(sessionId);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Session Management</h2>
                <p className="text-sm text-base-content/60">
                    {data?.sessions?.length || 0} active sessions
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Host</th>
                                <th>Participant</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.sessions?.map((session) => (
                                <tr key={session._id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {session.host?.profileImage && (
                                                <img
                                                    src={session.host.profileImage}
                                                    alt={session.host.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold">{session.host?.name}</p>
                                                <p className="text-xs text-base-content/60">
                                                    {session.host?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {session.participant ? (
                                            <div className="flex items-center gap-2">
                                                {session.participant?.profileImage && (
                                                    <img
                                                        src={session.participant.profileImage}
                                                        alt={session.participant.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold">
                                                        {session.participant?.name}
                                                    </p>
                                                    <p className="text-xs text-base-content/60">
                                                        {session.participant?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-base-content/40">No participant</span>
                                        )}
                                    </td>
                                    <td>{new Date(session.createdAt).toLocaleString()}</td>
                                    <td>
                                        <span className="badge badge-success">Active</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => handleDelete(session._id)}
                                            disabled={deleteMutation.isLoading}
                                        >
                                            <TrashIcon className="size-4" />
                                            Terminate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SessionManagement;
