"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("nda");
  const [loading, setLoading] = useState(false);
  const [kycType, setKycType] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAccept() {
    setError("");
    if (!kycType) {
      setError(t("errorType"));
      return;
    }
    if (!kycFile) {
      setError(t("errorFile"));
      return;
    }
    setLoading(true);
    try {
      await onAccept(kycFile, kycType);
    } catch {
      setError(t("errorGeneric"));
    }
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} title={t("title")}>
      <div className="space-y-6">
        <div className="bg-ivory-warm rounded-[var(--radius-md)] p-4">
          <p className="text-sm text-text-soft leading-relaxed">
            {t("introLead")}{" "}
            <strong className="text-text">&ldquo;{dealTitle}&rdquo;</strong>
            {t("introTail")}
          </p>
        </div>

        <div className="space-y-4 text-sm text-text leading-relaxed">
          <p>{t("commitmentsTitle")}</p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">1.</span>
              {t("commitment1")}
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">2.</span>
              {t("commitment2")}
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">3.</span>
              {t("commitment3")}
            </li>
            <li className="flex gap-2">
              <span className="text-terracotta font-bold">4.</span>
              {t("commitment4")}
            </li>
          </ul>
        </div>

        {/* KYC Section */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-midnight">{t("kycTitle")}</h3>
          <p className="text-xs text-text-soft">{t("kycHelp")}</p>

          <Select
            id="kyc_type"
            placeholder={t("kycTypePlaceholder")}
            value={kycType}
            onChange={(e) => setKycType(e.target.value)}
            options={[
              { value: "cni", label: t("kycTypes.cni") },
              { value: "passeport", label: t("kycTypes.passport") },
              { value: "rccm", label: t("kycTypes.rccm") },
              { value: "statuts", label: t("kycTypes.statutes") },
              { value: "autre", label: t("kycTypes.other") },
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
              <p className="text-sm text-gray-400">{t("fileHint")}</p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <p className="text-xs text-gray-400">{t("disclaimer")}</p>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            {t("cancel")}
          </Button>
          <Button onClick={handleAccept} loading={loading} className="flex-1">
            {t("accept")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
