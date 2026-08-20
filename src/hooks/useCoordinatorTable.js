import { useCallback, useState } from "react";
import Swal from "sweetalert2";

export const useCoordinatorTable = ({ onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmAction = useCallback(
    async (mode) => {
      if (loading) return;

      setLoading(true);

      Swal.fire({
        title: mode === "approve" ? "Aprovando..." : "Rejeitando...",
        text: "Aguarde enquanto a operação é processada.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        if (mode === "approve") {
          await onApprove();
        } else {
          await onReject();
        }

        await Swal.fire({
          title: "Operação realizada com sucesso!",
          text:
            mode === "approve"
              ? "O fechamento foi aprovado com sucesso."
              : "O fechamento foi rejeitado com sucesso.",
          icon: "success",
          confirmButtonText: "Fechar",
        });
      } catch (error) {
        console.error(error);

        await Swal.fire({
          title: "Erro",
          text:
            mode === "approve"
              ? "Erro ao aprovar. Tente novamente."
              : "Erro ao rejeitar. Tente novamente.",
          icon: "error",
          confirmButtonText: "Fechar",
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, onApprove, onReject]
  );

  return {
    loading,
    handleConfirmAction,
  };
};