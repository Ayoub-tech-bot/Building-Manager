import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  SYNDIC: 'SYNDIC',
  OWNER: 'OWNER',
  EMPLOYEE: 'EMPLOYEE',
};

const DEMO_USERS = {
  [ROLES.SYNDIC]: {
    id: 'syndic-demo-id',
    name: 'Nora Alaoui',
    initials: 'NA',
    role: ROLES.SYNDIC,
    roleLabel: 'Syndic',
    subtitle: 'Équipe syndic',
    email: 'nora.alaoui@habita.ma',
    phone: '05 22 44 18 60',
    hours: 'Lun-ven · 9 h-17 h',
  },
  [ROLES.OWNER]: {
    id: 'owner-demo-id',
    name: 'Karim El Amrani',
    initials: 'KE',
    role: ROLES.OWNER,
    roleLabel: 'Propriétaire',
    subtitle: 'Propriétaire',
    email: 'karim.amrani@gmail.com',
    apartmentUnit: 'A-12',
    residenceName: 'Les Oliviers',
    building: 'Bâtiment A',
    floor: '2e étage',
    sizeM2: 86,
    sinceDate: '1er août 2026',
  },
  [ROLES.EMPLOYEE]: {
    id: 'employee-demo-id',
    name: 'Rachid Bennani',
    initials: 'RB',
    role: ROLES.EMPLOYEE,
    roleLabel: 'Personnel',
    subtitle: 'Agent de maintenance',
    email: 'rachid.b@habita.ma',
    department: 'Maintenance & Sécurité',
  },
};

const DEMO_RESIDENCE = {
  id: 1,
  name: 'Les Oliviers',
  city: 'Casablanca',
  apartmentCount: 48,
  address: 'Casablanca · 48 appartements',
};

const DemoAuthContext = createContext(null);

export function DemoAuthProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('habita_demo_role') || ROLES.SYNDIC;
  });

  const [activeResidence] = useState(DEMO_RESIDENCE);

  useEffect(() => {
    localStorage.setItem('habita_demo_role', role);
  }, [role]);

  const setRole = (newRole) => {
    if (Object.values(ROLES).includes(newRole)) {
      setRoleState(newRole);
    }
  };

  const currentUser = DEMO_USERS[role] || DEMO_USERS[ROLES.SYNDIC];

  return (
    <DemoAuthContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        activeResidence,
        ROLES,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}

