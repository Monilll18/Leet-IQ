import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import {
    CoinsIcon,
    ShoppingBagIcon,
    CrownIcon,
    SparklesIcon,
    PackageIcon,
    ClipboardListIcon,
    GiftIcon,
    TruckIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    Loader2Icon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import Navbar from '../components/Navbar';
import { useProfile } from '../hooks/useAuth';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import EarnLeetCoin from '../components/EarnLeetCoin';

const StorePage = () => {
    const { getToken, isSignedIn } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('merchandise');
    const [redeemingProduct, setRedeemingProduct] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Popular countries for shipping
    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
        'France', 'India', 'Japan', 'Brazil', 'Mexico', 'Italy', 'Spain',
        'Netherlands', 'Sweden', 'Switzerland', 'Singapore', 'South Korea',
        'United Arab Emirates', 'New Zealand', 'Ireland', 'Poland', 'Belgium',
        'Austria', 'Norway', 'Denmark', 'Finland', 'Portugal', 'Czech Republic',
        'Greece', 'Israel', 'South Africa', 'Argentina', 'Chile', 'Colombia',
        'Philippines', 'Thailand', 'Vietnam', 'Malaysia', 'Indonesia', 'Turkey'
    ].sort();

    // Validation function
    const validateForm = () => {
        const errors = {};

        // Name validation - at least 2 words, letters only
        if (!shippingAddress.name.trim() || shippingAddress.name.trim().split(' ').length < 2) {
            errors.name = 'Please enter your full name (first and last)';
        }

        // Street address - minimum length
        if (!shippingAddress.street.trim() || shippingAddress.street.trim().length < 10) {
            errors.street = 'Please enter a valid street address';
        }

        // City - letters only, minimum 2 chars
        if (!shippingAddress.city.trim() || !/^[a-zA-Z\s]{2,}$/.test(shippingAddress.city.trim())) {
            errors.city = 'Please enter a valid city name';
        }

        // State - letters only, minimum 2 chars
        if (!shippingAddress.state.trim() || !/^[a-zA-Z\s]{2,}$/.test(shippingAddress.state.trim())) {
            errors.state = 'Please enter a valid state/province';
        }

        // ZIP code - alphanumeric, 3-10 chars
        if (!shippingAddress.zipCode.trim() || !/^[a-zA-Z0-9\s-]{3,10}$/.test(shippingAddress.zipCode.trim())) {
            errors.zipCode = 'Please enter a valid ZIP/postal code';
        }

        // Country - must be selected
        if (!shippingAddress.country) {
            errors.country = 'Please select a country';
        }

        // Phone - validate using library
        if (!shippingAddress.phone || !isValidPhoneNumber(shippingAddress.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Fetch products
    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ['store-products', activeTab],
        queryFn: async () => {
            const category = activeTab === 'all' ? '' : activeTab;
            const res = await axiosInstance.get(`/store/products${category ? `?category=${category}` : ''}`);
            return res.data;
        }
    });

    // Use the same profile hook as Navbar to get correct coin balance
    const { data: userProfile } = useProfile();

    // Redeem mutation
    const redeemMutation = useMutation({
        mutationFn: async ({ productId, shippingAddress }) => {
            const token = await getToken();
            const res = await axiosInstance.post(`/store/redeem/${productId}`,
                { shippingAddress },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Redemption successful!');
            queryClient.invalidateQueries(['user-profile']);
            queryClient.invalidateQueries(['store-products']);
            setShowAddressModal(false);
            setSelectedProduct(null);
            setRedeemingProduct(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Redemption failed');
            setRedeemingProduct(null);
        }
    });

    const handleRedeem = (product) => {
        // For premium products, open premium page in new tab
        if (product.category === 'premium') {
            window.open('/premium', '_blank', 'noopener,noreferrer');
            return;
        }

        if (!isSignedIn) {
            toast.error('Please sign in to redeem products');
            return;
        }

        if (userProfile?.coins < product.price) {
            toast.error(`Not enough coins! You need ${product.price - userProfile.coins} more.`);
            return;
        }

        if (product.category === 'merchandise') {
            setSelectedProduct(product);
            setShowAddressModal(true);
        } else {
            setRedeemingProduct(product._id);
            redeemMutation.mutate({ productId: product._id });
        }
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        // Validate form first
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        setRedeemingProduct(selectedProduct._id);
        redeemMutation.mutate({
            productId: selectedProduct._id,
            shippingAddress
        });
    };

    const tabs = [
        { id: 'merchandise', label: 'Merchandise', icon: ShoppingBagIcon },
        { id: 'earn', label: 'Earn LeetCoin', icon: CoinsIcon },
    ];

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'premium': return <CrownIcon className="size-4" />;
            case 'merchandise': return <PackageIcon className="size-4" />;
            case 'digital': return <GiftIcon className="size-4" />;
            case 'earn': return <CoinsIcon className="size-4" />;
            default: return <SparklesIcon className="size-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-gradient-to-br from-base-300 via-base-300 to-primary/10 border-b border-base-300">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                            <ShoppingBagIcon className="size-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mb-2">
                        <span className="text-primary">Leet</span> IQ <span className="text-base-content/60">Store</span>
                    </h1>
                    <p className="text-base-content/60 mb-6">
                        Shop in our store or redeem your products for free by using LeetCoins.
                    </p>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`btn btn-sm gap-2 ${activeTab === tab.id
                                    ? 'btn-primary'
                                    : 'btn-ghost border border-base-content/10'
                                    }`}
                            >
                                <tab.icon className="size-4" />
                                {tab.label}
                            </button>
                        ))}
                        {/* Premium button - opens in new tab */}
                        <a
                            href="/premium"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm gap-2 btn-ghost border border-base-content/10"
                        >
                            <CrownIcon className="size-4" />
                            Premium
                        </a>
                        <Link to="/orders" className="btn btn-sm btn-ghost border border-base-content/10 gap-2">
                            <ClipboardListIcon className="size-4" />
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>

            {/* Coin Balance Bar */}
            {isSignedIn && (
                <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CoinsIcon className="size-5 text-amber-500" />
                            <span className="font-bold">{userProfile?.coins?.toLocaleString() || 0}</span>
                            <span className="text-base-content/60 text-sm">LeetCoins</span>
                        </div>
                        <Link to="/problems" className="btn btn-xs btn-primary gap-1">
                            <SparklesIcon className="size-3" />
                            Earn More
                        </Link>
                    </div>
                </div>
            )}

            {/* Products Grid OR Earn LeetCoin Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'earn' ? (
                    <EarnLeetCoin />
                ) : productsLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2Icon className="size-8 animate-spin text-primary" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <PackageIcon className="size-16 mx-auto text-base-content/20 mb-4" />
                        <h3 className="text-lg font-bold mb-2">No products available</h3>
                        <p className="text-base-content/60">Check back later for new items!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all group overflow-hidden"
                            >
                                {/* Product Image */}
                                <figure className="relative h-48 bg-gradient-to-br from-base-200 to-base-300 overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            {getCategoryIcon(product.category)}
                                            <span className="text-6xl opacity-20">
                                                {product.category === 'premium' ? '👑' :
                                                    product.category === 'merchandise' ? '👕' : '🎁'}
                                            </span>
                                        </div>
                                    )}
                                    {product.isFeatured && (
                                        <div className="absolute top-2 left-2 badge badge-warning gap-1 text-xs">
                                            <SparklesIcon className="size-3" />
                                            Featured
                                        </div>
                                    )}
                                    {product.stock !== -1 && product.stock <= 5 && product.stock > 0 && (
                                        <div className="absolute top-2 right-2 badge badge-error text-xs">
                                            Only {product.stock} left!
                                        </div>
                                    )}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-base-300/80 flex items-center justify-center">
                                            <span className="badge badge-lg badge-ghost">Out of Stock</span>
                                        </div>
                                    )}
                                </figure>

                                <div className="card-body p-4">
                                    <h3 className="card-title text-base">{product.name}</h3>
                                    <p className="text-sm text-base-content/60 line-clamp-2">
                                        {product.description || 'No description available'}
                                    </p>

                                    <div className="card-actions justify-between items-center mt-4">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                            <CoinsIcon className="size-4" />
                                            {product.price.toLocaleString()}
                                        </div>
                                        {/* Tooltip wrapper for insufficient coins */}
                                        {(() => {
                                            const userCoins = userProfile?.coins ?? 0;
                                            const hasEnoughCoins = userCoins >= product.price;
                                            const isNotEnoughCoins = isSignedIn && !hasEnoughCoins && product.category !== 'premium';
                                            const isDisabled = product.category !== 'premium' && (
                                                redeemingProduct === product._id ||
                                                product.stock === 0 ||
                                                (isSignedIn && !hasEnoughCoins)
                                            );

                                            return (
                                                <div
                                                    className={isNotEnoughCoins ? 'tooltip tooltip-left' : ''}
                                                    data-tip="Not enough LeetCoins"
                                                >
                                                    <button
                                                        onClick={() => handleRedeem(product)}
                                                        disabled={isDisabled}
                                                        className={`btn btn-sm ${product.category === 'premium'
                                                            ? 'btn-warning'
                                                            : hasEnoughCoins || !isSignedIn
                                                                ? 'btn-primary'
                                                                : 'btn-ghost opacity-50 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {redeemingProduct === product._id ? (
                                                            <Loader2Icon className="size-4 animate-spin" />
                                                        ) : product.category === 'premium' ? (
                                                            <>
                                                                <CrownIcon className="size-3" />
                                                                Get Premium
                                                            </>
                                                        ) : (
                                                            'Redeem'
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shipping Address Modal */}
            {showAddressModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TruckIcon className="size-5 text-primary" />
                            Shipping Address
                        </h3>
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name *</span></label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`input input-bordered ${formErrors.name ? 'input-error' : ''}`}
                                    value={shippingAddress.name}
                                    onChange={(e) => {
                                        setShippingAddress({ ...shippingAddress, name: e.target.value });
                                        if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                                    }}
                                />
                                {formErrors.name && <span className="text-error text-xs mt-1">{formErrors.name}</span>}
                            </div>

                            {/* Street Address */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Street Address *</span></label>
                                <input
                                    type="text"
                                    placeholder="123 Main Street, Apt 4B"
                                    className={`input input-bordered ${formErrors.street ? 'input-error' : ''}`}
                                    value={shippingAddress.street}
                                    onChange={(e) => {
                                        setShippingAddress({ ...shippingAddress, street: e.target.value });
                                        if (formErrors.street) setFormErrors({ ...formErrors, street: null });
                                    }}
                                />
                                {formErrors.street && <span className="text-error text-xs mt-1">{formErrors.street}</span>}
                            </div>

                            {/* City & State */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">City *</span></label>
                                    <input
                                        type="text"
                                        placeholder="New York"
                                        className={`input input-bordered ${formErrors.city ? 'input-error' : ''}`}
                                        value={shippingAddress.city}
                                        onChange={(e) => {
                                            setShippingAddress({ ...shippingAddress, city: e.target.value });
                                            if (formErrors.city) setFormErrors({ ...formErrors, city: null });
                                        }}
                                    />
                                    {formErrors.city && <span className="text-error text-xs mt-1">{formErrors.city}</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">State/Province *</span></label>
                                    <input
                                        type="text"
                                        placeholder="NY"
                                        className={`input input-bordered ${formErrors.state ? 'input-error' : ''}`}
                                        value={shippingAddress.state}
                                        onChange={(e) => {
                                            setShippingAddress({ ...shippingAddress, state: e.target.value });
                                            if (formErrors.state) setFormErrors({ ...formErrors, state: null });
                                        }}
                                    />
                                    {formErrors.state && <span className="text-error text-xs mt-1">{formErrors.state}</span>}
                                </div>
                            </div>

                            {/* ZIP & Country */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">ZIP/Postal Code *</span></label>
                                    <input
                                        type="text"
                                        placeholder="10001"
                                        className={`input input-bordered ${formErrors.zipCode ? 'input-error' : ''}`}
                                        value={shippingAddress.zipCode}
                                        onChange={(e) => {
                                            setShippingAddress({ ...shippingAddress, zipCode: e.target.value });
                                            if (formErrors.zipCode) setFormErrors({ ...formErrors, zipCode: null });
                                        }}
                                    />
                                    {formErrors.zipCode && <span className="text-error text-xs mt-1">{formErrors.zipCode}</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Country *</span></label>
                                    <select
                                        className={`select select-bordered ${formErrors.country ? 'select-error' : ''}`}
                                        value={shippingAddress.country}
                                        onChange={(e) => {
                                            setShippingAddress({ ...shippingAddress, country: e.target.value });
                                            if (formErrors.country) setFormErrors({ ...formErrors, country: null });
                                        }}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                    {formErrors.country && <span className="text-error text-xs mt-1">{formErrors.country}</span>}
                                </div>
                            </div>

                            {/* Phone Number with Country Code */}
                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number *</span></label>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={false}
                                    defaultCountry="US"
                                    placeholder="Enter phone number"
                                    value={shippingAddress.phone}
                                    onChange={(value) => {
                                        setShippingAddress({ ...shippingAddress, phone: value || '' });
                                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                                    }}
                                    className={`input input-bordered w-full ${formErrors.phone ? 'input-error' : ''}`}
                                />
                                {formErrors.phone && <span className="text-error text-xs mt-1">{formErrors.phone}</span>}
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setShowAddressModal(false);
                                        setSelectedProduct(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary gap-2"
                                    disabled={redeemMutation.isPending}
                                >
                                    {redeemMutation.isPending ? (
                                        <Loader2Icon className="size-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="size-4" />
                                            Confirm Redemption
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop bg-black/50" onClick={() => setShowAddressModal(false)} />
                </div>
            )}
        </div>
    );
};

export default StorePage;
