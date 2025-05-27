// src/tools/token-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const tokenTools: any[] = [
  {
    name: 'getTokenPrice',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: current price, % changes',
    run: async ({ chain="0x1", address }: { chain?: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenPrice({ chain, address, include: 'percent_change' });
      return res.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    requiredParams: ['address','chain'],
    dataSchema: 'stat_card: holder count, change percent',
    run: async ({ address,chain="eth" }: { address: string;chain?:string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getHistoricalTokenHolders',
    requiredParams: ['address','chain'],
    dataSchema: 'line_chart: date vs holder count',
    run: async ({ address, fromDate, toDate, timeFrame,chain="eth" }: { address: string; fromDate: string; toDate: string; timeFrame: string;chain?:string }) => {
      const fromDateParams = fromDate ?? new Date().toISOString()
      // 24 hours ago
      const toDateParams = toDate ?? new Date().toISOString()+24*60*60*1000
      const timeFrameParams = timeFrame ?? "1d"
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders/historical?chain=${chain}&fromDate=${fromDateParams}&toDate=${toDateParams}&timeFrame=${timeFrameParams}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopProfitableWalletPerToken',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: wallet, ROI, profit',
    run: async ({ chain="0x1", address }: { chain?: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTokenStats',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: volume, liquidity, market cap',
    run: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenStats({ chain, address });
      return res.raw;
    }
  }
];