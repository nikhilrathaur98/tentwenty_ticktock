"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email))
    errors.email = "Please enter a valid email.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLogin(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      setErrors({ form: "Invalid email or password." });
      return;
    }

    router.replace("/timesheets");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-6"
    >
      <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>

      {errors.form && (
        <p
          role="alert"
          className="rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-800"
        >
          {errors.form}
        </p>
      )}

      <FormField id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hasError={!!errors.email}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasError={!!errors.password}
        />
      </FormField>

      <Checkbox
        id="remember"
        label="Remember me"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Sign in
      </Button>

      <p className="text-xs text-gray-500">
        Demo account: <span className="font-medium">john@example.com</span> /{" "}
        <span className="font-medium">password123</span>
      </p>
    </form>
  );
}
