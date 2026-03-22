'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { WAREHOUSES } from '@/lib/constants';
import { Button } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#101920] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E52629] rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">O</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold">Optimera Tilhengerutleie</h1>
              <p className="text-gray-400 text-sm">
                Innlogget som <span className="text-white font-medium">{user?.username}</span>
                {' '}({user?.role})
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            Logg ut
          </button>
        </div>

        {/* Admin Dashboard */}
        <div className="mb-6">
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Administrasjon</h2>
          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-5 text-left transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">Admin Dashboard</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Flateoversikt, utleier, service, verksted, rapporter
                </p>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="group-hover:stroke-white transition-colors">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>

        {/* Terminal per butikk */}
        <div className="mb-6">
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Terminal — Velg butikk</h2>
          <div className="grid grid-cols-1 gap-3">
            {WAREHOUSES.map((wh) => (
              <button
                key={wh.code}
                onClick={() => {
                  localStorage.setItem('selected_warehouse', wh.code);
                  router.push('/terminal');
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-4 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E52629]/20 rounded-lg flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E52629" strokeWidth="2">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path d="M3 17h2m4 0h8m4 0h2M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{wh.name}</h3>
                      <p className="text-gray-500 text-sm">{wh.code} — {wh.fleetSize} tilhengere</p>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" className="group-hover:stroke-white transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hurtiglenker */}
        <div>
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Hurtiglenker</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/admin/fleet')}
              className="bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-4 text-left transition-colors"
            >
              <p className="text-white text-sm font-medium">Flateoversikt</p>
              <p className="text-gray-500 text-xs mt-0.5">Alle tilhengere</p>
            </button>
            <button
              onClick={() => router.push('/admin/fleet/service')}
              className="bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-4 text-left transition-colors"
            >
              <p className="text-white text-sm font-medium">Service</p>
              <p className="text-gray-500 text-xs mt-0.5">Vedlikeholdsstatus</p>
            </button>
            <button
              onClick={() => router.push('/admin/rentals')}
              className="bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-4 text-left transition-colors"
            >
              <p className="text-white text-sm font-medium">Utleier</p>
              <p className="text-gray-500 text-xs mt-0.5">Aktive og historikk</p>
            </button>
            <button
              onClick={() => router.push('/admin/reports')}
              className="bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl p-4 text-left transition-colors"
            >
              <p className="text-white text-sm font-medium">Rapporter</p>
              <p className="text-gray-500 text-xs mt-0.5">Statistikk og KPI</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs">
            Optimera Tilhengerutleie v1.1 — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
