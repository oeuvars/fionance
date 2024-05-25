"use client"

import { Button } from "@nextui-org/button";
import { useNewAccount } from "../../../features/accounts/hooks/use-new-account";

export default function Home() {
  const { onOpen } = useNewAccount();
  return (
    <main className="min-h-screen">
      <Button onClick={onOpen}>
        Add an account
      </Button>
    </main>
  );
}
