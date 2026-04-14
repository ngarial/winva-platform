"use client";

import { useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface NdaModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: (kycFile: File, kycType: string) => Promise<void>;
  dealTitle: string;
}

export function NdaModal({ open, onClose, onAccept, dealTitle }: NdaModalProps) {
  const [loading, setLoading] = useState(false);
  const [kycType, setKycType] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAccept() {
    setError("");
    if (!kycType) {
      setError("Veuillez sélectionner le type de document.");
      return;
    }
    if (!kycFile) {
      setError("Veuillez joindre votre document d'identité.");
      return;
    }
    setLoading(true);
    try {
      await onAccept(kycFile, kycType);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} title="Accord de confidentialité">
      <div className="space-y-6">
        <div className="bg-ivory-warm rounded-[var(--radius-md)] p-4">
          <p className="text-sm text-text-soft leading-relaxed">
            Pour accéder aux informations détaillées du deal{" "}
            <strong className="text-text">&ldquo;{dealTitle}&rdquo;</strong>, vous devez accepter
            l&apos;accord de confidentialité (NDA) et fournir un justificatif d&apos;identité.
          </p>
        </div>

        <div className="space-y-4 text-sm text-text leading-relaxed">
          <p>En cliquant sur &ldquo;J&apos;accepte&rdquo;, vous vous engagez à :</p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">1.</span>
              Ne pas divulguer les informations confidentielles reçues.
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">2.</span>
              Utiliser ces informations uniquement pour évaluer l&apos;opportunité.
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">3.</span>
              Ne pas contacter directement la société cible sans accord de WINVA.
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">4.</span>
              Restituer ou détruire tous les documents confidentiels à la demande.
            </li>
          </ul>
        </div>

        {/* KYC Section */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-midnight">Justificatif d&apos;identité (KYC)</h3>
          <p className="text-xs text-text-soft">
            Personne physique : CNI ou Passeport. Personne morale : RCCM ou pièce d&apos;identité du représentant légal.
          </p>

          <Select
            id="kyc_type"
            placeholder="Type de document..."
            value={kycType}
            onChange={(e) => setKycType(e.target.value)}
            options={[
              { value: "cni", label: "Carte nationale d'identité (CNI)" },
              { value: "passeport", label: "Passeport" },
              { value: "rccm", label: "RCCM (Registre du Commerce)" },
              { value: "statuts", label: "Statuts de la société" },
              { value: "autre", label: "Autre justificatif" },
            ]}
          />

          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-[var(--radius-md)] p-4 text-center cursor-pointer transition-colors ${
              kycFile ? "border-success bg-success/5" : "border-gray-200 hover:border-terracotta"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setKycFile(file);
              }}
            />
            {kycFile ? (
              <p className="text-sm text-success font-medium">{kycFile.name}</p>
            ) : (
              <p className="text-sm text-gray-400">
                Cliquez pour joindre votre document (PDF, JPG, PNG)
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <p className="text-xs text-gray-400">
          Votre acceptation et votre document seront horodatés et enregistrés.
        </p>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button onClick={handleAccept} loading={loading} className="flex-1">
            J&apos;accepte le NDA
          </Button>
        </div>
      </div>
    </Modal>
  );
}
