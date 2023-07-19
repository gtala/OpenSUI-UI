'use client';

import { WalletProvider as OriginalWalletProvider } from '@suiet/wallet-kit';

export default function WalletProvider({ children }: {children: any}) {
  return <OriginalWalletProvider>{children}</OriginalWalletProvider>
}