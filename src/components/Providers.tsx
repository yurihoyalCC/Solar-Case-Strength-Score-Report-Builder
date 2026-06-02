'use client';

import React from 'react';
import { FunnelProvider } from '../context/FunnelContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FunnelProvider>
      {children}
    </FunnelProvider>
  );
}
