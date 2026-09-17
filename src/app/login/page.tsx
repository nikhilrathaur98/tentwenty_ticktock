import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Login | ticktock" };

export default async function LoginPage() {
  // Already signed in? Go straight to the dashboard.
  if (await getCurrentUser()) redirect("/timesheets");

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-22">
        <div className="w-full max-w-xl">
          <LoginForm />
        </div>
      </section>

      <section className="hidden items-center bg-primary-600 px-22 lg:flex">
        <div className="max-w-xl text-white">
          <p className="mb-4 text-5xl font-semibold">ticktock</p>
          <p className="text-lg leading-relaxed text-gray-100">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </section>
    </main>
  );
}
