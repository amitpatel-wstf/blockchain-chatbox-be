// src/tools/market-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const marketTools: any[] = [
  {
    name: 'getTrendingTokens',
    type: 'function',
    requiredParams: [],
    dataSchema: 'table: token, volume, trend score',
    description: 'Get trending tokens with their volume and trend score',
    func: async () => {
      const res = await fetch('https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=eth', {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopGainersTokens',
    type: 'function',
    requiredParams: [],
    dataSchema: 'table: token, % gain, price, volume',
    description: 'Get top gaining tokens with their percentage gain, price, and volume',
    func: async () => {
      const res = await fetch('https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=eth&min_market_cap=50000000&security_score=80&time_frame=1d', {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    type: 'function',
    requiredParams: [],
    dataSchema: 'table: token, market cap, price',
    description: 'Get top ERC20 tokens by market capitalization',
    func: async () => {
      const res = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return res.raw;
    }
  },
  {
    name: 'searchTokens',
    type: 'function',
    requiredParams: ['query'],
    dataSchema: 'list: token results sorted by relevance',
    description: 'Search for tokens by query',
    func: async ({ query }: { query: string }) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?query=${query}&chains=eth&limit=10&isVerifiedContract=true&sortBy=volume1hDesc&boostVerifiedContracts=true`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    name: 'getFilteredTokens',
    type: 'function',
    requiredParams: ['filters', 'sortBy', 'limit'],
    dataSchema: 'table: token, volume, market cap, score',
    description: 'Get filtered tokens based on specified criteria',
    func: async ({ filters, sortBy, limit }: { filters: any; sortBy: any; limit: number }) => {
      const res = await fetch('https://deep-index.moralis.io/api/v2.2/discovery/tokens', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
        body: JSON.stringify({ filters, sortBy, limit, chain: '0x1' })
      });
      return res.json();
    }
  }
];
