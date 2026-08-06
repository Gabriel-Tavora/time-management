import { useCallback, useEffect, useRef, useState } from "react";

const SUCCESS_DIALOG_TIMEOUT_MS = 4000;

export const useMenagerTable = ({ onApprove, onReject }) => {
  const confirmDialogRef = useRef(null);
  const successDialogRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = confirmDialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      setDialogMode(null);
      setErrorMessage(null);
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  useEffect(() => {
    const dialog = successDialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, []);

  const openDialog = useCallback((mode) => {
    setDialogMode(mode);
    setErrorMessage(null);
    confirmDialogRef.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    confirmDialogRef.current?.close();
  }, []);

  const closeSuccessDialog = useCallback(() => {
    successDialogRef.current?.close();
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!dialogMode || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      if (dialogMode === "approve") {
        await onApprove();
      } else {
        await onReject();
      }

      confirmDialogRef.current?.close();
      successDialogRef.current?.showModal();

      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        successDialogRef.current?.close();
      }, SUCCESS_DIALOG_TIMEOUT_MS);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        dialogMode === "approve"
          ? "Erro ao aprovar. Tente novamente."
          : "Erro ao rejeitar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, [dialogMode, loading, onApprove, onReject]);

  return {
    confirmDialogRef,
    successDialogRef,
    loading,
    dialogMode,
    errorMessage,
    openDialog,
    closeDialog,
    closeSuccessDialog,
    handleConfirmAction,
  };
};