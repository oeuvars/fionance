'use client';

import { useEffect, useState } from 'react';
import { NewAccountSheet } from '../../features/accounts/components/new-account.sheet';

export const SheetProvider = () => {
   //  const [isMounted, setIsMounted] = useState<boolean>(false);

   //  useEffect(() => {
   //      setIsMounted(false);
   //  }, []);

   //  if (!isMounted) return null;
    return (
        <>
            <NewAccountSheet />
        </>
    );
};
