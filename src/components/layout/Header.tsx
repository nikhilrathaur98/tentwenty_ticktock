import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";

export function Header({ userName }: { userName: string }) {
  return (
    <header className="bg-white">
      <div className="flex h-17 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link
            href="/timesheets"
            className="text-2xl font-semibold text-gray-900"
          >
            ticktock
          </Link>
          <nav>
            <Link
              href="/timesheets"
              className="text-sm font-medium text-gray-900 hover:text-primary-700"
            >
              Timesheets
            </Link>
          </nav>
        </div>
        <UserMenu name={userName} />
      </div>
    </header>
  );
}
