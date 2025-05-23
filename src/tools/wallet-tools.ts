// src/tools/wallet-tools.ts
import Moralis from 'moralis';
import config from '../config';

/**
 * Collection of wallet-related tools for interacting with blockchain data
 * All tools require proper authentication via Moralis API key
 */
export const walletTools = [
  {
    /**
     * Fetches token balances with their current USD values for a given wallet address
     * @param {string} chain - Blockchain network (e.g., 'eth', 'bsc')
     * @param {string} address - Wallet address to query
     * @returns {Promise<Object>} Token balances with prices in USD
     */
    name: 'getWalletTokenBalancesPrices',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'bar_chart: token vs value (USD)',
    description: 'Get token balances with prices for a wallet address',
    func: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({ chain, address });
      return res.raw;
    }
  },
  {
    /**
     * Retrieves all NFTs owned by a wallet address
     * @param {string} chain - Blockchain network (e.g., 'eth', 'polygon')
     * @param {string} address - Wallet address to query
     * @returns {Promise<Object>} List of NFTs with metadata
     */
    name: 'getWalletNFTs',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'grid: NFT images with metadata',
    description: 'Get NFTs owned by a wallet address',
    func: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.nft.getWalletNFTs({ chain, address });
      return res.raw;
    }
  },
  {
    /**
     * Gets list of blockchains where the wallet has activity
     * @param {string} address - Wallet address to check
     * @returns {Promise<Object>} List of active blockchain networks for the wallet
     */
    name: 'getWalletActiveChains',  
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'list: active blockchain names',
    description: 'Get active blockchain names for a wallet address',
    func: async ({ address }:{address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletActiveChains({ address });
      return res.raw;
    }
  },
  {
    /**
     * Calculates total net worth of a wallet across all supported chains
     * @param {string} address - Wallet address to analyze
     * @returns {Promise<Object>} Net worth information in USD
     */
    name: 'getWalletNetWorth',
    type: 'function',
    requiredParams: ['address','chain'],
    dataSchema: 'stat_card: total net worth in USD',
    description: 'Get net worth of a wallet address',
    func: async ({ address,chain="0x1" }:{address:string,chain?:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletNetWorth({ address, chains:[chain] });
      return res.raw;
    }
  },
  {
    /**
     * Gets profitability metrics including PnL for a wallet
     * @param {string} chain - Blockchain network (e.g., 'eth', 'bsc')
     * @param {string} address - Wallet address to analyze
     * @returns {Promise<Object>} Profit/loss summary with entry prices and current values
     */
    name: 'getWalletProfitabilitySummary',
    type: 'function',
    requiredParams: ['chain', 'address'],
    dataSchema: 'stat_card: total pnl, avg entry, current value',
    description: 'Get profitability summary for a wallet address',
    func: async ({ chain, address }:{chain:string,address:string}) => {
      const res = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({ chain, address });
      return res.raw;
    }
  },
  {
    /**
     * Retrieves swap history for a wallet address
     * @param {string} address - Wallet address to query
     * @param {string} [chain='eth'] - Blockchain network (default: 'eth')
     * @returns {Promise<Object>} List of swap transactions with token details
     */
    name: 'getSwapsByWalletAddress',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    description: 'Get swap transactions for a wallet address',
    func: async ({ address, chain="eth" }:{chain:string,address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=${chain}&order=DESC`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    /**
     * Resolves a wallet address to its associated domain name (ENS, Unstoppable, etc.)
     * @param {string} address - Wallet address to resolve
     * @returns {Promise<Object>} Domain information if resolved
     */
    name: 'resolveAddressToDomain',
    type: 'function',
    requiredParams: ['address'],
    dataSchema: 'text: resolved domain string (e.g., vitalik.eth)',
    description: 'Resolve an ENS domain to its associated wallet address',
    func: async ({ address }:{address:string}) => {
      const res = await fetch(`https://deep-index.moralis.io/api/v2.2/resolve/${address}/domain`, {
        headers: { accept: 'application/json', 'X-API-Key': config.MORALIS_KEY }
      });
      return res.json();
    }
  },
  {
    /**
     * Resolves an ENS domain to its associated wallet address
     * @param {string} domain - ENS domain (e.g., 'vitalik.eth')
     * @returns {Promise<Object>} Resolved wallet address information
     */
    name: 'resolveENSDomain',
    type: 'function',
    requiredParams: ['domain'],
    description: 'Resolve an ENS domain to its associated wallet address',
    dataSchema: 'text: resolved wallet address from ENS',
    func: async ({ domain }:{domain:string}) => {
      const res = await Moralis.EvmApi.resolve.resolveENSDomain({ domain });
      return res?.raw;
    }
  }
];
