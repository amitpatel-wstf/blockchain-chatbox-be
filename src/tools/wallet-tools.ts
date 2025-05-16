// src/tools/wallet-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const walletTools = [
  {
    name: 'getWalletTokenBalancesPrices',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: token vs value (USD)',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getWalletNFTs',
    requiredParams: ['chain', 'address'],
    dataSchema: 'grid: NFT images with metadata',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.nft.getWalletNFTs({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getWalletActiveChains',
    requiredParams: ['address'],
    dataSchema: 'list: active blockchain names',
    run: async ({ address }:{address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletActiveChains({ address });
      return res.raw;
    }
  },
  {
    name: 'getWalletNetWorth',
    requiredParams: ['address'],
    dataSchema: 'stat_card: total net worth in USD',
    run: async ({ address }:{address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletNetWorth({ address });
      return res.raw;
    }
  },
  {
    name: 'getWalletProfitabilitySummary',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: total pnl, avg entry, current value',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getSwapsByWalletAddress',
    requiredParams: ['address'],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    run: async ({ address, chain="eth" }:{chain:string,address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=${chain}&order=DESC`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'resolveAddressToDomain',
    requiredParams: ['address'],
    dataSchema: 'text: resolved domain string (e.g., vitalik.eth)',
    run: async ({ address }:{address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/resolve/${address}/domain`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'resolveENSDomain',
    requiredParams: ['domain'],
    dataSchema: 'text: resolved wallet address from ENS',
    run: async ({ domain }:{domain:string}) => {
      const res = await Moralis.EvmApi.resolve.resolveENSDomain({ domain });
      return res?.raw;
    }
  }
];
