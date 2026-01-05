import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
    PackageIcon,
    ClipboardListIcon,
    TruckIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ArrowLeftIcon,
    CoinsIcon,
    CrownIcon,
    ShoppingBagIcon,
    Loader2Icon
} from 'lucide-react';
import axiosInstance from '../lib/axios';

const OrdersPage = () => {
    const { getToken, isSignedIn } = useAuth();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['user-orders'],
        queryFn: async () => {
            const token = await getToken();
            const res = await axiosInstance.get('/store/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: isSignedIn
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircleIcon className="size-4 text-success" />;
            case 'shipped':
                return <TruckIcon className="size-4 text-info" />;
            case 'processing':
                return <ClockIcon className="size-4 text-warning" />;
            case 'cancelled':
                return <XCircleIcon className="size-4 text-error" />;
            default:
                return <ClockIcon className="size-4 text-base-content/60" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'badge-ghost',
            processing: 'badge-warning',
            shipped: 'badge-info',
            delivered: 'badge-success',
            completed: 'badge-success',
            cancelled: 'badge-error'
        };
        return styles[status] || 'badge-ghost';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBagIcon className="size-16 mx-auto text-base-content/20 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Sign in to view orders</h2>
                    <p className="text-base-content/60 mb-4">
                        You need to be signed in to see your order history.
                    </p>
                    <Link to="/sign-in" className="btn btn-primary">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <div className="bg-base-100 border-b border-base-300">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Link to="/store" className="btn btn-ghost btn-sm gap-2">
                            <ArrowLeftIcon className="size-4" />
                            Back to Store
                        </Link>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ClipboardListIcon className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">My Orders</h1>
                            <p className="text-base-content/60 text-sm">
                                {orders.length} order{orders.length !== 1 ? 's' : ''} total
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2Icon className="size-8 animate-spin text-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <PackageIcon className="size-16 mx-auto text-base-content/20 mb-4" />
                        <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                        <p className="text-base-content/60 mb-4">
                            Start earning LeetCoins and redeem them for awesome products!
                        </p>
                        <Link to="/store" className="btn btn-primary gap-2">
                            <ShoppingBagIcon className="size-4" />
                            Browse Store
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="card-body p-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 rounded-xl bg-base-200 flex-shrink-0 overflow-hidden">
                                            {order.productImage ? (
                                                <img
                                                    src={order.productImage}
                                                    alt={order.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                                    {order.productId?.category === 'premium' ? '👑' : '📦'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold">{order.productName}</h3>
                                                    <p className="text-sm text-base-content/60">
                                                        Order ID: {order._id.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className={`badge ${getStatusBadge(order.status)} gap-1`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <CoinsIcon className="size-4" />
                                                    <span className="font-bold">{order.coinsCost.toLocaleString()}</span>
                                                </div>
                                                <div className="text-base-content/40">
                                                    {formatDate(order.createdAt)}
                                                </div>
                                                {order.premiumActivated && (
                                                    <div className="flex items-center gap-1 text-warning">
                                                        <CrownIcon className="size-4" />
                                                        Premium Activated
                                                    </div>
                                                )}
                                            </div>

                                            {/* Shipping Address */}
                                            {order.shippingAddress && order.shippingAddress.street && (
                                                <div className="mt-3 p-3 bg-base-200 rounded-lg text-sm">
                                                    <div className="flex items-center gap-2 text-base-content/60 mb-1">
                                                        <TruckIcon className="size-4" />
                                                        Shipping to:
                                                    </div>
                                                    <div className="text-base-content/80">
                                                        {order.shippingAddress.name}<br />
                                                        {order.shippingAddress.street}<br />
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                                        {order.shippingAddress.country}
                                                    </div>
                                                    {order.trackingNumber && (
                                                        <div className="mt-2 text-info">
                                                            Tracking: {order.trackingNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
