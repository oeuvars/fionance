"use client"

import { Button } from "@/components/ui/button";
import { useNewAccount } from "../../features/accounts/hooks/use-new-account";

export default function Home() {
  const { onOpen } = useNewAccount();
  return (
    <main className="-mt-12 flex mx-auto justify-center">
      <Button onClick={onOpen} className="text-sm" variant="secondary">
        Add an account
      </Button>
    </main>
  );
}
