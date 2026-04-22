"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface EoiFormProps {
  onSubmit: (message: string) => Promise<void>;
  alreadySent: boolean;
}

export function EoiForm({ onSubmit, alreadySent }: EoiFormProps) {
  const t = useTranslations("eoi");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (alreadySent || success) {
    return <Alert variant="success">{t("successSent")}</Alert>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(message);
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="eoi-message" className="block text-sm font-medium text-text">
          {t("messageLabel")}
        </label>
        <textarea
          id="eoi-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          rows={3}
          className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-gray-200 bg-white text-text placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none"
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}
