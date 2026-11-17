import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardDispatcher from '../pages/dashboards/DashboardDispatcher';
import ModulePlaceholder from '../pages/ModulePlaceholder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Main Dashboard (Switches according to role) */}
        <Route path="/" element={<DashboardDispatcher />} />

        {/* Syndic Modules */}
        <Route
          path="/apartments"
          element={
            <ModulePlaceholder
              title="Gestion des Appartements"
              moduleName="Administration · Appartements"
              description="Visualisation du plan d'immeuble, surfaces en m², numéros de lots, assignation de copropriétaires et historique."
            />
          }
        />
        <Route
          path="/owners"
          element={
            <ModulePlaceholder
              title="Répertoire des Propriétaires"
              moduleName="Administration · Propriétaires"
              description="Annuaire des copropriétaires, coordonnées, transferts de propriété et historique des actes."
            />
          }
        />
        <Route
          path="/fees"
          element={
            <ModulePlaceholder
              title="Charges de Copropriété"
              moduleName="Finance · Charges"
              description="Émission des appels de fonds mensuels, charges spéciales, suivi du recouvrement et relances."
            />
          }
        />
        <Route
          path="/payments"
          element={
            <ModulePlaceholder
              title="Gestion des Paiements"
              moduleName="Finance · Paiements"
              description="Enregistrement des règlements (virement, chèque, espèces), affectation aux charges et reçus de paiement."
            />
          }
        />
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
        <Route
          path="/my-apartment"
          element={
            <ModulePlaceholder
              title="Fiche Mon Appartement"
              moduleName="Espace Propriétaire · Mon lot"
              description="Caractéristiques de votre appartement (A-12), tantièmes de copropriété et documents liés."
            />
          }
        />
        <Route
          path="/my-fees"
          element={
            <ModulePlaceholder
              title="Mes Appels de Charges"
              moduleName="Espace Propriétaire · Mes charges"
              description="Historique complet des charges émises pour votre appartement, solde dû et téléchargement des avis."
            />
          }
        />
        <Route
          path="/my-payments"
          element={
            <ModulePlaceholder
              title="Historique de Mes Règlements"
              moduleName="Espace Propriétaire · Mes paiements"
              description="Tous les reçus de paiements enregistrés par le syndic et vos justificatifs fiscaux."
            />
          }
        />
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

