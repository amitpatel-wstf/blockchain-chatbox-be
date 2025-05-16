// src/tools/index.ts
import Moralis from 'moralis';
import config from './config';

let initialized = false;
export async function initMoralis(apiKey: string) {
  if (!initialized) {
    await Moralis.start({ apiKey });
    initialized = true;
  }
}

export const tools = [
  {
    name: 'getWalletTokenBalancesPrices',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: token vs value (USD)',
    run: async ({ chain, address }:{chain:string, address : string}) => {
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
    name: 'getDefiPositionsSummary',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: protocol, asset, balance, value',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.wallets.getDefiPositionsSummary({ chain, address });
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
    name: 'getWalletActiveChains',
    requiredParams: ['address'],
    dataSchema: 'list: active blockchain names',
    run: async ({ address }:{address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletActiveChains({ address });
      return res.raw;
    }
  },
  {
    name: 'getSwapsByWalletAddress',
    requiredParams: ['address'],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    run: async ({ address }:{address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=eth&order=DESC`, {
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
  },
  {
    name: 'getTokenPrice',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: current price, % changes',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.token.getTokenPrice({ chain, address, include: 'percent_change' });
      return res.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    requiredParams: ['address'],
    dataSchema: 'stat_card: holder count, change percent',
    run: async ({ address }:{address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=eth`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getHistoricalTokenHolders',
    requiredParams: ['address', 'fromDate', 'toDate', 'timeFrame'],
    dataSchema: 'line_chart: date vs holder count',
    run: async ({ address, fromDate, toDate, timeFrame }:{fromDate:string, toDate:string,timeFrame:string,address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders/historical?chain=eth&fromDate=${fromDate}&toDate=${toDate}&timeFrame=${timeFrame}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopProfitableWalletPerToken',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: wallet, ROI, profit',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTrendingTokens',
    requiredParams: ['chain'],
    dataSchema: 'list: token, price, trend score',
    run: async ({ chain }:{chain:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopGainersTokens',
    requiredParams: ['chain', 'min_market_cap', 'security_score', 'time_frame'],
    dataSchema: 'bar_chart: token vs % gain',
    run: async ({ chain, min_market_cap, security_score, time_frame }:{chain:string,min_market_cap:string, security_score:string,time_frame:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=${chain}&min_market_cap=${min_market_cap}&security_score=${security_score}&time_frame=${time_frame}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTokenAnalytics',
    requiredParams: ['chain', 'address'],
    dataSchema: 'dashboard: tx count, volume, active users',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/${address}/analytics?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTokenStats',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: volume, liquidity, market cap',
    run: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.token.getTokenStats({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getPairCandlesticks',
    requiredParams: ['pairAddress', 'fromDate', 'toDate', 'timeframe','chain'],
    dataSchema: 'candlestick_chart: OHLCV',
    run: async ({ pairAddress, fromDate, toDate, timeframe, chain="eth" }:{pairAddress:string, fromDate:string,toDate:string,timeframe:string, chain:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/ohlcv?chain=${chain}&currency=usd&fromDate=${fromDate}&toDate=${toDate}&timeframe=${timeframe}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    requiredParams: [],
    dataSchema: 'table: rank, token, market cap',
    run: async () => {
      const res = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return res.raw;
    }
  },
  {
    name: 'searchTokens',
    requiredParams: ['query'],
    dataSchema: 'search_results: token name, symbol, volume',
    run: async ({ query, chain="eth" }:{query:string, chain:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?query=${query}&chains=${chain}&limit=10&isVerifiedContract=true&sortBy=volume1hDesc&boostVerifiedContracts=true`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getFilteredTokens',
    requiredParams: ['chain', 'filters', 'sortBy', 'limit'],
    dataSchema: 'table: token, volume, score',
    run: async ({ chain, filters, sortBy, limit } : {chain:string,filters:string[], sortBy:string,limit:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
        body: JSON.stringify({ chain, filters, sortBy, limit })
      });
      return res.json();
    }
  }
];
