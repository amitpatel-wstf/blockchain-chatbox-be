// src/tools/nft-tools.ts
import Moralis from 'moralis';
import config from '../config';

export const nftTools : any[] = [
  {
    name: 'getNFTOwners',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: owner address, tokenId',
    run: async ({ chain="0x1", address }: { chain?: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTOwners({ chain, address, format: 'decimal' });
      return res.raw;
    }
  },
  {
    name: 'getNFTFloorPriceByContract',
    requiredParams: ['chain', 'address', 'tokenId'],
    dataSchema: 'stat_card: floor price in ETH/USD',
    run: async ({ chain="0x1", address, tokenId }: { chain?: string; address: string, tokenId:string }) => {
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address,tokenId });
      return res.raw;
    }
  },
  {
    name: 'getNFTMetadata',
    requiredParams: ['network', 'address'],
    dataSchema: 'card: name, image, attributes, creator',
    run: async ({ network, address }: { network: string; address: string }) => {
      const res = await Moralis.SolApi.nft.getNFTMetadata({ network, address });
      return res.raw;
    }
  },
  {
    name: 'getNFTTraitsByCollection',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: trait type vs rarity %',
    run: async ({ chain="0x1", address }: { chain?: string; address: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address });
      return res.raw;
    }
  },
  {
    name: 'getTopNFTCollectionsByTradingVolume',
    requiredParams: [],
    dataSchema: 'table: collection, volume, trades, floor',
    run: async () => {
      const res = await Moralis.EvmApi.marketData.getHottestNFTCollectionsByTradingVolume();
      return res.raw;
    }
  },
  {
    name: 'getNFTSalePrices',
    requiredParams: ['chain', 'address', 'tokenId'],
    dataSchema: 'line_chart: timestamp vs sale price',
    run: async ({ chain="0x1", address, tokenId }: { chain?: string; address: string; tokenId: string }) => {
      const res = await Moralis.EvmApi.nft.getNFTSalePrices({ chain, address, tokenId });
      return res.raw;
    }
  },
  {
    name: 'getNFTTrades',
    requiredParams: ['chain', 'address'],
    dataSchema: 'table: buyer, seller, price, timestamp, tokenId',
    run: async ({ chain="0x1", address , marketplace='opensea', limit=3, nftMetadata=true }: { chain?: string; address: string; marketplace?: "opensea" | "blur" | "looksrare" | "x2y2" | "0xprotocol"; limit?: number; nftMetadata?: boolean }) => {
      const res = await Moralis.EvmApi.nft.getNFTTrades({ chain, address, marketplace:marketplace, limit, nftMetadata });
      return res.raw;
    }
  },
  {
    name: 'getWalletNFTCollections',
    requiredParams: ['chain', 'address'],
    dataSchema: 'grid: collection name, image, owned count',
    run: async ({ chain="0x1", address , limit=3 }: { chain?: string; address: string; limit?: number }) => {
      const res = await Moralis.EvmApi.nft.getWalletNFTCollections({ chain, address, limit });
      return res.raw;
    }
  }
];