// src/tools/nft-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const nftTools : any[] = [
  {
    name: 'getNFTOwners',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: owner address, tokenId',
    description: 'Get owners of a specific NFT collection',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTOwners({ chain, address, format: 'decimal' });
      return res.raw;
    }
  },
  {
    name: 'getNFTFloorPriceByContract',
    type: 'function',
    requiredParams: ['chain', 'address', 'tokenId'],
    dataSchema: 'stat_card: floor price in ETH/USD',
    description: 'Get floor price for an NFT collection',
    func: async ({ chain, address, tokenId }: { chain: string; address: string, tokenId:string }) => {
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address,tokenId });
      return res.raw;
    }
  },
  {
    name: 'getNFTMetadata',
    type: 'function',
    requiredParams: ['network', 'address'],
    dataSchema: 'card: name, image, attributes, creator',
    description: 'Get metadata for an NFT',
    func: async ({ network, address }: { network: string; address: string }) => {
      const res = await Moralis.SolApi.nft.getNFTMetadata({ network, address });
      return res.raw;
    }
  },
  {
    name: 'getNFTTraitsByCollection',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: trait type vs rarity %',
    description: 'Get traits for an NFT collection',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTopNFTCollectionsByTradingVolume',
    type: 'function',
    requiredParams: [],
    dataSchema: 'table: collection, volume, trades, floor',
    description: 'Get top NFT collections by trading volume',
    func: async () => {
      const res = await Moralis.EvmApi.marketData.getHottestNFTCollectionsByTradingVolume();
      return res.raw;
    }
  },
  {
    name: 'getNFTSalePrices',
    type: 'function',
    requiredParams: ['chain', 'address', 'tokenId'],
    dataSchema: 'line_chart: timestamp vs sale price',
    description: 'Get sale prices for an NFT',
    func: async ({ chain, address, tokenId }: { chain: string; address: string; tokenId: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address, tokenId });
      return res.raw;
    }
  },
  {
    name: 'getNFTTrades',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: buyer, seller, price, timestamp, tokenId',
    description: 'Get trades for an NFT',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address, marketplace: 'opensea', limit: 3, nftMetadata: true });
      return res.raw;
    }
  },
  {
    name: 'getWalletNFTCollections',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'grid: collection name, image, owned count',
    description: 'Get NFT collections owned by a wallet',
    func: async ({ chain, address }: { chain: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getWalletNFTCollections({ chain, address });
      return res.raw;
    }
  }
];
