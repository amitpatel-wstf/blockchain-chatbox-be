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
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: token vs value (USD)',
    description: 'Get token balances with prices for a wallet address',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getWalletNFTs',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'grid: NFT images with metadata',
    description: 'Get NFTs owned by a wallet address',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.nft.getWalletNFTs({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getDefiPositionsSummary',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: protocol, asset, balance, value',
    description: 'Get defi positions summary for a wallet address',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.wallets.getDefiPositionsSummary({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getWalletNetWorth',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'stat_card: total net worth in USD',
    description: 'Get net worth for a wallet address',
    func: async ({ address }: { address: string }) => {
      const res = await Moralis.EvmApi.wallets.getWalletNetWorth({ address });
      return res.raw;
    }
  },
  {
    name: 'getWalletProfitabilitySummary',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: total pnl, avg entry, current value',
    description: 'Get profitability summary for a wallet address',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getWalletActiveChains',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'list: active blockchain names',
    description: 'Get active chains for a wallet address',
    func: async ({ address }: { address: string }) => {
      const res = await Moralis.EvmApi.wallets.getWalletActiveChains({ address });
      return res.raw;
    }
  },
  {
    name: 'getSwapsByWalletAddress',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    description: 'Get swaps by wallet address',
    func: async ({ address }: { address: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=eth&order=DESC`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'resolveAddressToDomain',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'text: resolved domain string (e.g., vitalik.eth)',
    description: 'Resolve an address to a domain',
    func: async ({ address }: { address: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/resolve/${address}/domain`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'resolveENSDomain',
    type: 'function',
    requiredParams: ['domain'],
    dataSchema: 'text: resolved wallet address from ENS',
    description: 'Resolve an ENS domain to a wallet address',
    func: async ({ domain }: { domain: string }) => {
      const res = await Moralis.EvmApi.resolve.resolveENSDomain({ domain });
      return res?.raw;
    }
  },
  {
    name: 'getTokenPrice',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: current price, % changes',
    description: 'Get token price with percentage change',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenPrice({ chain, address, include: 'percent_change' });
      return res.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'stat_card: holder count, change percent',
    description: 'Get token holder stats',
    func: async ({ address }: { address: string }) => {
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
    func: async ({ address, fromDate, toDate, timeFrame }: { fromDate: string, toDate: string, timeFrame: string, address: string }) => {
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
    description: 'Get top profitable wallets per token',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTrendingTokens',
    type: 'function',
    requiredParams: ['chain'],
    dataSchema: 'list: token, price, trend score',
    description: 'Get trending tokens',
    func: async ({ chain }: { chain: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopGainersTokens',
    type: 'function',
    requiredParams: ['chain', 'min_market_cap', 'security_score', 'time_frame'],
    dataSchema: 'bar_chart: token vs % gain',
    description: 'Get top gainers tokens',
    func: async ({ chain, min_market_cap, security_score, time_frame }: { chain: string, min_market_cap: string, security_score: string, time_frame: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=${chain}&min_market_cap=${min_market_cap}&security_score=${security_score}&time_frame=${time_frame}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTokenAnalytics',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'dashboard: tx count, volume, active users',
    description: 'Get token analytics',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/${address}/analytics?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTokenStats',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: volume, liquidity, market cap',
    description: 'Get token stats',
    func: async ({ chain, address }: { chain: string, address: string }) => {
      const res = await Moralis.EvmApi.token.getTokenStats({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getPairCandlesticks',
    type: 'function',
    requiredParams: ['pairAddress', 'fromDate', 'toDate', 'timeframe', 'chain'],
    dataSchema: 'candlestick_chart: OHLCV',
    description: 'Get pair candlesticks',
    func: async ({ pairAddress, fromDate, toDate, timeframe, chain = "eth" }: { pairAddress: string, fromDate: string, toDate: string, timeframe: string, chain: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/ohlcv?chain=${chain}&currency=usd&fromDate=${fromDate}&toDate=${toDate}&timeframe=${timeframe}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    type: 'function',
    requiredParams: [],
    dataSchema: 'table: rank, token, market cap',
    description: 'Get top ERC20 tokens by market cap',
    func: async () => {
      const res = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return res.raw;
    }
  },
  {
    name: 'searchTokens',
    type: 'function',
    requiredParams: ['query'],
    dataSchema: 'search_results: token name, symbol, volume',
    description: 'Search for tokens by query',
    func: async ({ query, chain = "eth" }: { query: string, chain: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?query=${query}&chains=${chain}&limit=10&isVerifiedContract=true&sortBy=volume1hDesc&boostVerifiedContracts=true`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getFilteredTokens',
    type: 'function',
    requiredParams: ['chain', 'filters', 'sortBy', 'limit'],
    dataSchema: 'table: token, volume, score',
    description: 'Get filtered tokens',
    func: async ({ chain, filters, sortBy, limit }: { chain: string, filters: string[], sortBy: string, limit: string }) => {
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
