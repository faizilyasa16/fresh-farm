import React, { useEffect, useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import AccessibleModal from '../../Components/AccessibleModal';
import { CATEGORY_ICON_OPTIONS, LivestockCategoryIcon, getCategoryIconKey, getCategoryImageUrl } from '../../Components/LivestockIcons';
import { formatRupiah } from '../../Components/LivestockCard';

const ORDER_STATUS_META = {
    pending_payment: {
        label: 'Menunggu Pembayaran',
        badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/40',
    },
    paid: {
        label: 'Pembayaran Terverifikasi',
        badgeClass: 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/40',
    },
    processing: {
        label: 'Disiapkan di Kandang',
        badgeClass: 'bg-[#E0F2FE] text-[#075985] border-[#0369A1]/30',
    },
    shipped: {
        label: 'Dalam Pengiriman',
        badgeClass: 'bg-[#E0E7FF] text-[#3730A3] border-[#4338CA]/30',
    },
    completed: {
        label: 'Selesai Diterima',
        badgeClass: 'bg-[#D8F3DC] text-[#1B4332] border-[#1B4332]/40',
    },
    cancelled: {
        label: 'Dibatalkan',
        badgeClass: 'bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]/30',
    },
};

const LIVESTOCK_STATUS_META = {
    available: {
        label: 'Tersedia',
        selectClass: 'bg-[#D8F3DC] text-[#1B4332] border-[#1B4332]',
    },
    booked: {
        label: 'Dipesan (Booked)',
        selectClass: 'bg-[#FEF3C7] text-[#92400E] border-[#92400E]',
    },
    sold: {
        label: 'Terjual',
        selectClass: 'bg-[#E7E5DF] text-[#1C1917] border-[#78716C]',
    },
    archived: {
        label: 'Diarsipkan',
        selectClass: 'bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]',
    },
};

const ROLE_BADGE_MAP = {
    admin: 'Admin Platform',
    seller: 'Mitra Peternak',
    buyer: 'Pembeli Ternak',
};

function formatDateId(dateString) {
    if (!dateString) {
        return '-';
    }
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
        return dateString;
    }
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
}

