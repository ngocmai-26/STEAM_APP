import React, { useEffect, useState } from 'react';
import { ApiServices } from '../services/ApiServices';
import Footer from '../components/Footer';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        ApiServices.getStudentRegistrations()
            .then(res => {
                const first = res.data && res.data.length > 0 ? res.data[0].app_user : null;
                setUser(first);
                setLoading(false);
            })
            .catch(() => {
                setError('Không thể tải thông tin tài khoản');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#e0fcff] pb-24">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md relative flex flex-col items-center">
                    {/* Avatar nổi lên trên card */}
                    <div className="absolute left-1/2 -top-14 transform -translate-x-1/2 z-20">
                        <img
                            src={user?.avatar_url || '/img/default-avatar.png'}
                            alt={user?.name}
                            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                        />
                    </div>
                    {/* Card thông tin */}
                    <div className="mt-16 bg-white rounded-2xl shadow-2xl px-6 py-8 flex flex-col gap-4 w-full relative z-10 items-center">
                        {/* Tên và chức danh */}
                        <div className="font-extrabold text-xl text-purple-700 text-center mb-1">{user?.name || 'Tên học viên'}</div>
                        {/* ID */}
                        <div className="w-full">
                            <label className="block text-xs text-gray-500 mb-1">ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user?.app_user_id || ''}
                                    readOnly
                                    className="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none"
                                    placeholder="ID"
                                />
                            </div>
                        </div>
                        {/* Phone */}
                        <div className="w-full">
                            <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user?.phone_number || ''}
                                    readOnly
                                    className="w-full bg-gray-100 rounded-lg py-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none"
                                    placeholder="Phone Number"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75v10.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V6.75m-19.5 0A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    {loading && <div className="text-gray-500 mt-4">Đang tải...</div>}
                    {error && <div className="text-red-500 mt-4">{error}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
} 