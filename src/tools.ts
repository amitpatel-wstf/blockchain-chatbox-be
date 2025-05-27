import Moralis from 'moralis';
import config from './config';

// Ensure Moralis is initialized before using any tools
let initialized = false;
export async function initMoralis(apiKey: string) {
  if (!initialized) {
    await Moralis.start({ apiKey });
    initialized = true;
  }
}

export const tools = [
  {
    name: 'getWalletNetWorth',
    requiredParams: ['address','chain'],
    dataSchema: 'stat_card: total net worth in USD',
    run: async ({ address,chain="0x1" }:{address:string,chain?:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletNetWorth({ address,chains:[chain] });
      return res.raw;
    }
  },
  {
    name: 'getTrendingTokens',
    requiredParams: ['chain'],
    optionalParams: [],
    dataSchema: 'table: token, volume, trend score',
    run: async ({ chain = 'eth' }: { chain?: string }) => {
      // await initMoralis(config.MORALIS_KEY);
      // const res = await Moralis.EvmApi.marketData.getTrendingTokens({ chain });
      // return res.raw;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
      };
      
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}`, options)
      const data = await res.json();
      return data
    }
  },
  {
    name: 'getSwapsByWalletAddress',
    requiredParams: ['address',"chain"],
    optionalParams: ["order","limit"],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    run: async ({ address, chain="eth" ,order="DESC",limit=10}:{chain:string,address:string,order?:"ASC"|"DESC",limit?:number}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=${chain}&order=${order}&limit=${limit}`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
      name: 'getWalletTokenBalancesPrices',
      requiredParams: ['chain', 'address'],
      optionalParams: [],
      dataSchema: 'bar_chart: token vs value (USD)',
      run: async ({ chain, address }:{chain:string,address:string}) => {
        const res = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({ chain, address });
        return res.raw;
      }
    },
  {
    name: 'getTopGainersTokens',
    requiredParams: ['chain'],
    optionalParams: ['minMarketCap', 'securityScore', 'timeFrame'],
    dataSchema: 'table: token, % gain, price, volume',
    run: async ({ chain = 'eth', minMarketCap = 50000000, securityScore = 80, timeFrame = '1d' }: { chain?: string; minMarketCap?: number; securityScore?: number; timeFrame?: string }) => {
      // await initMoralis(config.MORALIS_KEY);
      // const res = await Moralis.EvmApi.marketData.getTopGainersTokens({ chain, minMarketCap, securityScore, timeFrame });
      // return res.raw;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
      };
      
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=${chain}&min_market_cap=${minMarketCap}&security_score=${securityScore}&time_frame=${timeFrame}`, options)
      const data = await res.json();
      return data
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    requiredParams: [],
    optionalParams: [],
    dataSchema: 'table: token, market cap, price',
    run: async () => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return res.raw;
    }
  },
  {
    name: 'searchTokens',
    requiredParams: ['chain'],
    optionalParams: ['query', 'limit'],
    dataSchema: 'list: token results sorted by relevance',
    run: async ({ chain = 'eth', query = '', limit = 10 }: { chain?: string; query?: string; limit?: number }) => {
      // await initMoralis(config.MORALIS_KEY);
      // const res = await Moralis.EvmApi.token.searchTokens({ query, chains: [chain], limit, isVerifiedContract: true, sortBy: 'volume1hDesc', boostVerifiedContracts: true });
      // return res.raw;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
      };
      
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/tokens/search?query=${query}&chains=${chain}&limit=${limit}&isVerifiedContract=true&sortBy=volume1hDesc&boostVerifiedContracts=true`, options)
      const data = await res.json();
      return data
    }
  },
  {
    name: 'getFilteredTokens',
    requiredParams: ['chain'],
    optionalParams: ['filters', 'sortBy', 'limit'],
    dataSchema: 'table: token, volume, market cap, score',
    run: async ({ chain = 'eth', filters = [], sortBy = {}, limit = 10 }: { chain?: string; filters?: any[]; sortBy?: any; limit?: number }) => {
      // await initMoralis(config.MORALIS_KEY);
      // const res = await Moralis.EvmApi.discovery.getTokens({ chain, filters, sortBy, limit });
      // return res.raw;
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
        body: JSON.stringify({
          "chain": chain,
          "filters": filters,
          "sortBy": sortBy,
          "limit": limit
        })
      };
      
      const res = await fetch('https://deep-index.moralis.io/api/v2.2/discovery/tokens', options)
      const data = await res.json();
      return data
    }
  },
  {
    name: 'getTokenPrice',
    requiredParams: ['chain', 'address'],
    optionalParams: [],
    dataSchema: 'stat_card: current price, % changes',
    run: async ({ chain = '0x1', address }: { chain?: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.token.getTokenPrice({ chain, address, include: 'percent_change' });
      return res.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    requiredParams: ['chain', 'tokenAddress'],
    optionalParams: ['order', 'limit'],
    dataSchema: 'stat_card: holder count, change percent',
    run: async ({ chain = '0x1', tokenAddress, order = 'DESC', limit = 10 }: { chain?: string; tokenAddress: string; order?: 'ASC' | 'DESC'; limit?: number }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.token.getTokenOwners({ chain, tokenAddress, order  ,limit:limit });
      return res.raw;
    }
  },
  {
    name: 'getHistoricalTokenHolders',
    requiredParams: ['chain', 'address'],
    optionalParams: ['fromDate', 'toDate', 'timeFrame'],
    dataSchema: 'line_chart: date vs holder count',
    run: async ({ chain = 'eth', address, fromDate, toDate, timeFrame = '1d' }: { chain?: string; address: string; fromDate?: string; toDate?: string; timeFrame?: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const now = new Date();
      const defaultTo = now.toISOString();
      const defaultFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },    
      };
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=${chain}`+fromDate ? `&fromDate=${fromDate}` : ''+toDate ? `&toDate=${toDate}` : '', options)
      const data = await res.json();
      return data
    }
  },
  {
    name: 'getTopProfitableWalletPerToken',
    requiredParams: ['chain', 'address'],
    optionalParams: [],
    dataSchema: 'table: wallet, ROI, profit',
    run: async ({ chain = '0x1', address }: { chain?: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.token.getTopProfitableWalletPerToken({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTokenStats',
    requiredParams: ['chain', 'address'],
    optionalParams: [],
    dataSchema: 'stat_card: volume, liquidity, market cap',
    run: async ({ chain, address }: { chain: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.token.getTokenStats({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getPairCandlesticks',
    requiredParams: ['chain', 'pairAddress'],
    optionalParams: ['fromDate', 'toDate', 'timeframe','currency'],
    dataSchema: 'candlestick_chart: OHLCV',
    run: async ({ chain = 'eth', pairAddress, fromDate, toDate, timeframe,currency = 'usd' }: { chain?: string; pairAddress: string; fromDate?: string; toDate?: string; timeframe?: string;currency?:string }) => {
      await initMoralis(config.MORALIS_KEY);
      const now = new Date();
      const defaultTo = now.toISOString();
      const defaultFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': config.MORALIS_KEY
        },
      };
      
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/pairs/${pairAddress}/ohlcv?chain=${chain}&timeframe=${timeframe}`+currency ? `&currency=${currency}` : ''+fromDate ? `&fromDate=${fromDate}` : ''+toDate ? `&toDate=${toDate}` : '', options)
      const data = await res.json();
      return data
      // const res = await Moralis.EvmApi.marketData.candlesticks({ pairAddress, chain, fromDate: fromDate || defaultFrom, toDate: toDate || defaultTo, timeframe: timeframe || '1d', currency: 'usd' });
      // return res.raw;
    }
  },
  {
    name: 'getNFTOwners',
    requiredParams: ['chain', 'address'],
    optionalParams: [],
    dataSchema: 'table: owner address, tokenId',
    run: async ({ chain = '0x1', address }: { chain?: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.nft.getNFTOwners({ chain, address, format: 'decimal' });
      return res.raw;
    }
  },
  {
    name: 'getNFTFloorPriceByContract',
    requiredParams: ['chain', 'address'],
    optionalParams: ['tokenId'],
    dataSchema: 'stat_card: floor price in ETH/USD',
    run: async ({ chain = '0x1', address, tokenId }: { tokenId?: string; chain?: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address, tokenId: tokenId || '' });
      return res.raw;
    }
  },
  {
    name: 'getNFTMetadata',
    requiredParams: ['network', 'address'],
    optionalParams: [],
    dataSchema: 'card: name, image, attributes, creator',
    run: async ({ network, address }: { network: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.SolApi.nft.getNFTMetadata({ network, address });
      return res.raw;
    }
  },
  {
    name: 'getNFTTraitsByCollection',
    requiredParams: ['chain', 'address'],
    optionalParams: [],
    dataSchema: 'bar_chart: trait type vs rarity %',
    run: async ({ chain = '0x1', address }: { chain?: string; address: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTopNFTCollectionsByTradingVolume',
    requiredParams: [],
    optionalParams: [],
    dataSchema: 'table: collection, volume, trades, floor',
    run: async () => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.marketData.getHottestNFTCollectionsByTradingVolume();
      return res.raw;
    }
  },
  {
    name: 'getNFTSalePrices',
    requiredParams: ['chain', 'address'],
    optionalParams: ['tokenId'],
    dataSchema: 'line_chart: timestamp vs sale price',
    run: async ({ chain = '0x1', address, tokenId }: { chain?: string; address: string; tokenId?: string }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address, tokenId: tokenId || '' });
      return res.raw;
    }
  },
  {
    name: 'getNFTTrades',
    requiredParams: ['chain', 'address'],
    optionalParams: ['marketplace', 'limit'],
    dataSchema: 'table: buyer, seller, price, timestamp, tokenId',
    run: async ({ chain = '0x1', address, marketplace = 'opensea', limit = 3 }: { chain?: string; address: string; marketplace?: 'opensea' | 'blur' | 'looksrare' | 'x2y2' | '0xprotocol'; limit?: number }) => {
      await initMoralis(config.MORALIS_KEY);
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address, marketplace, limit, nftMetadata: true });
      return res.raw;
    }
  }
];
