import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDemoAuth, ROLES } from '../context/DemoAuthContext';
import {
  LayoutGrid,
  Building,
  Users,
  Receipt,
  CreditCard,
  Wrench,
  FileCheck,
  FolderClosed,
  Megaphone,
  UserCheck,
  ChevronDown,
  MessageSquare,
  Sliders,
  LogOut,
  Home,
  ClipboardList,
  Calendar,
} from 'lucide-react';

export default function Sidebar() {
  const { role, currentUser, activeResidence } = useDemoAuth();

  // Navigation structure based on active role
  const getNavSections = () => {
    if (role === ROLES.SYNDIC) {
      return {
        title: 'GESTION DE LA RÉSIDENCE',
        items: [
          { name: "Vue d'ensemble", path: '/', icon: LayoutGrid },
          { name: 'Appartements', path: '/apartments', icon: Building },
          { name: 'Propriétaires', path: '/owners', icon: Users },
          { name: 'Charges', path: '/fees', icon: Receipt },
          { name: 'Paiements', path: '/payments', icon: CreditCard },
          { name: 'Interventions', path: '/interventions', icon: Wrench, badge: 8 },
          { name: 'Autorisations', path: '/authorizations', icon: FileCheck },
          { name: 'Documents', path: '/documents', icon: FolderClosed },
          { name: 'Annonces', path: '/announcements', icon: Megaphone },
          { name: 'Personnel', path: '/staff', icon: UserCheck },
        ],
      };
    }

    if (role === ROLES.OWNER) {
      return {
        title: 'MON ESPACE',
        items: [
          { name: "Vue d'ensemble", path: '/', icon: LayoutGrid },
          { name: 'Mon appartement', path: '/my-apartment', icon: Home },
          { name: 'Mes charges', path: '/my-fees', icon: Receipt },
          { name: 'Mes paiements', path: '/my-payments', icon: CreditCard },
          { name: 'Mes demandes', path: '/my-requests', icon: ClipboardList },
          { name: 'Documents', path: '/documents', icon: FolderClosed },
          { name: 'Annonces', path: '/announcements', icon: Megaphone },
        ],
      };
    }

    // EMPLOYEE
    return {
      title: 'ESPACE PERSONNEL',
      items: [
        { name: "Vue d'ensemble", path: '/', icon: LayoutGrid },
        { name: 'Interventions assignées', path: '/assigned-tasks', icon: Wrench, badge: 4 },
        { name: 'Planning de travail', path: '/schedule', icon: Calendar },
        { name: 'Résidence & Contacts', path: '/building-info', icon: Building },
        { name: 'Documents', path: '/documents', icon: FolderClosed },
        { name: 'Annonces', path: '/announcements', icon: Megaphone },
      ],
    };
  };

  const navSection = getNavSections();

  return (
    <aside className="w-64 bg-[#ECEAE0] border-r border-[#E2DFC9] flex flex-col justify-between h-screen sticky top-0 shrink-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E392A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Building size={18} className="text-emerald-300" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#18201B]">
              habita
            </span>
          </div>
        </div>

        {/* Residence Selector Card */}
        <div className="px-4 py-2">
          <div className="text-[11px] font-semibold tracking-wider text-[#79857A] mb-1.5 uppercase">
            Votre résidence
          </div>
          <div className="bg-white/90 border border-[#DDD9C5] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-subtle">
            <div>
              <div className="font-semibold text-sm text-[#18201B]">
                {activeResidence.name}
              </div>
              <div className="text-xs text-[#6F7B70]">
                {role === ROLES.OWNER
                  ? `Casablanca · Appartement ${currentUser.apartmentUnit}`
                  : activeResidence.address}
              </div>
            </div>
            <ChevronDown size={16} className="text-[#8B968C]" />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 pt-4">
          <div className="text-[10px] font-semibold tracking-wider text-[#79857A] px-2 mb-2 uppercase">
            {navSection.title}
          </div>

          <nav className="space-y-0.5">
            {navSection.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${isActive
                    ? 'bg-[#1E392A] text-white font-medium shadow-sm'
                    : 'text-[#48544A] hover:bg-[#E1DEC8] hover:text-[#18201B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={17}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={isActive ? 'text-white' : 'text-[#637063]'}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-xs px-1.5 py-0.2 rounded-full font-medium ${isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#DDD9C5] text-[#344036]'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3">

        {/* Account Settings */}
        <button className="w-full flex items-center gap-2.5 px-2 py-1 text-xs text-[#525F54] hover:text-[#18201B] transition-colors">
          <Sliders size={15} />
          <span>Paramètres du compte</span>
        </button>

        {/* User Card */}
        <div className="pt-2 border-t border-[#DDD9C5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E392A] text-white flex items-center justify-center font-bold text-xs tracking-wider">
              {currentUser.initials}
            </div>
            <div>
              <div className="font-semibold text-xs text-[#18201B] leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-[#6F7B70]">
                {currentUser.subtitle}
              </div>
            </div>
          </div>

          <button
            title="Déconnexion (Démonstration)"
            className="text-[#7F8B80] hover:text-[#18201B] p-1 rounded-md transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

