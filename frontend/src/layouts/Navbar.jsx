import React from 'react';
import { useDemoAuth, ROLES } from '../context/DemoAuthContext';
import { Calendar } from 'lucide-react';

export default function Navbar({ title, breadcrumb }) {
  const { role, currentUser } = useDemoAuth();

  const getDefaultBreadcrumb = () => {
    if (breadcrumb) return breadcrumb;
    if (role === ROLES.SYNDIC) return 'Administration / Vue d\'ensemble';
    if (role === ROLES.OWNER) return 'Espace propriétaire / Vue d\'ensemble';
    return 'Espace personnel / Vue d\'ensemble';
  };

  return (
    <header className="px-8 py-4 flex items-center justify-between border-b border-[#E2DFC9]/60 bg-[#F6F5EE]">
      {/* Breadcrumb */}
      <div className="text-xs font-medium text-[#79857A]">
        {getDefaultBreadcrumb()}
      </div>

      {/* Right meta: Date & Role badge */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-[#657166]">
          <Calendar size={14} className="text-[#849185]" />
          <span>Vendredi 16 octobre 2026</span>
        </div>

        <div className="px-2.5 py-0.5 rounded-full border border-[#D5D1BD] bg-white/70 text-[#3C473E] font-medium text-[11px]">
          {currentUser.roleLabel}
        </div>
      </div>
    </header>
  );
}

