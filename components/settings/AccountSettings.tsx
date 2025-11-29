'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore, type LinuxDoUser } from '@/lib/store/auth-store';
import { useHistoryStore } from '@/lib/store/history-store';
import { useSearchHistoryStore } from '@/lib/store/search-history-store';

export function AccountSettings() {
    const [isHydrated, setIsHydrated] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const { clearHistory } = useHistoryStore();
    const { clearSearchHistory } = useSearchHistoryStore();

    // Wait for Zustand to hydrate from localStorage
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        const authSuccess = searchParams.get('auth_success');
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        console.log('[AccountSettings] Checking URL params:', {
            authSuccess,
            hasToken: !!token,
            hasUser: !!userStr,
        });

        if (authSuccess && token && userStr) {
            try {
                const userData = JSON.parse(userStr) as LinuxDoUser;
                console.log('[AccountSettings] Parsed user data:', {
                    id: userData.id,
                    username: userData.username,
                });

                clearHistory();
                clearSearchHistory();
                login(userData, token);

                console.log('[AccountSettings] Login complete, redirecting...');
                router.replace('/settings');
            } catch (e) {
                console.error('[AccountSettings] Failed to parse user data:', e);
            }
        }
    }, [searchParams, login, clearHistory, clearSearchHistory, router]);

    const handleLogin = () => {
        clearHistory();
        clearSearchHistory();
        router.push('/api/oauth/authorize');
    };

    const handleLogout = () => {
        logout();
        clearHistory();
        clearSearchHistory();
    };

    // Don't render until hydrated to prevent flash
    if (!isHydrated) {
        return (
            <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-[var(--glass-border)]">
                    <svg className="w-6 h-6 text-[var(--accent-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <h2 className="text-xl font-semibold text-[var(--text-color)]">账号</h2>
                </div>
                <div className="p-6 rounded-[var(--radius-2xl)] bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl">
                    <div className="flex items-center justify-center text-[var(--text-color-secondary)]">加载中...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-[var(--glass-border)]">
                <svg className="w-6 h-6 text-[var(--accent-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <h2 className="text-xl font-semibold text-[var(--text-color)]">账号</h2>
            </div>

            <div className="p-6 rounded-[var(--radius-2xl)] bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl shadow-[var(--shadow-md)]">
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-[var(--text-color-secondary)]">登录 Linux DO 以同步您的账号信息</p>
                        <button
                            onClick={handleLogin}
                            className="px-6 py-3 rounded-[var(--radius-2xl)] bg-[var(--accent-color)] text-white font-semibold hover:brightness-110 transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-95"
                        >
                            使用 Linux DO 登录
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.avatar_template.replace('{size}', '100')}
                                alt={user?.name || user?.username}
                                className="w-16 h-16 rounded-[var(--radius-full)] border-2 border-[var(--glass-border)]"
                            />
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-color)]">{user?.name || user?.username}</h3>
                                <p className="text-[var(--text-color-secondary)]">@{user?.username}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-3 py-1 text-xs font-medium rounded-[var(--radius-full)] bg-[var(--accent-color)] text-white">
                                        Trust Level {user?.trust_level}
                                    </span>
                                    {user?.active && (
                                        <span className="px-3 py-1 text-xs font-medium rounded-[var(--radius-full)] bg-green-500/20 text-green-600 border border-green-500/30">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--glass-border)]">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-[var(--radius-2xl)] transition-colors font-medium"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
