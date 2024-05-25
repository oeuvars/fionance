import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="">
      <div className="grid gap-3 mb-7">
        <h1 className="text-5xl text-center font-semibold tracking-tight text-[#322C2B]">
          Welcome back! 👋🏻
        </h1>
        <p className="text-center">Log in or create an account</p>
      </div>
      <div className="grid justify-center">
        <ClerkLoaded>
          <SignIn path="/sign-in" />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="animate-spin" />
        </ClerkLoading>
      </div>
    </div>
  );
}
