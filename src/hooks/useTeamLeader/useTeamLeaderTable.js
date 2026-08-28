import { useCallback, useState } from "react";
import Swal from "sweetalert2";

export const useTeamLeaderTable = ({ onApprove }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmAction = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    Swal.fire({
      title: "Aprovando fechamento...",
      text: "Aguarde enquanto o período é processado.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await onApprove();

      await Swal.fire({
        title: "Fechamento realizado!",
        text: "O período foi enviado para aprovação.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "my-swal-popup",
          title: "my-swal-title",
          htmlContainer: "my-swal-text",
          confirmButtonText: "my-swal-confirm",
          icon: "my-swal-icon",
        },
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: "Erro ao fechar o mês",
        text:
          error?.message || "Não foi possível fechar o mês. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "my-swal-popup",
          title: "my-swal-title",
          htmlContainer: "my-swal-text",
          confirmButtonText: "my-swal-confirm",
          icon: "my-swal-icon",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [loading, onApprove]);

  const handleOpenConfirm = useCallback(async () => {
    const result = await Swal.fire({
      title: "Deseja aprovar o fechamento do mês?",
      text: "Após confirmar, o período será enviado para aprovação.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aprovar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: "my-swal-popup",
        title: "my-swal-title",
        htmlContainer: "my-swal-text",
        confirmButton: "my-swal-confirm",
        cancelButton: "my-swal-cancel",
        icon: "my-swal-icon",
      },
    });

    if (result.isConfirmed) {
      try {
        await handleConfirmAction();
        if (isMountedRef.current) {
          setRefreshKey((k) => k + 1);
        }
      } catch (err) {
        console.error("Erro ao aprovar mês:", err);
      }
    }
  }, [handleConfirmAction]);

  return {
    loading,
    handleOpenConfirm,
  };
};
