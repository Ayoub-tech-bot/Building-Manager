import React from 'react';
import { useDemoAuth, ROLES } from '../../context/DemoAuthContext';
import SyndicDashboard from './SyndicDashboard';
import OwnerDashboard from './OwnerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

export default function DashboardDispatcher() {
  const { role } = useDemoAuth();

  switch (role) {
    case ROLES.SYNDIC:
      return <SyndicDashboard />;
    case ROLES.OWNER:
      return <OwnerDashboard />;
    case ROLES.EMPLOYEE:
      return <EmployeeDashboard />;
    default:
      return <SyndicDashboard />;
  }
}

