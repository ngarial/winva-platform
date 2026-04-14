"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { NdaModal } from "@/components/deals/nda-modal";
import { EoiForm } from "@/components/deals/eoi-form";
import { Dataroom } from "@/components/deals/dataroom";
import { acceptNDAWithKYC, submitEOI } from "./actions";

interface DataroomFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface DealDetailClientProps {
  dealId: string;
  dealTitle: string;
  hasSignedNDA: boolean;
  hasSentEOI: boolean;
  dataroomFiles: DataroomFile[];
}

export function DealDetailClient({
  dealId,
  dealTitle,
  hasSignedNDA: initialNDA,
  hasSentEOI: initialEOI,
  dataroomFiles,
}: DealDetailClientProps) {
  const router = useRouter();
  const [hasSignedNDA, setHasSignedNDA] = useState(initialNDA);
  const [showNdaModal, setShowNdaModal] = useState(false);

  async function handleAcceptNDA(kycFile: File, kycType: string) {
    const formData = new FormData();
    formData.append("file", kycFile);
    formData.append("kyc_type", kycType);
    await acceptNDAWithKYC(dealId, formData);
    setHasSignedNDA(true);
    setShowNdaModal(false);
    router.refresh();
  }

  async function handleSubmitEOI(message: string) {
    await submitEOI(dealId, message);
    router.refresh();
  }

  return (
    <>
      {/* NDA Section */}
      {!hasSignedNDA ? (
        <Card className="border-terracotta/20 bg-terracotta/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-midnight">
                Accès restreint
              </h3>
              <p className="text-sm text-text-soft mt-1">
                Signez le NDA pour accéder aux informations détaillées et à la dataroom de ce deal.
              </p>
            </div>
            <Button onClick={() => setShowNdaModal(true)}>
              Signer le NDA
            </Button>
          </div>
        </Card>
      ) : (
        <Alert variant="success">
          NDA signé — Vous avez accès aux informations complètes de ce deal.
        </Alert>
      )}

      {/* Dataroom */}
      {hasSignedNDA && <Dataroom files={dataroomFiles} />}

      {/* Expression d'intérêt */}
      {hasSignedNDA && (
        <Card>
          <h2 className="font-display text-lg font-semibold text-midnight mb-4">
            Exprimer votre intérêt
          </h2>
          <EoiForm onSubmit={handleSubmitEOI} alreadySent={initialEOI} />
        </Card>
      )}

      {/* NDA Modal */}
      <NdaModal
        open={showNdaModal}
        onClose={() => setShowNdaModal(false)}
        onAccept={handleAcceptNDA}
        dealTitle={dealTitle}
      />
    </>
  );
}
