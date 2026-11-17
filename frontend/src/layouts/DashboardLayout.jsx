import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RoleSwitcherBar from './RoleSwitcherBar';
import { useDemoAuth } from '../context/DemoAuthContext';

export default function DashboardLayout() {
  const { activeResidence } = useDemoAuth();

  return (
    <div className="min-h-screen bg-[#F6F5EE] flex flex-col font-sans text-[#18201B]">
      {/* Demo Role Switcher Bar */}
      <RoleSwitcherBar />

      <div className="flex flex-1 min-h-0">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Navbar />

          <main className="flex-1 px-8 py-6 max-w-[1360px] w-full mx-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="px-8 py-4 text-xs text-[#8B968C] flex items-center justify-between border-t border-[#E8E5D3] max-w-[1360px] w-full mx-auto">
            <span>{activeResidence.name} · Espace de gestion</span>
            <span>Données de démonstration · 16 octobre 2026</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

