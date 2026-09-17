import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth";

// Every page inside the (dashboard) folder requires a signed-in user.
export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={user.name ?? "User"} />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {children}
        <Footer />
      </main>
    </div>
  );
}
