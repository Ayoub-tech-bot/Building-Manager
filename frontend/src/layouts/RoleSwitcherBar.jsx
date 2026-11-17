import React from 'react';
import { useDemoAuth, ROLES } from '../context/DemoAuthContext';
import { ShieldAlert, UserCheck, Users, Wrench } from 'lucide-react';

export default function RoleSwitcherBar() {
  const { role, setRole } = useDemoAuth();

  return (
    <div className="bg-[#1E392A] text-white text-xs px-4 py-2 flex items-center justify-between border-b border-white/10 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/15 text-emerald-200 font-semibold tracking-wider text-[10px] uppercase">
          <ShieldAlert size={12} /> Mode Démonstration
        </span>
        <span className="text-white/80 hidden sm:inline">
          Sélectionnez le rôle pour prévisualiser son tableau de bord et sa navigation :
        </span>
      </div>

      <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-lg">
        <button
          onClick={() => setRole(ROLES.SYNDIC)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            role === ROLES.SYNDIC
              ? 'bg-white text-[#1E392A] shadow-sm font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users size={13} />
          <span>SYNDIC</span>
        </button>

        <button
          onClick={() => setRole(ROLES.OWNER)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            role === ROLES.OWNER
              ? 'bg-white text-[#1E392A] shadow-sm font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserCheck size={13} />
          <span>PROPRIÉTAIRE</span>
        </button>

        <button
          onClick={() => setRole(ROLES.EMPLOYEE)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            role === ROLES.EMPLOYEE
              ? 'bg-white text-[#1E392A] shadow-sm font-semibold'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Wrench size={13} />
          <span>PERSONNEL</span>
        </button>
      </div>
    </div>
  );
}

