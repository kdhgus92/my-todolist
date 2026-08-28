import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "../../../shared/api/client";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { FormFieldError } from "../../../shared/ui/FormFieldError";
import { useAuthStore } from "../../../entities/user";
import { useTranslation } from "../../../shared/lib/i18n";
import type { User } from "../../../shared/types/domain";

interface LoginResponse {
  accessToken: string;
  user: User;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t, tError } = useTranslation();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      if (import.meta.env.DEV) console.log("[login] success", email);
      useAuthStore.getState().login(data.user, data.accessToken);
      navigate("/todos");
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error("[login] failed", err);
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? tError(mutation.error.code, mutation.error.message)
      : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <Input
          label={t("login", "email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label={t("login", "password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormFieldError message={errorMessage} />
        <Button
          type="submit"
          disabled={mutation.isPending}
          style={{ width: "100%" }}
        >
          {t("login", "submit")} 😊😊
        </Button>
      </div>
    </form>
  );
}
