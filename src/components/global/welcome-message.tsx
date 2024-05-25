"use client";

import { FC } from "react";
import { useUser } from "@clerk/nextjs";

const WelcomeMessage: FC = () => {
  const { user, isLoaded } = useUser();

  return (
    <div>
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
         Welcome Back {isLoaded ? ",  " : " "}{user?.firstName} 👋🏻
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">This is your Financial overview</p>
    </div>
  );
};

export default WelcomeMessage;