function toWhatsAppUrl(phone, text) {
    if (!phone) {
        return 'https://wa.me/6281234567890';
    }
    const digits = String(phone).replace(/[^0-9]/g, '');
    const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

function cleanPaginationLabel(rawLabel) {
    const label = String(rawLabel || '');
    if (label.includes('Previous') || label.includes('&laquo;')) {
        return 'Sebelumnya';
    }
    if (label.includes('Next') || label.includes('&raquo;')) {
        return 'Berikutnya';
    }
    return label.replace(/&[^;]+;/g, '');
}

function PaginationBar({ links }) {
    if (!Array.isArray(links) || links.length <= 3) {
        return null;
    }

    return (
        <nav aria-label="Navigasi halaman data" className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {links.map((link, idx) => {
                const labelText = cleanPaginationLabel(link.label);
                if (!link.url) {
                    return (
                        <span
                            key={`${labelText}-${idx}`}
                            aria-disabled="true"
                            className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border border-[#E7E5DF] bg-[#F4F2EC] text-[#57534E] text-xs font-medium opacity-70"
                        >
                            {labelText}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${labelText}-${idx}`}
                        href={link.url}
                        preserveScroll
                        aria-current={link.active ? 'page' : undefined}
                        className={`min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                            link.active
                                ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                : 'bg-white border-[#78716C] text-[#1C1917] hover:bg-[#F4F2EC]'
                        }`}
                    >
                        {labelText}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function DashboardIndex({
    activeTab = 'orders',
    summary = {},
    livestocks = null,
    orders = null,
    categories = [],
    sellers = [],
    managedUsers = [],
    filters = {},
}) {
    const { auth, errors: pageErrors = {} } = usePage().props;
    const currentUser = auth?.user;
    const role = currentUser?.role || 'buyer';
    const isAdmin = role === 'admin';
    const isSeller = role === 'seller';
    const isBuyer = role === 'buyer';

    const [isNavigating, setIsNavigating] = useState(false);

    // Search & filter states for Livestock inventory
    const [livestockKeyword, setLivestockKeyword] = useState(filters.q || '');
    const [livestockStatusFilter, setLivestockStatusFilter] = useState(filters.status || 'all');

    // User verification filter for Admin
    const [userFilterRole, setUserFilterRole] = useState('all');

    // Modals state
    const [livestockModalOpen, setLivestockModalOpen] = useState(false);
    const [editingLivestock, setEditingLivestock] = useState(null);
    const [livestockSubmitting, setLivestockSubmitting] = useState(false);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
    const [livestockForm, setLivestockForm] = useState({
        title: '',
        category_id: categories[0]?.id || '',
        seller_id: sellers[0]?.id || currentUser?.id || '',
        breed: '',
        gender: 'male',
        weight_kg: '',
        age_months: '',
        price: '',
        stock: 1,
        health_status: 'Bebas PMK, Vaksin Lengkap & SKKH Dinas',
        status: 'available',
        description: '',
        image_url: '',
        photo: null,
    });

    const [archivingLivestock, setArchivingLivestock] = useState(null);
    const [isArchiving, setIsArchiving] = useState(false);

    const [proofUploadOrder, setProofUploadOrder] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    const [proofPreviewLocal, setProofPreviewLocal] = useState('');
    const [isUploadingProof, setIsUploadingProof] = useState(false);

    const [previewProofOrder, setPreviewProofOrder] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    // Category CRUD states (Admin)
    const categoryCreateForm = useForm({
        name: '',
        icon_url: 'sapi',
        image_url: '',
        image: null,
    });
    const [categoryCreatePreview, setCategoryCreatePreview] = useState('');

    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryData, setEditCategoryData] = useState({
        name: '',
        icon_url: 'sapi',
        image_url: '',
        image: null,
    });
    const [editCategoryPreview, setEditCategoryPreview] = useState('');
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);

    // Profile form (all roles)
    const profileForm = useForm({
        name: currentUser?.name || '',
        phone_number: currentUser?.phone_number || '',
        city: currentUser?.city || '',
        address: currentUser?.address || '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setLivestockKeyword(filters.q || '');
        setLivestockStatusFilter(filters.status || 'all');
    }, [filters.q, filters.status]);

    useEffect(() => {
        return () => {
            if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreviewUrl);
            }
            if (proofPreviewLocal && proofPreviewLocal.startsWith('blob:')) {
                URL.revokeObjectURL(proofPreviewLocal);
            }
            if (categoryCreatePreview && categoryCreatePreview.startsWith('blob:')) {
                URL.revokeObjectURL(categoryCreatePreview);
            }
            if (editCategoryPreview && editCategoryPreview.startsWith('blob:')) {
                URL.revokeObjectURL(editCategoryPreview);
            }
        };
    }, [photoPreviewUrl, proofPreviewLocal, categoryCreatePreview, editCategoryPreview]);

    const navigateDashboard = (params) => {
        router.get('/dashboard', params, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsNavigating(true),
            onFinish: () => setIsNavigating(false),
        });
    };

    const handleTabSelect = (tabKey) => {
        navigateDashboard({
            tab: tabKey,
            status: livestockStatusFilter,
            order_status: filters.order_status || 'all',
            q: livestockKeyword,
        });
    };

    const handleOrderFilterChange = (nextOrderStatus) => {
        navigateDashboard({
            tab: 'orders',
            order_status: nextOrderStatus,
            status: livestockStatusFilter,
            q: livestockKeyword,
        });
    };

    const handleLivestockSearchSubmit = (e) => {
        e.preventDefault();
        navigateDashboard({
            tab: 'livestocks',
            status: livestockStatusFilter,
            q: livestockKeyword,
            order_status: filters.order_status || 'all',
        });
    };

    const handleResetLivestockSearch = () => {
        setLivestockKeyword('');
        setLivestockStatusFilter('all');
        navigateDashboard({
            tab: 'livestocks',
            status: 'all',
            q: '',
            order_status: filters.order_status || 'all',
        });
    };

    const openCreateLivestockModal = () => {
        setEditingLivestock(null);
        setPhotoPreviewUrl('');
        setLivestockForm({
            title: '',
            category_id: categories[0]?.id || '',
            seller_id: sellers[0]?.id || currentUser?.id || '',
            breed: '',
            gender: 'male',
            weight_kg: '',
            age_months: '',
            price: '',
            stock: 1,
            health_status: 'Bebas PMK, Vaksin Lengkap & SKKH Dinas',
            status: 'available',
            description: '',
            image_url: '',
            photo: null,
        });
        setLivestockModalOpen(true);
    };

    const openEditLivestockModal = (item) => {
        const currentImg = item.images?.[0]?.image_url || '';
        setEditingLivestock(item);
        setPhotoPreviewUrl(currentImg);
        setLivestockForm({
            title: item.title || '',
            category_id: item.category_id || categories[0]?.id || '',
            seller_id: item.seller_id || currentUser?.id || '',
            breed: item.breed || '',
            gender: item.gender || 'male',
            weight_kg: item.weight_kg || '',
            age_months: item.age_months || '',
            price: Number(item.price || 0),
            stock: item.stock ?? 1,
            health_status: item.health_status || '',
            status: item.status || 'available',
            description: item.description || '',
            image_url: currentImg.startsWith('/storage/') ? '' : currentImg,
            photo: null,
        });
        setLivestockModalOpen(true);
    };

    const handleLivestockPhotoSelect = (e) => {
        const file = e.target.files?.[0] || null;
        if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreviewUrl);
        }
        setLivestockForm((prev) => ({ ...prev, photo: file }));
        if (file) {
            setPhotoPreviewUrl(URL.createObjectURL(file));
        } else {
            setPhotoPreviewUrl(editingLivestock?.images?.[0]?.image_url || '');
        }
    };

    const handleLivestockSubmit = (e) => {
        e.preventDefault();
        setLivestockSubmitting(true);

        if (editingLivestock) {
            const payload = {
                ...livestockForm,
                _method: 'put',
            };
            if (!payload.photo) {
                delete payload.photo;
            }
            router.post(`/seller/livestock/${editingLivestock.id}`, payload, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setLivestockModalOpen(false);
                    setEditingLivestock(null);
                },
                onFinish: () => setLivestockSubmitting(false),
            });
            return;
        }

        const createPayload = { ...livestockForm };
        if (!createPayload.photo) {
            delete createPayload.photo;
        }
        router.post('/seller/livestock', createPayload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setLivestockModalOpen(false);
            },
            onFinish: () => setLivestockSubmitting(false),
        });
    };

    const handleQuickLivestockStatus = (id, nextStatus) => {
        router.put(
            `/seller/livestock/${id}`,
            { status: nextStatus },
            { preserveScroll: true }
        );
    };

    const confirmArchiveLivestock = () => {
        if (!archivingLivestock) {
            return;
        }
        setIsArchiving(true);
        router.delete(`/seller/livestock/${archivingLivestock.id}`, {
            preserveScroll: true,
            onSuccess: () => setArchivingLivestock(null),
            onFinish: () => setIsArchiving(false),
        });
    };

    const handleOrderStatusUpdate = (orderId, nextStatus) => {
        setUpdatingOrderId(orderId);
        router.patch(
            `/dashboard/orders/${orderId}/status`,
            { order_status: nextStatus },
            {
                preserveScroll: true,
                onSuccess: () => setCancellingOrder(null),
                onFinish: () => setUpdatingOrderId(null),
            }
        );
    };

    const openPaymentProofModal = (order) => {
        setProofUploadOrder(order);
        setProofFile(null);
        setProofPreviewLocal('');
    };

    const handleProofFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (proofPreviewLocal && proofPreviewLocal.startsWith('blob:')) {
            URL.revokeObjectURL(proofPreviewLocal);
        }
        setProofFile(file);
        setProofPreviewLocal(file ? URL.createObjectURL(file) : '');
    };

    const submitPaymentProof = (e) => {
        e.preventDefault();
        if (!proofUploadOrder || !proofFile) {
            return;
        }
        setIsUploadingProof(true);
        router.post(
            `/dashboard/orders/${proofUploadOrder.id}/payment-proof`,
            { payment_proof: proofFile },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setProofUploadOrder(null);
                    setProofFile(null);
                    setProofPreviewLocal('');
                },
                onFinish: () => setIsUploadingProof(false),
            }
        );
    };

    const handleToggleUserVerify = (userId) => {
        router.patch(`/dashboard/users/${userId}/verify`, {}, { preserveScroll: true });
    };

    const handleCreateCategory = (e) => {
        e.preventDefault();
        categoryCreateForm.post('/dashboard/categories', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                categoryCreateForm.reset();
                setCategoryCreatePreview('');
            },
        });
    };

    const handleCategoryCreateFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            categoryCreateForm.setData('image', file);
            setCategoryCreatePreview(URL.createObjectURL(file));
        }
    };

    const openEditCategoryModal = (cat) => {
        setEditingCategory(cat);
        setEditCategoryData({
            name: cat.name,
            icon_url: cat.icon_url || cat.slug || 'sapi',
            image_url: cat.image_url || '',
            image: null,
        });
        setEditCategoryPreview(cat.image_url || '');
    };

    const handleEditCategoryFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditCategoryData((prev) => ({ ...prev, image: file }));
            setEditCategoryPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        if (!editingCategory) {
            return;
        }
        setIsSavingCategory(true);
        router.post(`/dashboard/categories/${editingCategory.id}`, {
            ...editCategoryData,
            _method: 'put',
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setEditingCategory(null);
                setEditCategoryPreview('');
            },
            onFinish: () => setIsSavingCategory(false),
        });
    };

    const handleDeleteCategory = () => {
        if (!deletingCategory) {
            return;
        }
        setIsSavingCategory(true);
        router.delete(`/dashboard/categories/${deletingCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingCategory(null),
            onFinish: () => setIsSavingCategory(false),
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put('/dashboard/profile', {
            preserveScroll: true,
            onSuccess: () => {
                profileForm.setData((prev) => ({
                    ...prev,
                    password: '',
                    password_confirmation: '',
                }));
            },
        });
    };

    const tabs = isAdmin
        ? [
              { id: 'orders', label: 'Semua Transaksi' },
              { id: 'livestocks', label: 'Inventaris Pasar' },
              { id: 'users', label: 'Verifikasi Pengguna' },
              { id: 'categories', label: 'Master Kategori' },
              { id: 'profile', label: 'Profil Admin' },
          ]
        : isSeller
          ? [
                { id: 'livestocks', label: 'Inventaris Ternak Kandang' },
                { id: 'orders', label: 'Pesanan Masuk' },
                { id: 'profile', label: 'Profil Kandang' },
            ]
          : [
                { id: 'orders', label: 'Pesanan Saya' },
                { id: 'profile', label: 'Profil & Alamat Kirim' },
            ];

    const summaryCards = isAdmin
        ? [
              { label: 'Pesanan Menunggu', value: `${summary.pending_orders ?? 0} Pesanan`, tone: 'amber' },
              { label: 'Transaksi Aktif & Selesai', value: `${summary.completed_orders ?? 0} Pesanan`, tone: 'forest' },
              { label: 'Ternak Tersedia di Pasar', value: `${summary.available_livestock ?? 0} Ekor`, tone: 'forest' },
              { label: 'Peternak Belum Diverifikasi', value: `${summary.unverified_sellers ?? 0} Akun`, tone: 'amber' },
              {
                  label: 'Mitra & Pembeli Terdaftar',
                  value: `${(summary.total_sellers ?? 0) + (summary.total_buyers ?? 0)} Akun`,
                  sub: `${summary.total_sellers ?? 0} peternak, ${summary.total_buyers ?? 0} pembeli`,
                  tone: 'neutral',
              },
          ]
        : isSeller
          ? [
                { label: 'Total Koleksi Kandang', value: `${summary.total_livestock ?? 0} Ekor`, tone: 'neutral' },
                { label: 'Tersedia di Katalog', value: `${summary.available_livestock ?? 0} Ekor`, tone: 'forest' },
                { label: 'Sedang Dipesan (Booked)', value: `${summary.booked_livestock ?? 0} Ekor`, tone: 'amber' },
                { label: 'Terjual / Lunas', value: `${summary.sold_livestock ?? 0} Ekor`, tone: 'neutral' },
                { label: 'Pesanan Menunggu', value: `${summary.pending_orders ?? 0} Pesanan`, tone: 'amber' },
            ]
          : [
                { label: 'Total Pesanan Saya', value: `${summary.total_orders ?? 0} Pesanan`, tone: 'neutral' },
                { label: 'Menunggu Pembayaran', value: `${summary.pending_orders ?? 0} Pesanan`, tone: 'amber' },
                { label: 'Diproses / Dikirim', value: `${summary.active_orders ?? 0} Pesanan`, tone: 'forest' },
                { label: 'Selesai Diterima', value: `${summary.completed_orders ?? 0} Pesanan`, tone: 'forest' },
            ];

    const filteredManagedUsers = managedUsers.filter((account) => {
        if (userFilterRole === 'seller') {
            return account.role === 'seller';
        }
        if (userFilterRole === 'unverified') {
            return account.role === 'seller' && !account.is_verified;
        }
        if (userFilterRole === 'buyer') {
            return account.role === 'buyer';
        }
        return true;
    });

    return (
        <AppLayout currentRoute="dashboard">
            <Head title={`Dashboard ${ROLE_BADGE_MAP[role] || 'Akun'}`} />

            <section className="w-full bg-[#F4F2EC] border-b border-[#D6D3CB] py-7 sm:py-9">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-2.5 py-1 rounded-md bg-[#1B4332] text-white text-xs font-bold">
                                    {ROLE_BADGE_MAP[role]}
                                </span>
                                {isSeller && (
                                    <span
                                        role="img"
                                        title={currentUser?.is_verified ? 'Kandang Terverifikasi' : 'Menunggu Verifikasi Admin'}
                                        aria-label={currentUser?.is_verified ? 'Kandang Terverifikasi' : 'Menunggu Verifikasi Admin'}
                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
                                            currentUser?.is_verified
                                                ? 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/40'
                                                : 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/40'
                                        }`}
                                    >
                                        {currentUser?.is_verified ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
                                {currentUser?.name}
                            </h1>
                            <p className="text-sm text-[#57534E] mt-1">
                                {isAdmin
                                    ? 'Kelola verifikasi mitra peternak, master kategori hewan, inventaris pasar, dan status pembayaran pesanan.'
                                    : isSeller
                                      ? 'Kelola stok hewan ternak kandang Anda, unggah foto dokumentasi asli, dan konfirmasi pesanan pembeli.'
                                      : 'Pantau status booking hewan ternak Anda, unggah bukti pembayaran transfer, dan kelola alamat kirim.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            {(isSeller || isAdmin) && (
                                <button
                                    type="button"
                                    onClick={openCreateLivestockModal}
                                    className="min-h-11 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    <span className="text-base leading-none font-bold">+</span>
                                    <span>Tambah Hewan Ternak</span>
                                </button>
                            )}
                            <Link
                                href="/katalog"
                                className={`min-h-11 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                    isBuyer
                                        ? 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white'
                                        : 'bg-white hover:bg-[#FBFBF9] border border-[#78716C] text-[#1C1917]'
                                }`}
                            >
                                {isBuyer ? 'Cari Ternak di Katalog' : 'Lihat Katalog Publik'}
                            </Link>
                        </div>
                    </div>

                    <div
                        className={`grid grid-cols-2 ${
                            summaryCards.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
                        } gap-3.5 mt-6`}
                    >
                        {summaryCards.map((metric) => (
                            <div
                                key={metric.label}
                                className="p-4 rounded-xl bg-white border border-[#D6D3CB] flex flex-col justify-between"
                            >
                                <span className="text-xs font-medium text-[#57534E]">{metric.label}</span>
                                <strong
                                    className={`text-xl sm:text-2xl font-bold mt-1.5 tabular-nums ${
                                        metric.tone === 'forest'
                                            ? 'text-[#1B4332]'
                                            : metric.tone === 'amber'
                                              ? 'text-[#9A3412]'
                                              : 'text-[#1C1917]'
                                    }`}
                                >
                                    {metric.value}
                                </strong>
                                {metric.sub && (
                                    <span className="text-[11px] text-[#57534E] mt-1">{metric.sub}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <nav
                        aria-label="Menu bagian dashboard"
                        className="mt-7 -mb-7 sm:-mb-9 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#E7E5DF] pt-2"
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabSelect(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`min-h-11 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                                        active
                                            ? 'border-[#1B4332] text-[#1B4332] bg-white/70 rounded-t-lg'
                                            : 'border-transparent text-[#57534E] hover:text-[#1C1917]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </section>

            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
                {isNavigating && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mb-5 px-4 py-3 rounded-xl bg-[#D8F3DC] border border-[#2D6A4F]/30 text-xs font-semibold text-[#1B4332]"
                    >
                        Memuat pembaruan data dashboard...
                    </div>
                )}

                {Object.keys(pageErrors).length > 0 && (
                    <div
                        role="alert"
                        className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#991B1B]/30 text-sm text-[#991B1B]"
                    >
                        <strong className="font-bold block mb-1">Periksa kembali input Anda:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-xs font-medium">
                            {Object.entries(pageErrors).map(([field, msg]) => (
                                <li key={field}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* TAB: ORDERS (Buyer, Seller, Admin) */}
                {activeTab === 'orders' && (
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-[#1C1917]">
                                    {isAdmin
                                        ? 'Daftar Transaksi Seluruh Platform'
                                        : isSeller
                                          ? 'Pesanan Masuk ke Kandang Anda'
                                          : 'Riwayat Booking & Pesanan Saya'}
                                </h2>
                                <p className="text-xs text-[#57534E] mt-0.5">
                                    Menampilkan {orders?.data?.length ?? 0} dari total {orders?.total ?? 0} pesanan.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'pending_payment', label: 'Menunggu Bayar' },
                                    { id: 'paid', label: 'Dibayar' },
                                    { id: 'processing', label: 'Diproses' },
                                    { id: 'shipped', label: 'Dikirim' },
                                    { id: 'completed', label: 'Selesai' },
                                    { id: 'cancelled', label: 'Dibatalkan' },
                                ].map((st) => {
                                    const isSelected = (filters.order_status || 'all') === st.id;
                                    return (
                                        <button
                                            key={st.id}
                                            type="button"
                                            onClick={() => handleOrderFilterChange(st.id)}
                                            aria-pressed={isSelected}
                                            className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                                    : 'bg-white border-[#78716C] text-[#1C1917] hover:bg-[#F4F2EC]'
                                            }`}
                                        >
                                            {st.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {orders?.data && orders.data.length > 0 ? (
                            <div className="space-y-4">
                                {orders.data.map((order) => {
                                    const statusMeta =
                                        ORDER_STATUS_META[order.order_status] || ORDER_STATUS_META.pending_payment;
                                    const buyerName = order.guest_name || order.buyer?.name || 'Pembeli';
                                    const buyerPhone = order.guest_phone || order.buyer?.phone_number || '';
                                    const sellerName = order.seller?.name || 'Mitra Peternak';
                                    const sellerPhone = order.seller?.phone_number || '';
                                    const firstItemTitle =
                                        order.items?.[0]?.livestock?.title || `Pesanan #${order.id}`;

                                    return (
                                        <article
                                            key={order.id}
                                            className="bg-white rounded-2xl border border-[#D6D3CB] p-5 sm:p-6 shadow-xs"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E5DF]">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <strong className="text-base font-bold text-[#1C1917] tabular-nums">
                                                        Pesanan #{order.id}
                                                    </strong>
                                                    <span className="text-xs text-[#57534E]">
                                                        Tanggal: {formatDateId(order.created_at)}
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusMeta.badgeClass}`}
                                                    >
                                                        {statusMeta.label}
                                                    </span>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <span className="text-xs text-[#57534E] block">
                                                        Total Tagihan
                                                    </span>
                                                    <strong className="text-lg font-bold text-[#1B4332] tabular-nums">
                                                        {formatRupiah(order.total_amount)}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="py-4 space-y-3">
                                                {order.items?.map((orderItem) => {
                                                    const animal = orderItem.livestock;
                                                    const thumb =
                                                        animal?.images?.[0]?.image_url || '/images/hero-farm.jpg';
                                                    return (
                                                        <div
                                                            key={orderItem.id}
                                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#FBFBF9] border border-[#E7E5DF]"
                                                        >
                                                            <div className="flex items-center gap-3.5 min-w-0">
                                                                <img
                                                                    src={thumb}
                                                                    alt={animal?.title || 'Hewan ternak'}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="w-16 h-16 rounded-xl object-cover bg-[#F4F2EC] shrink-0"
                                                                />
                                                                <div className="min-w-0">
                                                                    <span className="text-xs font-semibold text-[#9A3412] block">
                                                                        {animal?.category?.name || 'Ternak'} &bull;{' '}
                                                                        {animal?.breed || '-'}
                                                                    </span>
                                                                    {animal && !animal.deleted_at ? (
                                                                        <Link
                                                                            href={`/livestock/${animal.id}`}
                                                                            className="text-sm font-bold text-[#1C1917] hover:text-[#1B4332] hover:underline line-clamp-1"
                                                                        >
                                                                            {animal.title}
                                                                        </Link>
                                                                    ) : (
                                                                        <strong className="text-sm font-bold text-[#1C1917] block line-clamp-1">
                                                                            {animal?.title || 'Data Ternak Diarsipkan'}
                                                                        </strong>
                                                                    )}
                                                                    <p className="text-xs text-[#57534E] mt-0.5 tabular-nums">
                                                                        Bobot {animal?.weight_kg ?? '-'} kg &bull; Umur{' '}
                                                                        {animal?.age_months ?? '-'} bln &bull; Qty{' '}
                                                                        {orderItem.quantity} ekor
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="text-xs sm:text-right shrink-0 tabular-nums">
                                                                <span className="text-[#57534E] block">
                                                                    Harga Saat Booking
                                                                </span>
                                                                <strong className="text-sm font-bold text-[#1C1917]">
                                                                    {formatRupiah(orderItem.price_at_purchase)}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E7E5DF] text-xs">
                                                <div className="space-y-1">
                                                    {isBuyer ? (
                                                        <>
                                                            <p className="font-bold text-[#1C1917]">
                                                                Kandang Penjual: {sellerName}
                                                            </p>
                                                            <p className="text-[#57534E]">
                                                                Lokasi Kandang: {order.seller?.city || '-'}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-bold text-[#1C1917]">
                                                                Pembeli: {buyerName}{' '}
                                                                {buyerPhone ? `(${buyerPhone})` : ''}
                                                            </p>
                                                            {isAdmin && (
                                                                <p className="text-[#1B4332] font-semibold">
                                                                    Kandang Mitra: {sellerName} (
                                                                    {order.seller?.city || '-'})
                                                                </p>
                                                            )}
                                                        </>
                                                    )}
                                                    <p className="text-[#57534E] leading-relaxed">
                                                        Alamat Pengiriman: {order.shipping_address}
                                                    </p>
                                                    {order.notes && (
                                                        <p className="text-[#57534E] leading-relaxed">
                                                            Catatan: {order.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:items-end justify-between gap-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {order.payment_proof_url ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewProofOrder(order)}
                                                                className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl bg-[#D8F3DC] hover:bg-[#52B788]/30 border border-[#1B4332] text-[#1B4332] text-xs font-semibold transition-colors cursor-pointer"
                                                            >
                                                                Lihat Bukti Transfer
                                                            </button>
                                                        ) : (
                                                            <span className="px-3 py-2 rounded-lg bg-[#F4F2EC] border border-[#D6D3CB] text-[#57534E] text-xs font-medium">
                                                                Belum ada bukti transfer
                                                            </span>
                                                        )}

                                                        {(isBuyer || isAdmin) &&
                                                            !['cancelled', 'completed'].includes(
                                                                order.order_status
                                                            ) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openPaymentProofModal(order)}
                                                                    className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold transition-colors cursor-pointer"
                                                                >
                                                                    {order.payment_proof_url
                                                                        ? 'Ganti Bukti Transfer'
                                                                        : 'Unggah Bukti Transfer'}
                                                                </button>
                                                            )}

                                                        {isBuyer ? (
                                                            <a
                                                                href={toWhatsAppUrl(
                                                                    sellerPhone,
                                                                    `Halo ${sellerName}, saya menanyakan pesanan #${order.id} (${firstItemTitle}).`
                                                                )}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-[#1C1917] text-xs font-semibold transition-colors"
                                                            >
                                                                WhatsApp Peternak
                                                            </a>
                                                        ) : (
                                                            buyerPhone && (
                                                                <a
                                                                    href={toWhatsAppUrl(
                                                                        buyerPhone,
                                                                        `Halo ${buyerName}, kami dari ${sellerName} menghubungi terkait pesanan Fresh Farm #${order.id}.`
                                                                    )}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-[#1C1917] text-xs font-semibold transition-colors"
                                                                >
                                                                    WhatsApp Pembeli
                                                                </a>
                                                            )
                                                        )}
                                                    </div>

                                                    {isBuyer && order.order_status === 'pending_payment' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCancellingOrder(order)}
                                                            className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border border-[#991B1B] bg-white hover:bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Batalkan Pesanan
                                                        </button>
                                                    )}

                                                    {(isSeller || isAdmin) && (
                                                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
                                                            <label
                                                                htmlFor={`order-status-${order.id}`}
                                                                className="text-xs font-semibold text-[#1C1917]"
                                                            >
                                                                Ubah Status:
                                                            </label>
                                                            <select
                                                                id={`order-status-${order.id}`}
                                                                value={order.order_status}
                                                                disabled={updatingOrderId === order.id}
                                                                onChange={(e) =>
                                                                    handleOrderStatusUpdate(
                                                                        order.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="min-h-11 px-3 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-xs font-semibold text-[#1C1917]"
                                                            >
                                                                <option value="pending_payment">
                                                                    Menunggu Pembayaran
                                                                </option>
                                                                <option value="paid">
                                                                    Pembayaran Terverifikasi (Lunas)
                                                                </option>
                                                                <option value="processing">
                                                                    Disiapkan di Kandang
                                                                </option>
                                                                <option value="shipped">Dalam Pengiriman</option>
                                                                <option value="completed">Selesai Diterima</option>
                                                                <option value="cancelled">Dibatalkan</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}

                                <PaginationBar links={orders.links} />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-[#D6D3CB] p-10 text-center">
                                <h3 className="text-lg font-bold text-[#1C1917] mb-1.5">
                                    Belum Ada Data Pesanan
                                </h3>
                                <p className="text-sm text-[#57534E] max-w-md mx-auto mb-5">
                                    {isBuyer
                                        ? 'Anda belum memiliki riwayat pemesanan hewan ternak pada filter status ini.'
                                        : 'Belum ada transaksi pesanan masuk yang sesuai dengan filter status saat ini.'}
                                </p>
                                {isBuyer && (
                                    <Link
                                        href="/katalog"
                                        className="min-h-11 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-sm font-semibold transition-colors"
                                    >
                                        Pilih Hewan Ternak di Katalog
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: LIVESTOCKS (Seller & Admin) */}
                {activeTab === 'livestocks' && (isSeller || isAdmin) && (
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl border border-[#D6D3CB] p-4 sm:p-5">
                            <form
                                onSubmit={handleLivestockSearchSubmit}
                                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                            >
                                <div className="sm:col-span-5">
                                    <label
                                        htmlFor="inv-search"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Cari Judul atau Ras Hewan
                                    </label>
                                    <input
                                        id="inv-search"
                                        type="text"
                                        value={livestockKeyword}
                                        onChange={(e) => setLivestockKeyword(e.target.value)}
                                        placeholder="Contoh: Limousin, Etawa, Garut..."
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="inv-status"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Filter Status Ketersediaan
                                    </label>
                                    <select
                                        id="inv-status"
                                        value={livestockStatusFilter}
                                        onChange={(e) => setLivestockStatusFilter(e.target.value)}
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="available">Tersedia</option>
                                        <option value="booked">Dipesan (Booked)</option>
                                        <option value="sold">Terjual</option>
                                        <option value="archived">Diarsipkan</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-4 flex flex-wrap items-center gap-2">
                                    <button
                                        type="submit"
                                        className="min-h-11 flex-1 px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Terapkan Filter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResetLivestockSearch}
                                        className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] transition-colors cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                        {livestocks?.data && livestocks.data.length > 0 ? (
                            <>
                                {/* Mobile & Tablet Card List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                                    {livestocks.data.map((item) => {
                                        const primaryImg =
                                            item.images?.[0]?.image_url || '/images/hero-farm.jpg';
                                        const statusStyle =
                                            LIVESTOCK_STATUS_META[item.status] ||
                                            LIVESTOCK_STATUS_META.available;

                                        return (
                                            <article
                                                key={item.id}
                                                className="bg-white rounded-2xl border border-[#D6D3CB] p-4 space-y-3"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={primaryImg}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-20 h-20 rounded-xl object-cover bg-[#F4F2EC] shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#D8F3DC] text-[#1B4332] text-[11px] font-semibold">
                                                            {item.category?.name || 'Ternak'} &bull; {item.breed}
                                                        </span>
                                                        <h3 className="text-sm font-bold text-[#1C1917] mt-1 line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs text-[#57534E] mt-0.5 tabular-nums">
                                                            {item.weight_kg} kg &bull; {item.age_months} bln &bull; Stok{' '}
                                                            {item.stock} ekor
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t border-[#E7E5DF]">
                                                    <strong className="text-base font-bold text-[#1B4332] tabular-nums">
                                                        {formatRupiah(item.price)}
                                                    </strong>
                                                    {isAdmin && item.seller && (
                                                        <span className="text-xs text-[#57534E] truncate max-w-40">
                                                            {item.seller.name}
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`m-status-${item.id}`}
                                                        className="sr-only"
                                                    >
                                                        Status {item.title}
                                                    </label>
                                                    <select
                                                        id={`m-status-${item.id}`}
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            handleQuickLivestockStatus(item.id, e.target.value)
                                                        }
                                                        className={`w-full min-h-11 px-3 py-2 rounded-xl text-xs font-semibold border ${statusStyle.selectClass}`}
                                                    >
                                                        <option value="available">Tersedia</option>
                                                        <option value="booked">Dipesan (Booked)</option>
                                                        <option value="sold">Terjual</option>
                                                        <option value="archived">Diarsipkan</option>
                                                    </select>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditLivestockModal(item)}
                                                        className="min-h-11 px-3 py-2 rounded-xl border border-[#78716C] bg-[#F4F2EC] hover:bg-[#D8F3DC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    {!item.deleted_at ? (
                                                        <Link
                                                            href={`/livestock/${item.id}`}
                                                            className="min-h-11 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917]"
                                                        >
                                                            Lihat
                                                        </Link>
                                                    ) : (
                                                        <span className="min-h-11 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#E7E5DF] text-xs text-[#57534E]">
                                                            Arsip
                                                        </span>
                                                    )}
                                                    {!item.deleted_at ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setArchivingLivestock(item)}
                                                            className="min-h-11 px-3 py-2 rounded-xl border border-[#991B1B] bg-white hover:bg-[#FEE2E2] text-xs font-semibold text-[#991B1B] cursor-pointer"
                                                        >
                                                            Arsipkan
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleQuickLivestockStatus(item.id, 'available')
                                                            }
                                                            className="min-h-11 px-3 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold cursor-pointer"
                                                        >
                                                            Pulihkan
                                                        </button>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden lg:block bg-white rounded-2xl border border-[#D6D3CB] overflow-hidden shadow-xs">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#F4F2EC] border-b border-[#D6D3CB] text-[#1C1917] font-bold">
                                            <tr>
                                                <th className="py-3.5 px-4">Hewan Ternak</th>
                                                <th className="py-3.5 px-4">Kategori &amp; Ras</th>
                                                <th className="py-3.5 px-4">Spesifikasi Fisik</th>
                                                <th className="py-3.5 px-4">Harga Kandang</th>
                                                <th className="py-3.5 px-4">Status Katalog</th>
                                                <th className="py-3.5 px-4 text-right">Aksi Pengelolaan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E7E5DF]">
                                            {livestocks.data.map((item) => {
                                                const primaryImg =
                                                    item.images?.[0]?.image_url || '/images/hero-farm.jpg';
                                                const statusStyle =
                                                    LIVESTOCK_STATUS_META[item.status] ||
                                                    LIVESTOCK_STATUS_META.available;

                                                return (
                                                    <tr key={item.id} className="hover:bg-[#FBFBF9]">
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={primaryImg}
                                                                    alt={item.title}
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="w-14 h-14 rounded-xl object-cover bg-[#F4F2EC] shrink-0"
                                                                />
                                                                <div className="min-w-0">
                                                                    <strong className="text-sm font-bold text-[#1C1917] block line-clamp-1">
                                                                        {item.title}
                                                                    </strong>
                                                                    <span className="text-xs text-[#57534E]">
                                                                        ID #{item.id} &bull;{' '}
                                                                        {item.gender === 'male' ? 'Jantan' : 'Betina'}
                                                                        {isAdmin && item.seller
                                                                            ? ` • ${item.seller.name}`
                                                                            : ''}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            <span className="px-2.5 py-0.5 rounded-md bg-[#D8F3DC] text-[#1B4332] font-semibold inline-block mb-1">
                                                                {item.category?.name || 'Ternak'}
                                                            </span>
                                                            <span className="block text-[#57534E] font-medium">
                                                                {item.breed}
                                                            </span>
                                                        </td>

                                                        <td className="py-3.5 px-4 tabular-nums">
                                                            <strong className="text-[#1C1917] font-bold block">
                                                                {item.weight_kg} kg
                                                            </strong>
                                                            <span className="text-[#57534E]">
                                                                {item.age_months} bln &bull; Stok {item.stock} ekor
                                                            </span>
                                                        </td>

                                                        <td className="py-3.5 px-4 tabular-nums">
                                                            <strong className="text-sm font-bold text-[#1B4332] block">
                                                                {formatRupiah(item.price)}
                                                            </strong>
                                                            <span className="text-[11px] text-[#57534E]">
                                                                {formatRupiah(
                                                                    Math.round(
                                                                        item.price / Math.max(1, item.weight_kg)
                                                                    )
                                                                )}{' '}
                                                                / kg
                                                            </span>
                                                        </td>

                                                        <td className="py-3.5 px-4">
                                                            <label
                                                                htmlFor={`d-status-${item.id}`}
                                                                className="sr-only"
                                                            >
                                                                Status {item.title}
                                                            </label>
                                                            <select
                                                                id={`d-status-${item.id}`}
                                                                value={item.status}
                                                                onChange={(e) =>
                                                                    handleQuickLivestockStatus(
                                                                        item.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className={`min-h-11 px-3 py-2 rounded-xl text-xs font-semibold border ${statusStyle.selectClass}`}
                                                            >
                                                                <option value="available">Tersedia</option>
                                                                <option value="booked">Dipesan (Booked)</option>
                                                                <option value="sold">Terjual</option>
                                                                <option value="archived">Diarsipkan</option>
                                                            </select>
                                                        </td>

                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="inline-flex items-center justify-end gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditLivestockModal(item)}
                                                                    className="min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#F4F2EC] hover:bg-[#D8F3DC] text-[#1C1917] font-semibold transition-colors cursor-pointer"
                                                                >
                                                                    Edit &amp; Foto
                                                                </button>
                                                                {!item.deleted_at && (
                                                                    <Link
                                                                        href={`/livestock/${item.id}`}
                                                                        className="min-h-11 inline-flex items-center px-3.5 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-[#1C1917] font-semibold transition-colors"
                                                                    >
                                                                        Lihat
                                                                    </Link>
                                                                )}
                                                                {!item.deleted_at ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setArchivingLivestock(item)}
                                                                        className="min-h-11 px-3.5 py-2 rounded-xl border border-[#991B1B] bg-white hover:bg-[#FEE2E2] text-[#991B1B] font-semibold transition-colors cursor-pointer"
                                                                    >
                                                                        Arsipkan
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleQuickLivestockStatus(
                                                                                item.id,
                                                                                'available'
                                                                            )
                                                                        }
                                                                        className="min-h-11 px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold transition-colors cursor-pointer"
                                                                    >
                                                                        Pulihkan
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <PaginationBar links={livestocks.links} />
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-[#D6D3CB] p-10 text-center">
                                <h3 className="text-lg font-bold text-[#1C1917] mb-1.5">
                                    Belum Ada Data Hewan Ternak
                                </h3>
                                <p className="text-sm text-[#57534E] max-w-md mx-auto mb-5">
                                    Tidak ditemukan ternak pada pencarian ini, atau kandang Anda belum mendaftarkan ternak ke katalog.
                                </p>
                                <button
                                    type="button"
                                    onClick={openCreateLivestockModal}
                                    className="min-h-11 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    + Tambah Hewan Ternak Baru
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: USERS VERIFICATION (Admin Only) */}
                {activeTab === 'users' && isAdmin && (
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-[#1C1917]">
                                    Verifikasi Mitra Peternak &amp; Daftar Pembeli
                                </h2>
                                <p className="text-xs text-[#57534E] mt-0.5">
                                    Verifikasi akun kandang peternak untuk menampilkan lencana kepercayaan pada listing ternak mereka.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {[
                                    { id: 'all', label: 'Semua Pengguna' },
                                    { id: 'seller', label: 'Mitra Peternak' },
                                    { id: 'unverified', label: 'Belum Diverifikasi' },
                                    { id: 'buyer', label: 'Pembeli' },
                                ].map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setUserFilterRole(f.id)}
                                        aria-pressed={userFilterRole === f.id}
                                        className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                            userFilterRole === f.id
                                                ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                                : 'bg-white border-[#78716C] text-[#1C1917] hover:bg-[#F4F2EC]'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredManagedUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredManagedUsers.map((account) => (
                                    <div
                                        key={account.id}
                                        className="bg-white rounded-2xl border border-[#D6D3CB] p-5 flex flex-col justify-between gap-4"
                                    >
                                        <div>
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                                        account.role === 'seller'
                                                            ? 'bg-[#D8F3DC] text-[#1B4332]'
                                                            : 'bg-[#F4F2EC] text-[#1C1917]'
                                                    }`}
                                                >
                                                    {account.role === 'seller' ? 'Mitra Peternak' : 'Pembeli'}
                                                </span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                                                        account.is_verified
                                                            ? 'bg-[#D8F3DC] text-[#1B4332] border-[#2D6A4F]/40'
                                                            : 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/40'
                                                    }`}
                                                >
                                                    {account.is_verified
                                                        ? 'Terverifikasi'
                                                        : 'Belum Diverifikasi'}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-[#1C1917]">{account.name}</h3>
                                            <p className="text-xs text-[#57534E] mt-0.5">
                                                {account.email} &bull; WA: {account.phone_number || '-'}
                                            </p>
                                            <p className="text-xs text-[#57534E] mt-1">
                                                Kota: {account.city || '-'} &bull; Terdaftar {account.created_at}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-[#E7E5DF] flex flex-wrap items-center justify-between gap-3">
                                            <span className="text-xs font-medium text-[#57534E] tabular-nums">
                                                {account.role === 'seller'
                                                    ? `${account.livestocks_count} ternak • ${account.sales_count} transaksi`
                                                    : `${account.orders_count} pesanan dibuat`}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleToggleUserVerify(account.id)}
                                                className={`min-h-11 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                                    account.is_verified
                                                        ? 'border border-[#78716C] bg-white hover:bg-[#FEE2E2] text-[#991B1B]'
                                                        : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white'
                                                }`}
                                            >
                                                {account.is_verified
                                                    ? 'Cabut Verifikasi'
                                                    : 'Verifikasi Akun'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-[#D6D3CB] p-10 text-center text-sm text-[#57534E]">
                                Tidak ada pengguna yang cocok dengan filter tersebut.
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: MASTER CATEGORIES (Admin Only) */}
                {activeTab === 'categories' && isAdmin && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D6D3CB] p-6">
                            <h2 className="text-lg font-bold text-[#1C1917] mb-1">
                                Tambah Master Kategori Hewan
                            </h2>
                            <p className="text-xs text-[#57534E] mb-5">
                                Kategori digunakan untuk pengelompokan hewan ternak di halaman beranda dan filter katalog.
                            </p>

                            <form onSubmit={handleCreateCategory} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="cat-name"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Nama Kategori Hewan *
                                    </label>
                                    <input
                                        id="cat-name"
                                        type="text"
                                        required
                                        value={categoryCreateForm.data.name}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            categoryCreateForm.setData('name', newName);
                                            const autoKey = getCategoryIconKey(newName);
                                            if (autoKey !== 'lainnya') {
                                                categoryCreateForm.setData((prev) => ({
                                                    ...prev,
                                                    name: newName,
                                                    icon_url: autoKey,
                                                }));
                                            }
                                        }}
                                        placeholder="Contoh: Sapi Limousin, Ayam Broiler, Babi Landrace, Kambing Boer"
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                    {categoryCreateForm.errors.name && (
                                        <p className="text-xs text-[#991B1B] font-medium mt-1">
                                            {categoryCreateForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                                        Foto / Gambar Kategori (Dianjurkan)
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                        <label className="min-h-11 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer shrink-0">
                                            <svg className="w-4 h-4 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Unggah Foto</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCategoryCreateFileChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            value={categoryCreateForm.data.image_url}
                                            onChange={(e) => {
                                                const url = e.target.value;
                                                categoryCreateForm.setData('image_url', url);
                                                if (!categoryCreateForm.data.image) {
                                                    setCategoryCreatePreview(url);
                                                }
                                            }}
                                            placeholder="Atau tautan URL foto gambar..."
                                            className="flex-1 min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                                        />
                                    </div>
                                    {categoryCreatePreview && (
                                        <div className="mt-2.5 flex items-center gap-2.5 p-2 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB]">
                                            <img
                                                src={categoryCreatePreview}
                                                alt="Preview"
                                                className="w-12 h-12 rounded-lg object-cover border border-[#D6D3CB]"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-[#1B4332]">Foto Kategori Terpasang</p>
                                                <p className="text-[11px] text-[#57534E] truncate">Gambar ini akan tampil di beranda &amp; filter katalog</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    categoryCreateForm.setData((prev) => ({ ...prev, image: null, image_url: '' }));
                                                    setCategoryCreatePreview('');
                                                }}
                                                className="text-xs font-semibold text-[#991B1B] hover:underline px-2 py-1 cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="cat-icon"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Ikon Siluet Cadangan (Tampil jika belum ada foto)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-11 h-11 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-[#1B4332] flex items-center justify-center shrink-0 shadow-xs overflow-hidden"
                                            title="Pratinjau tampilan"
                                        >
                                            {categoryCreatePreview ? (
                                                <img src={categoryCreatePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <LivestockCategoryIcon
                                                    slug={categoryCreateForm.data.icon_url || categoryCreateForm.data.name || 'sapi'}
                                                    className="w-6 h-6"
                                                />
                                            )}
                                        </div>
                                        <select
                                            id="cat-icon"
                                            value={categoryCreateForm.data.icon_url}
                                            onChange={(e) => categoryCreateForm.setData('icon_url', e.target.value)}
                                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] cursor-pointer"
                                        >
                                            {CATEGORY_ICON_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={categoryCreateForm.processing}
                                    className="min-h-11 w-full px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    {categoryCreateForm.processing
                                        ? 'Menyimpan Kategori...'
                                        : 'Simpan Kategori Baru'}
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D6D3CB] p-6">
                            <h2 className="text-lg font-bold text-[#1C1917] mb-4">
                                Daftar Kategori Aktif ({categories.length})
                            </h2>

                            {categories.length > 0 ? (
                                <div className="divide-y divide-[#E7E5DF]">
                                    {categories.map((cat) => {
                                        const catImg = getCategoryImageUrl(cat);
                                        return (
                                            <div
                                                key={cat.id}
                                                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-12 h-12 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] overflow-hidden flex items-center justify-center shrink-0">
                                                        {catImg ? (
                                                            <img
                                                                src={catImg}
                                                                alt={cat.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <LivestockCategoryIcon
                                                                slug={cat.icon_url || cat.slug}
                                                                className="w-6 h-6 text-[#1B4332]"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <strong className="text-sm font-bold text-[#1C1917] block">
                                                            {cat.name}
                                                        </strong>
                                                        <span className="text-xs text-[#57534E] tabular-nums">
                                                            Slug: /{cat.slug} &bull; {cat.livestocks_count ?? 0} ternak terdaftar
                                                            {catImg ? ' &bull; Foto aktif' : ' &bull; Ikon siluet'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditCategoryModal(cat)}
                                                        className="min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#F4F2EC] hover:bg-[#D8F3DC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={(cat.livestocks_count ?? 0) > 0}
                                                        onClick={() => setDeletingCategory(cat)}
                                                        title={
                                                            (cat.livestocks_count ?? 0) > 0
                                                                ? 'Kategori yang memiliki ternak tidak dapat dihapus'
                                                                : 'Hapus kategori'
                                                        }
                                                        className="min-h-11 px-3.5 py-2 rounded-xl border border-[#991B1B] bg-white hover:bg-[#FEE2E2] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#991B1B] cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-[#57534E]">Belum ada kategori hewan terdaftar.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: PROFILE (All Roles) */}
                {activeTab === 'profile' && (
                    <div className="max-w-3xl bg-white rounded-2xl border border-[#D6D3CB] p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-[#1C1917] mb-1">
                            {isSeller ? 'Pengaturan Profil Kandang' : 'Pengaturan Profil & Alamat'}
                        </h2>
                        <p className="text-xs text-[#57534E] mb-6">
                            Perbarui kontak WhatsApp dan alamat agar proses koordinasi pengiriman ternak berjalan lancar.
                        </p>

                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="prof-name"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        {isSeller ? 'Nama Kandang / Peternakan *' : 'Nama Lengkap *'}
                                    </label>
                                    <input
                                        id="prof-name"
                                        type="text"
                                        required
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                    {profileForm.errors.name && (
                                        <p className="text-xs text-[#991B1B] mt-1">{profileForm.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="prof-email"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Email Akun (Tetap)
                                    </label>
                                    <input
                                        id="prof-email"
                                        type="email"
                                        disabled
                                        value={currentUser?.email || ''}
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#D6D3CB] bg-[#F4F2EC] text-sm text-[#57534E]"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="prof-phone"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Nomor WhatsApp Aktif *
                                    </label>
                                    <input
                                        id="prof-phone"
                                        type="tel"
                                        required
                                        value={profileForm.data.phone_number}
                                        onChange={(e) => profileForm.setData('phone_number', e.target.value)}
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                    {profileForm.errors.phone_number && (
                                        <p className="text-xs text-[#991B1B] mt-1">
                                            {profileForm.errors.phone_number}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="prof-city"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        Kota / Kabupaten *
                                    </label>
                                    <input
                                        id="prof-city"
                                        type="text"
                                        required
                                        value={profileForm.data.city}
                                        onChange={(e) => profileForm.setData('city', e.target.value)}
                                        className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                    {profileForm.errors.city && (
                                        <p className="text-xs text-[#991B1B] mt-1">{profileForm.errors.city}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="prof-address"
                                        className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                    >
                                        {isSeller ? 'Alamat Lengkap Kandang *' : 'Alamat Pengiriman Utama *'}
                                    </label>
                                    <textarea
                                        id="prof-address"
                                        rows={3}
                                        required
                                        value={profileForm.data.address}
                                        onChange={(e) => profileForm.setData('address', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                    />
                                    {profileForm.errors.address && (
                                        <p className="text-xs text-[#991B1B] mt-1">{profileForm.errors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E7E5DF]">
                                <h3 className="text-sm font-bold text-[#1C1917] mb-1">
                                    Ganti Kata Sandi (Opsional)
                                </h3>
                                <p className="text-xs text-[#57534E] mb-3">
                                    Kosongkan kedua kolom di bawah apabila Anda tidak ingin mengubah kata sandi.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="prof-pass"
                                            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                        >
                                            Kata Sandi Baru
                                        </label>
                                        <input
                                            id="prof-pass"
                                            type="password"
                                            autoComplete="new-password"
                                            value={profileForm.data.password}
                                            onChange={(e) => profileForm.setData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                        />
                                        {profileForm.errors.password && (
                                            <p className="text-xs text-[#991B1B] mt-1">
                                                {profileForm.errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="prof-pass-confirm"
                                            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                                        >
                                            Konfirmasi Kata Sandi Baru
                                        </label>
                                        <input
                                            id="prof-pass-confirm"
                                            type="password"
                                            autoComplete="new-password"
                                            value={profileForm.data.password_confirmation}
                                            onChange={(e) =>
                                                profileForm.setData('password_confirmation', e.target.value)
                                            }
                                            placeholder="Ulangi kata sandi baru"
                                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="min-h-11 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    {profileForm.processing ? 'Menyimpan Perubahan...' : 'Simpan Profil Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* MODAL: CREATE / EDIT LIVESTOCK WITH LOCAL FILE UPLOAD */}
            <AccessibleModal
                isOpen={livestockModalOpen}
                onClose={() => setLivestockModalOpen(false)}
                id="livestock-crud-modal"
                title={
                    editingLivestock
                        ? `Perbarui Data Ternak #${editingLivestock.id}`
                        : 'Tambah Hewan Ternak Baru ke Katalog'
                }
            >
                <form onSubmit={handleLivestockSubmit} className="space-y-4 text-xs">
                    <div>
                        <label htmlFor="lv-title" className="block font-semibold text-[#1C1917] mb-1.5">
                            Nama / Judul Listing Ternak *
                        </label>
                        <input
                            id="lv-title"
                            type="text"
                            required
                            value={livestockForm.title}
                            onChange={(e) =>
                                setLivestockForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Contoh: Sapi Limousin Pejantan 650kg Siap Kurban"
                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lv-category" className="block font-semibold text-[#1C1917] mb-1.5">
                                Kategori Hewan *
                            </label>
                            <select
                                id="lv-category"
                                value={livestockForm.category_id}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, category_id: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="lv-breed" className="block font-semibold text-[#1C1917] mb-1.5">
                                Ras Ternak *
                            </label>
                            <input
                                id="lv-breed"
                                type="text"
                                required
                                value={livestockForm.breed}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, breed: e.target.value }))
                                }
                                placeholder="Contoh: Limousin Cross, Etawa, Garut"
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            />
                        </div>
                    </div>

                    {isAdmin && sellers.length > 0 && !editingLivestock && (
                        <div>
                            <label htmlFor="lv-seller" className="block font-semibold text-[#1C1917] mb-1.5">
                                Pemilik Kandang (Mitra Peternak) *
                            </label>
                            <select
                                id="lv-seller"
                                value={livestockForm.seller_id}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, seller_id: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            >
                                {sellers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.city || 'Lokal'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                            <label htmlFor="lv-gender" className="block font-semibold text-[#1C1917] mb-1.5">
                                Jenis Kelamin *
                            </label>
                            <select
                                id="lv-gender"
                                value={livestockForm.gender}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, gender: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            >
                                <option value="male">Jantan</option>
                                <option value="female">Betina</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="lv-weight" className="block font-semibold text-[#1C1917] mb-1.5">
                                Bobot Hidup (kg) *
                            </label>
                            <input
                                id="lv-weight"
                                type="number"
                                min="1"
                                step="0.1"
                                required
                                value={livestockForm.weight_kg}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, weight_kg: e.target.value }))
                                }
                                placeholder="580"
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            />
                        </div>

                        <div>
                            <label htmlFor="lv-age" className="block font-semibold text-[#1C1917] mb-1.5">
                                Umur (Bulan) *
                            </label>
                            <input
                                id="lv-age"
                                type="number"
                                min="1"
                                required
                                value={livestockForm.age_months}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, age_months: e.target.value }))
                                }
                                placeholder="26"
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lv-price" className="block font-semibold text-[#1C1917] mb-1.5">
                                Harga Jual Kandang (Rp) *
                            </label>
                            <input
                                id="lv-price"
                                type="number"
                                min="100000"
                                required
                                value={livestockForm.price}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, price: e.target.value }))
                                }
                                placeholder="28500000"
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            />
                        </div>

                        <div>
                            <label htmlFor="lv-stock" className="block font-semibold text-[#1C1917] mb-1.5">
                                Jumlah Stok (Ekor) *
                            </label>
                            <input
                                id="lv-stock"
                                type="number"
                                min={editingLivestock ? '0' : '1'}
                                required
                                value={livestockForm.stock}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, stock: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            />
                        </div>
                    </div>

                    {editingLivestock && (
                        <div>
                            <label htmlFor="lv-status" className="block font-semibold text-[#1C1917] mb-1.5">
                                Status Ketersediaan *
                            </label>
                            <select
                                id="lv-status"
                                value={livestockForm.status}
                                onChange={(e) =>
                                    setLivestockForm((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                            >
                                <option value="available">Tersedia di Katalog</option>
                                <option value="booked">Dipesan (Booked)</option>
                                <option value="sold">Terjual</option>
                                <option value="archived">Diarsipkan</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="lv-health" className="block font-semibold text-[#1C1917] mb-1.5">
                            Status Kesehatan &amp; Sertifikasi PMK *
                        </label>
                        <input
                            id="lv-health"
                            type="text"
                            required
                            value={livestockForm.health_status}
                            onChange={(e) =>
                                setLivestockForm((prev) => ({ ...prev, health_status: e.target.value }))
                            }
                            placeholder="Bebas PMK, Vaksin Dosis 2, SKKH Dinas Lengkap"
                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                        />
                    </div>

                    <div className="p-4 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <label htmlFor="lv-photo" className="block font-bold text-[#1C1917]">
                                    Unggah Foto Fisik Hewan (Local Storage)
                                </label>
                                <p className="text-[11px] text-[#57534E]">
                                    Format JPG, PNG, atau WebP (maksimal 4 MB). Gunakan foto asli dari kandang.
                                </p>
                            </div>
                            {photoPreviewUrl && (
                                <img
                                    src={photoPreviewUrl}
                                    alt="Pratinjau foto ternak"
                                    className="w-16 h-16 rounded-xl object-cover border border-[#78716C] bg-white shrink-0"
                                />
                            )}
                        </div>
                        <input
                            id="lv-photo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleLivestockPhotoSelect}
                            className="w-full min-h-11 px-3 py-2 rounded-xl border border-[#78716C] bg-white text-xs text-[#1C1917] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1B4332] file:text-white file:font-semibold"
                        />
                    </div>

                    <div>
                        <label htmlFor="lv-desc" className="block font-semibold text-[#1C1917] mb-1.5">
                            Catatan Pakan &amp; Riwayat Pemeliharaan
                        </label>
                        <textarea
                            id="lv-desc"
                            rows={3}
                            value={livestockForm.description}
                            onChange={(e) =>
                                setLivestockForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Jelaskan pola pakan hijauan/konsentrat, kondisi fisik kaki, dan kesiapan kirim..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                        />
                    </div>

                    <div className="pt-3 border-t border-[#E7E5DF] flex flex-wrap items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setLivestockModalOpen(false)}
                            className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={livestockSubmitting}
                            className="min-h-11 px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            {livestockSubmitting
                                ? 'Menyimpan Data...'
                                : editingLivestock
                                  ? 'Simpan Perubahan'
                                  : 'Tambahkan ke Katalog'}
                        </button>
                    </div>
                </form>
            </AccessibleModal>

            {/* MODAL: CONFIRM ARCHIVE LIVESTOCK */}
            <AccessibleModal
                isOpen={Boolean(archivingLivestock)}
                onClose={() => setArchivingLivestock(null)}
                id="archive-livestock-modal"
                maxWidthClass="max-w-md"
                title="Arsipkan Hewan Ternak?"
            >
                <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                    Hewan ternak <strong className="text-[#1C1917]">{archivingLivestock?.title}</strong> akan disembunyikan dari katalog publik (soft delete), namun riwayat transaksinya tetap tersimpan aman.
                </p>
                <div className="flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={() => setArchivingLivestock(null)}
                        className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={isArchiving}
                        onClick={confirmArchiveLivestock}
                        className="min-h-11 px-5 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                    >
                        {isArchiving ? 'Mengarsipkan...' : 'Ya, Arsipkan'}
                    </button>
                </div>
            </AccessibleModal>

            {/* MODAL: UPLOAD PAYMENT PROOF */}
            <AccessibleModal
                isOpen={Boolean(proofUploadOrder)}
                onClose={() => setProofUploadOrder(null)}
                id="upload-proof-modal"
                maxWidthClass="max-w-lg"
                title={`Unggah Bukti Transfer Pesanan #${proofUploadOrder?.id || ''}`}
            >
                <form onSubmit={submitPaymentProof} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-xs space-y-1">
                        <div className="flex justify-between">
                            <span className="text-[#57534E]">Total Nominal Transfer:</span>
                            <strong className="text-[#1B4332] font-bold tabular-nums">
                                {proofUploadOrder ? formatRupiah(proofUploadOrder.total_amount) : '-'}
                            </strong>
                        </div>
                        <p className="text-[#57534E]">
                            Rekening Bersama Fresh Farm: BCA 8720-1192-88 a.n PT Fresh Farm Ternak Indonesia
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="payment-proof-input"
                            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                        >
                            Pilih Foto Struk / Tangkap Layar Transfer *
                        </label>
                        <input
                            id="payment-proof-input"
                            type="file"
                            required
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleProofFileChange}
                            className="w-full min-h-11 px-3 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1B4332] file:text-white file:font-semibold"
                        />
                        <p className="text-[11px] text-[#57534E] mt-1">
                            Format JPG, PNG, atau WebP, ukuran maksimal 4 MB.
                        </p>
                    </div>

                    {proofPreviewLocal && (
                        <div className="rounded-xl border border-[#D6D3CB] p-2 bg-[#FBFBF9]">
                            <img
                                src={proofPreviewLocal}
                                alt="Pratinjau bukti transfer"
                                className="max-h-64 mx-auto rounded-lg object-contain"
                            />
                        </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={() => setProofUploadOrder(null)}
                            className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isUploadingProof || !proofFile}
                            className="min-h-11 px-5 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                        >
                            {isUploadingProof ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                        </button>
                    </div>
                </form>
            </AccessibleModal>

            {/* MODAL: PREVIEW PAYMENT PROOF */}
            <AccessibleModal
                isOpen={Boolean(previewProofOrder)}
                onClose={() => setPreviewProofOrder(null)}
                id="preview-proof-modal"
                maxWidthClass="max-w-xl"
                title={`Bukti Transfer Pesanan #${previewProofOrder?.id || ''}`}
            >
                {previewProofOrder?.payment_proof_url && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-[#D6D3CB] bg-[#F4F2EC] p-3">
                            <img
                                src={previewProofOrder.payment_proof_url}
                                alt={`Bukti pembayaran pesanan #${previewProofOrder.id}`}
                                className="max-h-[65vh] mx-auto rounded-lg object-contain"
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <a
                                href={previewProofOrder.payment_proof_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-11 inline-flex items-center px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917]"
                            >
                                Buka Gambar Ukuran Penuh
                            </a>
                            {(isSeller || isAdmin) &&
                                previewProofOrder.order_status === 'pending_payment' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const id = previewProofOrder.id;
                                            setPreviewProofOrder(null);
                                            handleOrderStatusUpdate(id, 'paid');
                                        }}
                                        className="min-h-11 px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold cursor-pointer"
                                    >
                                        Verifikasi Pembayaran Lunas
                                    </button>
                                )}
                        </div>
                    </div>
                )}
            </AccessibleModal>

            {/* MODAL: CANCEL ORDER (Buyer) */}
            <AccessibleModal
                isOpen={Boolean(cancellingOrder)}
                onClose={() => setCancellingOrder(null)}
                id="cancel-order-modal"
                maxWidthClass="max-w-md"
                title={`Batalkan Pesanan #${cancellingOrder?.id || ''}?`}
            >
                <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                    Pesanan yang dibatalkan akan melepaskan kunci booking pada hewan ternak sehingga dapat dipesan kembali oleh pembeli lain.
                </p>
                <div className="flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={() => setCancellingOrder(null)}
                        className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer"
                    >
                        Kembali
                    </button>
                    <button
                        type="button"
                        disabled={updatingOrderId === cancellingOrder?.id}
                        onClick={() => handleOrderStatusUpdate(cancellingOrder.id, 'cancelled')}
                        className="min-h-11 px-5 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                    >
                        {updatingOrderId === cancellingOrder?.id
                            ? 'Membatalkan...'
                            : 'Ya, Batalkan Pesanan'}
                    </button>
                </div>
            </AccessibleModal>

            {/* MODAL: EDIT CATEGORY (Admin) */}
            <AccessibleModal
                isOpen={Boolean(editingCategory)}
                onClose={() => setEditingCategory(null)}
                id="edit-category-modal"
                maxWidthClass="max-w-md"
                title="Ubah Master Kategori"
            >
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                    <div>
                        <label
                            htmlFor="edit-cat-name"
                            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                        >
                            Nama Kategori *
                        </label>
                        <input
                            id="edit-cat-name"
                            type="text"
                            required
                            value={editCategoryData.name}
                            onChange={(e) =>
                                setEditCategoryData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                            Foto / Gambar Kategori (Opsional)
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <label className="min-h-11 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-[#78716C] bg-white hover:bg-[#F4F2EC] text-xs font-semibold text-[#1C1917] cursor-pointer shrink-0">
                                <svg className="w-4 h-4 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Ganti Foto</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditCategoryFileChange}
                                    className="sr-only"
                                />
                            </label>
                            <input
                                type="text"
                                value={editCategoryData.image_url}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setEditCategoryData((prev) => ({ ...prev, image_url: url }));
                                    if (!editCategoryData.image) {
                                        setEditCategoryPreview(url);
                                    }
                                }}
                                placeholder="Atau tautan URL foto gambar..."
                                className="flex-1 min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-xs text-[#1C1917]"
                            />
                        </div>
                        {editCategoryPreview && (
                            <div className="mt-2.5 flex items-center gap-2.5 p-2 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB]">
                                <img
                                    src={editCategoryPreview}
                                    alt="Preview"
                                    className="w-12 h-12 rounded-lg object-cover border border-[#D6D3CB]"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#1B4332]">Foto Kategori Terpasang</p>
                                    <p className="text-[11px] text-[#57534E] truncate">Gambar ini akan tampil di beranda &amp; filter katalog</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditCategoryData((prev) => ({ ...prev, image: null, image_url: '' }));
                                        setEditCategoryPreview('');
                                    }}
                                    className="text-xs font-semibold text-[#991B1B] hover:underline px-2 py-1 cursor-pointer"
                                >
                                    Hapus Foto (Gunakan Ikon)
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="edit-cat-icon"
                            className="block text-xs font-semibold text-[#1C1917] mb-1.5"
                        >
                            Ikon Siluet Cadangan (Tampil jika tanpa foto)
                        </label>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-11 h-11 rounded-xl bg-[#F4F2EC] border border-[#D6D3CB] text-[#1B4332] flex items-center justify-center shrink-0 shadow-xs overflow-hidden"
                                title="Pratinjau tampilan"
                            >
                                {editCategoryPreview ? (
                                    <img src={editCategoryPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <LivestockCategoryIcon
                                        slug={editCategoryData.icon_url || editCategoryData.name || 'sapi'}
                                        className="w-6 h-6"
                                    />
                                )}
                            </div>
                            <select
                                id="edit-cat-icon"
                                value={editCategoryData.icon_url}
                                onChange={(e) =>
                                    setEditCategoryData((prev) => ({ ...prev, icon_url: e.target.value }))
                                }
                                className="w-full min-h-11 px-3.5 py-2 rounded-xl border border-[#78716C] bg-[#FBFBF9] text-sm text-[#1C1917] cursor-pointer"
                            >
                                {CATEGORY_ICON_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white text-xs font-semibold text-[#1C1917] cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSavingCategory}
                            className="min-h-11 px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold cursor-pointer"
                        >
                            {isSavingCategory ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </AccessibleModal>

            {/* MODAL: DELETE CATEGORY (Admin) */}
            <AccessibleModal
                isOpen={Boolean(deletingCategory)}
                onClose={() => setDeletingCategory(null)}
                id="delete-category-modal"
                maxWidthClass="max-w-md"
                title="Hapus Kategori Hewan?"
            >
                <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                    Kategori <strong className="text-[#1C1917]">{deletingCategory?.name}</strong> belum memiliki data ternak dan akan dihapus permanen dari daftar master kategori.
                </p>
                <div className="flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={() => setDeletingCategory(null)}
                        className="min-h-11 px-4 py-2 rounded-xl border border-[#78716C] bg-white text-xs font-semibold text-[#1C1917] cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={isSavingCategory}
                        onClick={handleDeleteCategory}
                        className="min-h-11 px-5 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold cursor-pointer"
                    >
                        {isSavingCategory ? 'Menghapus...' : 'Ya, Hapus Kategori'}
                    </button>
                </div>
            </AccessibleModal>
        </AppLayout>
    );
}

