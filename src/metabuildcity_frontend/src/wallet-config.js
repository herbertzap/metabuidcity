import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider, createConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

import { QueryClient } from '@tanstack/react-query';

// ✅ Usa getDefaultConfig (nuevo en wagmi + rainbowkit moderno)
const config = getDefaultConfig({
  appName: 'Metabuildcity',
  projectId: '2ac0ea10a6c198ab8fa5c73fc7d47a5d', 
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

export {
  config,
  RainbowKitProvider,
  WagmiProvider,
  queryClient
};
