// src/tools/token-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const tokenTools: any[] = [
  {
    name: 'getTokenPrice',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: current price, % changes',
    description: 'Get token price with percentage change',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenPrice({ chain, address, include: 'percent_change' });
      return res.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'stat_card: holder count, change percent',
    description: 'Get token holder statistics',
    func : async ({ address }: { address: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=eth`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getHistoricalTokenHolders',
    type: 'function',
    requiredParams: ['address', 'fromDate', 'toDate', 'timeFrame'],
    dataSchema: 'line_chart: date vs holder count',
    description: 'Get historical token holder statistics',
    func: async ({ address, fromDate, toDate, timeFrame }: { address: string; fromDate: string; toDate: string; timeFrame: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders/historical?chain=eth&fromDate=${fromDate}&toDate=${toDate}&timeFrame=${timeFrame}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopProfitableWalletPerToken',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: wallet, ROI, profit',
    description: 'Get top profitable wallets for a token',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTokenStats',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: volume, liquidity, market cap',
    description: 'Get token statistics',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenStats({ chain, address });
      return res.raw;
    }
  }
];
