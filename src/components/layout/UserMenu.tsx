"use client";

import { signOut } from "next-auth/react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { ChevronDownIcon } from "@/components/ui/icons";

export function UserMenu({ name }: { name: string }) {
  return (
    <DropdownMenu
      triggerLabel="Open user menu"
      triggerClassName="flex items-center gap-1 text-base text-gray-500 hover:text-gray-900"
      trigger={
        <>
          {name}
          <ChevronDownIcon />
        </>
      }
      items={[
        {
          label: "Sign out",
          onClick: () => signOut({ callbackUrl: "/login" }),
        },
      ]}
    />
  );
}
