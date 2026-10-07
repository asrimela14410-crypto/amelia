'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginFormClientProps {
  doorpass: string;
  loginAction: (formData: FormData) => Promise<void>;
}

export default function LoginFormClient({
  doorpass,
  loginAction,
}: LoginFormClientProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsSubmitting(true);
        await loginAction(formData);
        setIsSubmitting(false);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="doorpass" value={doorpass} />

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
        >
          Email Admin
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@gmail.com"
            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Password
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="Ketik password akun..."
            className="w-full pl-10 pr-11 py-2.5 border border-slate-300 dark:border-slate-700 dark:bg-slate-800/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
          Gunakan tombol ikon mata untuk memastikan password tidak ada typo atau spasi.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Memverifikasi Akun Admin...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Panel Admin</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
