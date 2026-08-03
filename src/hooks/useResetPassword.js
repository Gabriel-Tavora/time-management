import react, { useState } from "react";
export function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [attempts, setAttempts] = useState(0);
  return {
    email,
    setEmail,
    code,
    setCode,
    password,
    setPassword,
    loading,
    setLoading,
    message,
    setMessage,
    theme,
    setTheme,
    attempts,
    setAttempts,
  };
}