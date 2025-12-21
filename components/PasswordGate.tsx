'use client';

import { useState, useEffect } from 'react';
import { settingsStore } from '@/lib/store/settings-store';
import { Lock } from 'lucide-react';
import { verifyEnvPassword, isEnvPasswordRequired } from '@/lib/actions/auth';

const ACCESS_GRANTED_KEY = 'kvideo-access-granted';

export function PasswordGate({ children }: { children: React.ReactNode }) {
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        checkLockStatus();
    }, []);

    const checkLockStatus = async () => {
        const isAccessGranted = localStorage.getItem(ACCESS_GRANTED_KEY) === 'true';
        if (isAccessGranted) {
            setIsLocked(false);
            setLoading(false);
            return;
        }

        const envRequired = await isEnvPasswordRequired();
        const settings = settingsStore.getSettings();

        if (!envRequired && !settings.passwordAccess) {
            setIsLocked(false);
        } else {
            setIsLocked(true);
        }
        setLoading(false);
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Check against ENV password first
        const isEnvValid = await verifyEnvPassword(password);
        if (isEnvValid) {
            localStorage.setItem(ACCESS_GRANTED_KEY, 'true');
            setIsLocked(false);
            setError(false);
            setLoading(false);
            return;
        }

        // Check against local settings passwords
        const settings = settingsStore.getSettings();
        if (settings.accessPasswords.includes(password)) {
            localStorage.setItem(ACCESS_GRANTED_KEY, 'true');
            setIsLocked(false);
            setError(false);
            setLoading(false);
            return;
        }

        // Invalid password
        setError(true);
        setLoading(false);
        // Shake animation trigger
        const form = document.getElementById('password-form');
        form?.classList.add('animate-shake');
        setTimeout(() => form?.classList.remove('animate-shake'), 500);
    };

    if (!isClient || loading) return null; // Prevent hydration mismatch and show nothing while checking

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-color)] bg-[image:var(--bg-image)] text-[var(--text-color)]">
            <div className="w-full max-w-md p-4">
                <form
                    id="password-form"
                    onSubmit={handleUnlock}
                    className="bg-[var(--glass-bg)] backdrop-blur-[25px] saturate-[180%] border border-[var(--glass-border)] rounded-[var(--radius-2xl)] p-8 shadow-[var(--shadow-md)] flex flex-col items-center gap-6 transition-all duration-[0.4s] cubic-bezier(0.2,0.8,0.2,1)"
                >
                    <div className="w-16 h-16 rounded-[var(--radius-full)] bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] mb-2 shadow-[var(--shadow-sm)] border border-[var(--glass-border)]">
                        <Lock size={32} />
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">访问受限</h2>
                        <p className="text-[var(--text-color-secondary)]">请输入访问密码以继续</p>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                placeholder="输入密码..."
                                className={`w-full px-4 py-3 rounded-[var(--radius-2xl)] bg-[var(--glass-bg)] border ${error ? 'border-red-500' : 'border-[var(--glass-border)]'
                                    } focus:outline-none focus:border-[var(--accent-color)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent-color)_30%,transparent)] transition-all duration-[0.4s] cubic-bezier(0.2,0.8,0.2,1) text-[var(--text-color)] placeholder-[var(--text-color-secondary)]`}
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-red-500 text-center animate-pulse">
                                    密码错误
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[var(--accent-color)] text-white font-bold rounded-[var(--radius-2xl)] hover:translate-y-[-2px] hover:brightness-110 shadow-[var(--shadow-sm)] hover:shadow-[0_4px_8px_var(--shadow-color)] active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? '正在验证...' : '解锁访问'}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
        </div>
    );
}
