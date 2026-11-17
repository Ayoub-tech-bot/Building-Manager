import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardDispatcher from '../pages/dashboards/DashboardDispatcher';
import OwnerDashboard from '../pages/dashboards/OwnerDashboard';
import ApartmentsPage from '../pages/apartments/ApartmentsPage';
import BuildingsPage from '../pages/buildings/BuildingsPage';
import OwnersPage from '../pages/owners/OwnersPage';
import CoOwnersPage from '../pages/owners/CoOwnersPage';
import FeesPage from '../pages/fees/FeesPage';
import PaymentsPage from '../pages/payments/PaymentsPage';
import ModulePlaceholder from '../pages/ModulePlaceholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Main Dashboard (Switches according to role) */}
        <Route path="/" element={<DashboardDispatcher />} />

        {/* Syndic Modules */}
        <Route path="/buildings" element={<BuildingsPage />} />
        <Route path="/apartments" element={<ApartmentsPage />} />
        <Route path="/owners" element={<OwnersPage />} />
        <Route path="/co-owners" element={<CoOwnersPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route
          path="/interventions"
          element={
            <ModulePlaceholder
              title="Interventions & Travaux"
              moduleName="Maintenance · Interventions"
              description="Suivi des signalements d'incidents, plomberie, électricité, assignation aux prestataires et prestataires de service."
            />
          }
        />
        <Route
          path="/authorizations"
          element={
            <ModulePlaceholder
              title="Autorisations & Dérogations"
              moduleName="Administration · Autorisations"
              description="Demandes d'aménagements, travaux privatifs, déménagements et validation par le conseil syndical."
            />
          }
        />
        <Route
          path="/documents"
          element={
            <ModulePlaceholder
              title="Bibliothèque Documentaire"
              moduleName="Gestion · Documents"
              description="Règlements de copropriété, procès-verbaux d'assemblées générales, diagnostics et contrats d'entretien."
            />
          }
        />
        <Route
          path="/announcements"
          element={
            <ModulePlaceholder
              title="Annonces & Communication"
              moduleName="Communication · Annonces"
              description="Publication de notes de service, avis de coupure d'eau/électricité et communications aux résidents."
            />
          }
        />
        <Route
          path="/staff"
          element={
            <ModulePlaceholder
              title="Gestion du Personnel"
              moduleName="Équipe · Personnel"
              description="Horaires des gardiens, agents d'entretien, plannings de passage et fiches de poste."
            />
          }
        />

        {/* Owner Modules */}
        <Route path="/my-apartment" element={<OwnerDashboard />} />
        <Route path="/my-fees" element={<FeesPage />} />
        <Route path="/my-payments" element={<PaymentsPage />} />
        <Route
          path="/my-requests"
          element={
            <ModulePlaceholder
              title="Mes Demandes & Réclamations"
              moduleName="Espace Propriétaire · Mes demandes"
              description="Formulaire de signalement de panne, demande de travaux et suivi en direct du traitement."
            />
          }
        />

        {/* Employee Modules */}
        <Route
          path="/assigned-tasks"
          element={
            <ModulePlaceholder
              title="Interventions Assignées"
              moduleName="Personnel · Mes interventions"
              description="Liste priorisée de vos interventions de maintenance dans la résidence."
            />
          }
        />
        <Route
          path="/schedule"
          element={
            <ModulePlaceholder
              title="Planning & Présence"
              moduleName="Personnel · Horaires"
              description="Planning hebdomadaire de rondes, astreintes et gardiennage."
            />
          }
        />
        <Route
          path="/building-info"
          element={
            <ModulePlaceholder
              title="Informations Résidence & Urgences"
              moduleName="Personnel · Répertoire"
              description="Numéros d'urgence, contacts du syndic, plans des compteurs et vannes d'arrêt."
            />
          }
        />

        {/* Catch-all redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

