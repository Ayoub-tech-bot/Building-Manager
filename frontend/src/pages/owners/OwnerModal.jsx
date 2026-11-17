import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function OwnerModal({
  isOpen,
  onClose,
  onSubmit,
  ownerToEdit = null,
  isLoading = false,
}) {
  const isEditing = Boolean(ownerToEdit);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Owner',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ownerToEdit) {
      setFormData({
        username: ownerToEdit.username || '',
        email: ownerToEdit.email || '',
        password: '',
        phoneNumber: ownerToEdit.phoneNumber || '',
        role: 'Owner',
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'Owner',
      });
    }
    setErrors({});
  }, [ownerToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom complet / identifiant est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe initial est requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit comporter au moins 6 caractères';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim() || null,
      role: 'Owner',
    };

    // If editing and password was left blank, don't send it
    if (isEditing && !payload.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier le copropriétaire' : 'Nouveau copropriétaire'}
      subtitle="Renseignez les coordonnées pour l'accès aux charges et documents."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username / Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Nom et prénom du copropriétaire *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <User size={15} />
            </div>
            <input
              type="text"
              placeholder="Ex: Karim El Amrani"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.username
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Adresse email *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Mail size={15} />
            </div>
            <input
              type="email"
              placeholder="Ex: karim.amrani@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                errors.email
                  ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                  : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-[#BA372A] mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
            Numéro de téléphone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
              <Phone size={15} />
            </div>
            <input
              type="tel"
              placeholder="Ex: 06 61 22 33 44"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDD9C5] bg-white text-[#18201B] focus:border-[#1E392A] focus:outline-none focus:ring-1 focus:ring-[#1E392A]"
            />
          </div>
        </div>

        {/* Password (for creation) */}
        {!isEditing && (
          <div>
            <label className="block text-xs font-semibold text-[#18201B] mb-1.5">
              Mot de passe initial du compte *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A877B]">
                <Lock size={15} />
              </div>
              <input
                type="password"
                placeholder="Au moins 6 caractères"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white text-[#18201B] focus:outline-none focus:ring-1 transition-all ${
                  errors.password
                    ? 'border-[#BA372A] focus:border-[#BA372A] focus:ring-[#BA372A]'
                    : 'border-[#DDD9C5] focus:border-[#1E392A] focus:ring-[#1E392A]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-[#BA372A] mt-1">{errors.password}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE7D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DDD9C5] bg-white text-xs font-semibold text-[#18201B] hover:bg-[#F2EFE4] transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#1E392A] text-white text-xs font-semibold hover:bg-[#162C20] transition-colors disabled:opacity-50"
          >
            {isLoading
              ? 'Enregistrement...'
              : isEditing
              ? 'Mettre à jour'
              : 'Créer le copropriétaire'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
