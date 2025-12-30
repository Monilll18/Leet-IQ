import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

function AppealManagement() {
    const queryClient = useQueryClient();
    const [selectedAppeal, setSelectedAppeal] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

    const { data, isLoading } = useQuery({
        queryKey: ["adminAppeals"],
        queryFn: async () => {
            const response = await axiosInstance.get("/admin/appeals");
            return response.data;
        },
    });

    const approveMutation = useMutation({
        mutationFn: async ({ appealId, response }) => {
            const res = await axiosInstance.post(`/admin/appeals/${appealId}/approve`, { response });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Appeal approved and user unbanned");
            queryClient.invalidateQueries(["adminAppeals"]);
            queryClient.invalidateQueries(["adminUsers"]);
            setShowResponseModal(false);
            setSelectedAppeal(null);
            setResponseMessage("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to approve appeal");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ appealId, response }) => {
            const res = await axiosInstance.post(`/admin/appeals/${appealId}/reject`, { response });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Appeal rejected");
            queryClient.invalidateQueries(["adminAppeals"]);
            setShowResponseModal(false);
            setSelectedAppeal(null);
            setResponseMessage("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to reject appeal");
        },
    });

    const handleApprove = (appeal) => {
        setSelectedAppeal(appeal);
        setActionType('approve');
        setShowResponseModal(true);
    };

    const handleReject = (appeal) => {
        setSelectedAppeal(appeal);
        setActionType('reject');
        setShowResponseModal(true);
    };

    const handleSubmitResponse = () => {
        if (actionType === 'approve') {
            approveMutation.mutate({ appealId: selectedAppeal._id, response: responseMessage });
        } else {
            rejectMutation.mutate({ appealId: selectedAppeal._id, response: responseMessage });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="badge badge-warning">Pending</span>;
            case 'approved':
                return <span className="badge badge-success">Approved</span>;
            case 'rejected':
                return <span className="badge badge-error">Rejected</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Ban Appeals</h2>
                <p className="text-sm text-base-content/60">
                    {data?.appeals?.filter(a => a.status === 'pending').length || 0} pending appeals
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.appeals?.map((appeal) => (
                        <div
                            key={appeal._id}
                            className="bg-base-300 rounded-2xl p-6 border border-base-content/10"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {appeal.userId?.profileImage && (
                                        <img
                                            src={appeal.userId.profileImage}
                                            alt={appeal.userName}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <p className="font-bold text-lg">{appeal.userName}</p>
                                        <p className="text-sm text-base-content/60">{appeal.userEmail}</p>
                                    </div>
                                </div>
                                {getStatusBadge(appeal.status)}
                            </div>

                            <div className="bg-base-100 p-4 rounded-lg mb-4">
                                <p className="text-sm font-semibold mb-2">Appeal Message:</p>
                                <p className="text-sm">{appeal.message}</p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-base-content/60">
                                <span>Submitted: {new Date(appeal.createdAt).toLocaleString()}</span>
                                {appeal.reviewedAt && (
                                    <span>Reviewed: {new Date(appeal.reviewedAt).toLocaleString()}</span>
                                )}
                            </div>

                            {appeal.adminResponse && (
                                <div className="bg-info/10 p-4 rounded-lg mt-4">
                                    <p className="text-sm font-semibold mb-2">Admin Response:</p>
                                    <p className="text-sm">{appeal.adminResponse}</p>
                                    {appeal.reviewedBy && (
                                        <p className="text-xs text-base-content/60 mt-2">
                                            By: {appeal.reviewedBy.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {appeal.status === 'pending' && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApprove(appeal)}
                                    >
                                        <CheckCircleIcon className="size-4" />
                                        Approve & Unban
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleReject(appeal)}
                                    >
                                        <XCircleIcon className="size-4" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {data?.appeals?.length === 0 && (
                        <div className="text-center py-12 text-base-content/60">
                            No ban appeals yet
                        </div>
                    )}
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && selectedAppeal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {actionType === 'approve' ? 'Approve Appeal' : 'Reject Appeal'}
                        </h3>
                        <p className="mb-4">
                            {actionType === 'approve'
                                ? `Approving this appeal will unban ${selectedAppeal.userName}.`
                                : `Rejecting this appeal will keep ${selectedAppeal.userName} banned.`
                            }
                        </p>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Response Message (Optional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="Enter a message to the user..."
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => {
                                    setShowResponseModal(false);
                                    setSelectedAppeal(null);
                                    setResponseMessage("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-error'}`}
                                onClick={handleSubmitResponse}
                                disabled={approveMutation.isLoading || rejectMutation.isLoading}
                            >
                                {approveMutation.isLoading || rejectMutation.isLoading
                                    ? "Processing..."
                                    : actionType === 'approve'
                                        ? "Approve"
                                        : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppealManagement;
