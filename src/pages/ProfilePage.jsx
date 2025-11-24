import React, { useEffect, useState, useMemo } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/imageUtils';
import steamAILogo from '../img/logo.png';
import { authorize, getUserInfo, getSetting, getAccessToken } from 'zmp-sdk/apis';
import { initToken } from '../constants/api';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarError, setAvatarError] = useState(false);
    const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

    // Cache avatar URL để tránh re-compute mỗi lần render
    const avatarUrl = useMemo(() => {
        if (avatarError || !user?.avatar_url) {
            return '/img/default-avatar.png';
        }
        return getImageUrl(user.avatar_url) || '/img/default-avatar.png';
    }, [user?.avatar_url, avatarError]);

    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Bước 1: Khởi tạo token trước
                await initToken();
                const token = await getAccessToken();
                console.log('🔑 [ProfilePage] Token initialized:', token ? 'Available' : 'Missing');

                // Bước 2: Lấy dữ liệu từ session API (không cần quyền userInfo)
                let sessionData = null;
                try {
                    sessionData = await ApiServices.callSessionAPI();
                    console.log('📊 [ProfilePage] Session data:', sessionData);
                } catch (err) {
                    console.warn('⚠️ [ProfilePage] Session API failed:', err);
                }

                // Bước 3: Kiểm tra và xin quyền userInfo (nếu cần)
                // Chỉ xin quyền 1 lần trong session này để tránh hỏi lại liên tục
                let zaloUserInfo = null;
                try {
                    const settings = await getSetting();
                    console.log('🔐 [ProfilePage] All settings:', settings);
                    // Permission nằm trong settings.authSetting, không phải settings trực tiếp
                    const hasUserInfoPermission = settings?.authSetting?.['scope.userInfo'] === true;
                    console.log('🔐 [ProfilePage] Current permission status:', hasUserInfoPermission);
                    console.log('🔐 [ProfilePage] Has requested permission in this session:', hasRequestedPermission);

                    if (!hasUserInfoPermission && !hasRequestedPermission) {
                        console.log('🔐 [ProfilePage] Requesting user info permission...');
                        setHasRequestedPermission(true); // Đánh dấu đã hỏi rồi
                        try {
                            const authResult = await authorize({
                                scopes: ['scope.userInfo']
                            });
                            console.log('🔐 [ProfilePage] Authorization result:', authResult);
                            
                            if (authResult['scope.userInfo'] === true) {
                                // Sau khi có quyền, gọi lại getAccessToken
                                console.log('🔄 [ProfilePage] Refreshing token after permission granted...');
                                await initToken();
                                const newToken = await getAccessToken();
                                console.log('🔑 [ProfilePage] New token after permission:', newToken ? 'Available' : 'Missing');
                                
                                // Đợi một chút để Zalo sync permission và token
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                
                                // Nếu authResult đã confirm permission, không cần check lại, lấy user info luôn
                                console.log('✅ [ProfilePage] Permission granted, getting user info immediately...');
                                try {
                                    zaloUserInfo = await getUserInfo();
                                    console.log('✅ [ProfilePage] Zalo user info after authorize:', zaloUserInfo);
                                    
                                    // Đánh dấu đã có zaloUserInfo để ưu tiên khi map dữ liệu
                                    if (zaloUserInfo?.userInfo) {
                                        console.log('✅ [ProfilePage] Successfully got Zalo user info, will merge with session data');
                                    }
                                } catch (getUserInfoErr) {
                                    console.warn('⚠️ [ProfilePage] getUserInfo failed after authorize, will use session data:', getUserInfoErr);
                                    // Tiếp tục với session API nếu getUserInfo fail
                                }
                            } else {
                                // User từ chối, không hỏi lại nữa
                                console.log('⚠️ [ProfilePage] User denied permission');
                            }
                        } catch (authErr) {
                            console.warn('⚠️ [ProfilePage] Permission denied or error:', authErr);
                            // Tiếp tục với session API nếu user từ chối
                        }
                    } else if (hasUserInfoPermission) {
                        // Đã có quyền, lấy thông tin trực tiếp
                        console.log('✅ [ProfilePage] Permission already granted, getting user info...');
                        try {
                            zaloUserInfo = await getUserInfo();
                            console.log('✅ [ProfilePage] Zalo user info:', zaloUserInfo);
                        } catch (getUserInfoErr) {
                            console.warn('⚠️ [ProfilePage] getUserInfo failed:', getUserInfoErr);
                            // Tiếp tục với session API nếu getUserInfo fail
                        }
                    } else {
                        // Đã hỏi rồi nhưng không có quyền, không hỏi lại
                        console.log('⚠️ [ProfilePage] Permission already requested in this session, skipping...');
                    }
                } catch (err) {
                    console.warn('⚠️ [ProfilePage] Could not get Zalo user info:', err);
                    // Tiếp tục với session API
                }

                // Bước 4: Kết hợp dữ liệu từ Zalo SDK và Session API
                let userData = {
                    name: 'Người dùng',
                    id: '',
                    avatar_url: null,
                    phone_number: '',
                    app_user_id: ''
                };

                // Kiểm tra cấu trúc sessionData: từ log, dữ liệu nằm trong sessionData.data trực tiếp
                const sessionUser = sessionData?.data || null;
                console.log('📋 [ProfilePage] Session user extracted:', sessionUser);
                console.log('📋 [ProfilePage] Session user name:', sessionUser?.name);
                console.log('📋 [ProfilePage] Session user id:', sessionUser?.id);

                if (sessionUser) {
                    // Ưu tiên dữ liệu từ Zalo SDK, fallback về session API
                    userData = {
                        name: zaloUserInfo?.userInfo?.name || sessionUser.name || 'Người dùng',
                        id: sessionUser.id || zaloUserInfo?.userInfo?.id || '',
                        avatar_url: zaloUserInfo?.userInfo?.avatar || sessionUser.picture?.data?.url || sessionUser.avatar_url || null,
                        phone_number: sessionUser.phone_number || '',
                        app_user_id: sessionUser.id || zaloUserInfo?.userInfo?.id || ''
                    };
                    console.log('✅ [ProfilePage] User data mapped from session:', userData);
                } else if (zaloUserInfo) {
                    // Nếu không có session data nhưng có Zalo user info
                    userData = {
                        name: zaloUserInfo?.userInfo?.name || 'Người dùng',
                        id: zaloUserInfo?.userInfo?.id || '',
                        avatar_url: zaloUserInfo?.userInfo?.avatar || null,
                        phone_number: '',
                        app_user_id: zaloUserInfo?.userInfo?.id || ''
                    };
                    console.log('✅ [ProfilePage] Using Zalo user info only:', userData);
                } else {
                    // Fallback: Thử lấy từ getStudentRegistrations
                    console.log('⚠️ [ProfilePage] No session/Zalo data, trying getStudentRegistrations...');
                    try {
                        const res = await ApiServices.getStudentRegistrations();
                        const first = res.data && res.data.length > 0 ? res.data[0].app_user : null;
                        if (first) {
                            userData = first;
                            console.log('✅ [ProfilePage] Using student registration data:', userData);
                        }
                    } catch (err) {
                        console.warn('⚠️ [ProfilePage] getStudentRegistrations failed:', err);
                    }
                }

                console.log('✅ [ProfilePage] Final userData before setting:', userData);
                setUser(userData);
                setAvatarError(false);
                console.log('✅ [ProfilePage] User state set, setting loading to false');
            } catch (err) {
                console.error('❌ [ProfilePage] Error loading user data:', err);
                setUser({
                    name: 'Người dùng',
                    id: '',
                    avatar_url: null,
                    phone_number: '',
                    app_user_id: ''
                });
                setError('Không thể tải thông tin tài khoản');
            } finally {
                console.log('🔄 [ProfilePage] Finally block: setting loading to false');
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
            {/* Header với logo STEAM AI (giống HomePage) */}
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-400 rounded-b-3xl shadow-lg p-2 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300 rounded-full blur-3xl opacity-40"></div>
                
                <div className="flex flex-col items-center relative z-10">
                    {/* STEAM AI Logo */}
                    <div className="mt-2 mb-2">
                        <img 
                            src={steamAILogo} 
                            alt="STEAM AI Logo" 
                            className="h-32 w-full object-contain drop-shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Card thông tin tài khoản - gộp avatar, tên và thông tin */}
            <div className="flex-1 flex flex-col items-center mt-4 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">
                    {/* Loading state */}
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-gray-500 text-sm mt-3">Đang tải thông tin...</span>
                        </div>
                    ) : (
                        <>
                            {/* Avatar và Tên - luôn hiển thị */}
                            <div className="flex flex-col items-center pb-5 border-b border-gray-100">
                                {/* Avatar - luôn hiển thị, dùng default nếu không có */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-lg opacity-20"></div>
                                    <img
                                        src={avatarUrl}
                                        alt={user?.name || 'Người dùng'}
                                        className="relative w-24 h-24 rounded-full border-3 border-blue-100 shadow-md object-cover bg-white"
                                        onError={(e) => {
                                            // Chỉ set error state 1 lần để tránh loop
                                            if (!avatarError && e.target.src !== '/img/default-avatar.png') {
                                                setAvatarError(true);
                                                e.target.src = '/img/default-avatar.png';
                                            }
                                        }}
                                        onLoad={() => {
                                            // Reset error state khi ảnh load thành công
                                            if (avatarError) {
                                                setAvatarError(false);
                                            }
                                        }}
                                    />
                                </div>
                                
                                {/* Tên học viên */}
                                <div className="font-bold text-xl text-gray-800 text-center mb-1">
                                    {user?.name || 'Người dùng'}
                                </div>
                            </div>

                            {/* ID Card - luôn hiển thị */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-gray-500 font-medium mb-1">ID Người dùng</div>
                                    <div className="text-base font-semibold text-gray-600 break-all">
                                        {user?.app_user_id || user?.id || 'Chưa có ID'}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Card (nếu có) */}
                            {user?.phone_number && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                    <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-gray-500 font-medium mb-1">Số điện thoại</div>
                                        <div className="text-base font-semibold text-gray-900">
                                            {user.phone_number}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error message - hiển thị bên dưới nếu có */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-red-600 text-sm font-medium flex-1">{error}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
} 