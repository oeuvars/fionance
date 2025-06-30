"use client";

import { FC } from "react";
import { useSession } from "@/lib/auth-client";

export const WelcomeMessage: FC = () => {
  const { data: session, isPending } = useSession();

  return (
    <div>
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
         Welcome Back{!isPending ? ",  " : " "}{session?.user?.name}
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">This is your Financial overview</p>
    </div>
  );
};