export const SYNDIC_DASHBOARD_DATA = {
  stats: {
    soldeTotalARecouvrer: 7200,
    soldeDetails: '12 appartements · toutes périodes',
    paiementsEnregistres: 21900,
    paiementsDetails: 'Ce mois-ci · 76 % des charges émises',
    interventionsOuvertes: 8,
    interventionsDetails: 'Dont 2 à prendre en charge',
    autorisationsEnAttente: 3,
    autorisationsDetails: 'Demandes à examiner',
  },
  recouvrement: {
    period: 'octobre 2026',
    collected: 21900,
    total: 28800,
    percentage: 76,
    subtext: 'Charges du mois : 28 800 DH · reste : 6 900 DH + 300 DH antérieurs',
  },
  chargesASuivre: [
    {
      unit: 'B-04',
      owner: 'Youssef Tazi',
      period: 'Sept. + oct. 2026',
      balanceDue: 900,
      status: 'late',
    },
    {
      unit: 'C-08',
      owner: 'Salma Idrissi',
      period: 'Octobre 2026',
      balanceDue: 600,
      status: 'late',
    },
    {
      unit: 'A-03',
      owner: 'Omar Berrada',
      period: 'Octobre 2026',
      balanceDue: 600,
      status: 'late',
    },
    {
      unit: 'A-12',
      owner: 'Karim El Amrani',
      period: 'Octobre 2026',
      balanceDue: 300,
      status: 'partial',
    },
  ],
  derniersPaiements: [
    {
      date: '15 oct.',
      unit: 'C-02',
      owner: 'Amina Chraïbi',
      by: 'Saisi par Nora',
      amount: 600,
    },
    {
      date: '14 oct.',
      unit: 'B-07',
      owner: 'Mehdi Amrani',
      by: 'Saisi par Nora',
      amount: 600,
    },
    {
      date: '08 oct.',
      unit: 'A-12',
      owner: 'Karim El Amrani',
      by: 'Saisi par Nora',
      amount: 300,
    },
  ],
  demandesATraiter: [
    {
      id: 1,
      type: 'INTERVENTION · A-12',
      title: 'Fuite au plafond',
      details: 'Karim El Amrani · 14 oct.',
      status: 'ongoing',
    },
    {
      id: 2,
      type: 'AUTORISATION · A-12',
      title: 'Rénovation de la salle de bain',
      details: 'Karim El Amrani · 13 oct.',
      status: 'pending',
    },
  ],
  annonce: {
    category: 'VIE DE LA RÉSIDENCE',
    publishedDate: 'Publié le 15 oct.',
    title: "Coupure d'eau programmée",
    body: "Mardi 20 octobre, de 9 h à 12 h. Intervention sur le réseau d'eau de la résidence.",
    audience: 'Toute la résidence',
  },
  activiteRecente: [
    {
      id: 1,
      type: 'payment',
      title: 'Paiement de 600 DH enregistré',
      details: 'C-02 · Nora Alaoui · hier, 18:20',
    },
    {
      id: 2,
      type: 'announcement',
      title: "Annonce de coupure d'eau publiée",
      details: 'Toute la résidence · hier, 10:15',
    },
    {
      id: 3,
      type: 'ownership',
      title: 'Propriété de A-12 transférée à Karim',
      details: 'Mme Bennani · historique conservé · 01 août',
    },
  ],
};

export const OWNER_DASHBOARD_DATA = {
  apartment: {
    unit: 'Appartement A-12',
    residence: 'Résidence Les Oliviers',
    buildingName: 'Bâtiment A',
    floor: 2,
    sizeM2: 86,
    details: 'Bâtiment A · 2e étage · 86 m²',
    sinceDate: '1er août 2026',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80',
  },
  solde: {
    resteARegler: 300,
    periodDetail: 'Octobre 2026 · charge de 600 DH',
    alreadyPaidNote: '300 DH déjà enregistrés le 8 octobre',
    syndicNote: 'Pour tout règlement, rapprochez-vous du syndic.',
  },
  chargesEtPaiements: [
    {
      period: 'Octobre 2026',
      charge: 600,
      verse: 300,
      resteDu: 300,
      status: 'partial',
    },
    {
      period: 'Septembre 2026',
      charge: 600,
      verse: 600,
      resteDu: 0,
      status: 'paid',
    },
    {
      period: 'Août 2026',
      charge: 600,
      verse: 600,
      resteDu: 0,
      status: 'paid',
    },
  ],
  dernierPaiementNotice: {
    amount: 300,
    date: '8 octobre 2026',
    description: "Enregistré par le syndic · affecté à la charge d'octobre",
  },
  demandes: [
    {
      id: 1,
      type: 'Intervention · envoyée le 14 octobre',
      title: 'Fuite au plafond',
      feedback: 'Le syndic a pris en charge votre signalement.',
      status: 'ongoing',
    },
    {
      id: 2,
      type: 'Autorisation · envoyée le 13 octobre',
      title: 'Rénovation de la salle de bain',
      feedback: 'Votre demande est en attente de décision du syndic.',
      status: 'pending',
    },
  ],
  documentsUtiles: [
    {
      id: 1,
      title: 'Appel de charges · octobre',
      scope: 'Mon appartement · PDF · 124 Ko',
    },
    {
      id: 2,
      title: 'Règlement de copropriété',
      scope: 'Résidence · PDF · 2,4 Mo',
    },
    {
      id: 3,
      title: "Compte rendu de l'AG 2026",
      scope: 'Résidence · PDF · 840 Ko',
    },
  ],
  syndicContact: {
    name: 'Nora Alaoui',
    hours: 'Lun-ven · 9 h-17 h',
    phone: '05 22 44 18 60',
  },
};

export const EMPLOYEE_DASHBOARD_DATA = {
  stats: {
    assignedInterventions: 4,
    pendingToday: 2,
    weeklyHours: 35,
    resolvedThisMonth: 12,
  },
  interventions: [
    {
      id: 101,
      unit: 'A-12',
      resident: 'Karim El Amrani',
      title: 'Fuite au plafond salle d’eau',
      urgency: 'Prioritaire',
      scheduledDate: "Aujourd'hui · 14h30",
      status: 'ongoing',
    },
    {
      id: 102,
      unit: 'Bâtiment B',
      resident: 'Parties communes',
      title: "Remplacement ampoules LED palier 3e étage",
      urgency: 'Normal',
      scheduledDate: "Aujourd'hui · 16h00",
      status: 'pending',
    },
    {
      id: 103,
      unit: 'Parking -1',
      resident: 'Copropriété',
      title: 'Vérification porte automatique garage',
      urgency: 'Planifié',
      scheduledDate: 'Demain · 10h00',
      status: 'pending',
    },
  ],
};

