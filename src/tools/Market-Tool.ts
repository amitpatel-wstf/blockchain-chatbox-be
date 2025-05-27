// src/tools/market-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const marketTools: any[] = [
  {
    name: 'getTrendingTokens',
    requiredParams: ["chain"],
    dataSchema: 'table: token, volume, trend score',
    run: async ({ chain="eth" }: { chain?: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopGainersTokens',
    requiredParams: ["chain"],
    dataSchema: 'table: token, % gain, price, volume',
    run: async ({ chain="eth", min_market_cap=50000000, security_score=80, time_frame="1d" }: { chain?: string, min_market_cap?: number, security_score?: number, time_frame?: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=${chain}&min_market_cap=${min_market_cap}&security_score=${security_score}&time_frame=${time_frame}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    requiredParams: [],
    dataSchema: 'table: token, market cap, price',
    run: async () => {
      const res = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return res.raw;
    }
  },
  {
    name: 'searchTokens',
    requiredParams: ['query', "chain"],
    dataSchema: 'list: token results sorted by relevance',
    run: async ({ query, chain="eth", limit=10 }: { query: string, chain?: string, limit?: number }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?query=${query}&chains=${chain}&limit=${limit}&isVerifiedContract=true&sortBy=volume1hDesc&boostVerifiedContracts=true`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getFilteredTokens',
    requiredParams: ['filters', "chain"],
    dataSchema: 'table: token, volume, market cap, score',
    run: async ({ filters, sortBy, limit=10, chain="eth" }: { filters: any; sortBy: any; limit: number; chain?: string }) => {
      const res = await fetch('https://deep-index.moralis.io/api/v2.2/discovery/tokens', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
        body: JSON.stringify({ filters, sortBy, limit, chain: chain })
      });
      return res.json();
    }
  }
];