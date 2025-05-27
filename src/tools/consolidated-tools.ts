import Moralis from 'moralis';
import config from '../config';

// Type Definitions
export interface ToolParams extends Record<string, any> {}

export interface Tool {
  name: string;
  requiredParams: string[];
  run: (params: ToolParams) => Promise<any>;
  dataSchema?: string;
  description?: string;
}

// Initialize Moralis if not already initialized
let isMoralisInitialized = false;

export async function initMoralis(apiKey: string): Promise<void> {
  if (!isMoralisInitialized) {
    await Moralis.start({ apiKey });
    isMoralisInitialized = true;
  }
}

// Utility function for API calls with error handling
async function fetchMoralisData(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'accept': 'application/json',
        'X-API-Key': config.MORALIS_KEY,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Moralis API error (${response.status}): ${errorData.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchMoralisData:', error);
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}

/**
 * Wallet Tools
 * Tools for interacting with blockchain wallets
 */
export const walletTools: Tool[] = [
  {
    name: 'getWalletTokenBalancesPrices',
    description: 'Get token balances with prices for a wallet address',
    requiredParams: ['address'],
    dataSchema: 'bar_chart: token vs value (USD)',
    run: async ({ chain = '0x1', address }: ToolParams) => {
      const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({ 
        chain, 
        address 
      });
      return response.raw;
    }
  },
  {
    name: 'getWalletNFTs',
    description: 'Get NFTs owned by a wallet address',
    requiredParams: ['address'],
    dataSchema: 'grid: NFT images with metadata',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({ 
        chain, 
        address, 
        limit 
      });
      return response.raw;
    }
  },
  {
    name: 'getWalletActiveChains',
    description: 'Get list of active blockchains for a wallet address',
    requiredParams: ['address'],
    dataSchema: 'list: active blockchain names',
    run: async ({ address, chain = '0x1' }: ToolParams) => {
      const response = await Moralis.EvmApi.wallets.getWalletActiveChains({ 
        address, 
        chains: [chain] 
      });
      return response.raw;
    }
  },
  {
    name: 'getWalletNetWorth',
    description: 'Get total net worth of a wallet across all chains',
    requiredParams: ['address'],
    dataSchema: 'stat_card: total net worth in USD',
    run: async ({ address, chain = '0x1' }: ToolParams) => {
      const response = await Moralis.EvmApi.wallets.getWalletNetWorth({ 
        address, 
        chains: [chain] 
      });
      return response.raw;
    }
  },
  {
    name: 'getWalletProfitabilitySummary',
    description: 'Get profitability summary for a wallet',
    requiredParams: ['address'],
    dataSchema: 'stat_card: total pnl, avg entry, current value',
    run: async ({ chain = '0x1', address }: ToolParams) => {
      const response = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({ 
        chain, 
        address 
      });
      return response.raw;
    }
  },
  {
    name: 'getSwapsByWalletAddress',
    description: 'Get swap transactions for a wallet address',
    requiredParams: ['address'],
    dataSchema: 'table: swap txs, from token, to token, amount, time',
    run: async ({ address, chain = 'eth', limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/wallets/${address}/swaps?chain=${chain}&limit=${limit}&order=DESC`
      );
    }
  },
  {
    name: 'resolveAddressToDomain',
    description: 'Resolve a wallet address to its ENS domain',
    requiredParams: ['address'],
    dataSchema: 'text: resolved domain string (e.g., vitalik.eth)',
    run: async ({ address }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/resolve/${address}/domain`
      );
    }
  },
  {
    name: 'resolveENSDomain',
    description: 'Resolve an ENS domain to its wallet address',
    requiredParams: ['domain'],
    dataSchema: 'text: resolved wallet address from ENS',
    run: async ({ domain }: ToolParams) => {
      const response = await Moralis.EvmApi.resolve.resolveENSDomain({ domain });
      return response.raw;
    }
  }
];

/**
 * Market Tools
 * Tools for market data and token analysis
 */
export const marketTools: Tool[] = [
  {
    name: 'getTrendingTokens',
    description: 'Get trending tokens with their volume and trend score',
    requiredParams: [],
    dataSchema: 'table: token, volume, trend score',
    run: async ({ chain = 'eth' }: ToolParams = {}) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=${chain}`
      );
    }
  },
  {
    name: 'getTopGainersTokens',
    description: 'Get top gaining tokens with their percentage gain, price, and volume',
    requiredParams: [],
    dataSchema: 'table: token, % gain, price, volume',
    run: async (params: ToolParams = {}) => {
      const {
        chain = 'eth',
        min_market_cap = 50000000,
        security_score = 80,
        time_frame = '1d'
      } = params;
      
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?` +
        `chain=${chain}&min_market_cap=${min_market_cap}&` +
        `security_score=${security_score}&time_frame=${time_frame}`
      );
    }
  },
  {
    name: 'getTopERC20TokensByMarketCap',
    description: 'Get top ERC20 tokens by market capitalization',
    requiredParams: [],
    dataSchema: 'table: token, market cap, price',
    run: async () => {
      const response = await Moralis.EvmApi.marketData.getTopERC20TokensByMarketCap();
      return response.raw;
    }
  },
  {
    name: 'searchTokens',
    description: 'Search for tokens by name, symbol, or contract address',
    requiredParams: ['query'],
    dataSchema: 'list: token results with name, symbol, address, and price',
    run: async ({ query, chain = 'eth', limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chain}&addresses%5B0%5D=${query}`
      );
    }
  },
  {
    name: 'getTokenPrice',
    description: 'Get the current price of a token',
    requiredParams: ['address'],
    dataSchema: 'stat_card: current price, % changes',
    run: async ({ chain = '0x1', address }: ToolParams) => {
      const response = await Moralis.EvmApi.token.getTokenPrice({ 
        chain, 
        address, 
        include: 'percent_change' 
      });
      return response.raw;
    }
  },
  {
    name: 'getTokenHolderStats',
    description: 'Get holder statistics for a token',
    requiredParams: ['address'],
    dataSchema: 'stat_card: holder count, change percent',
    run: async ({ address, chain = 'eth' }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=${chain}`
      );
    }
  },
  {
    name: 'getTokenTrades',
    description: 'Get recent trades for a token',
    requiredParams: ['address'],
    dataSchema: 'table: timestamp, amount, price, from, to',
    run: async ({ address, chain = '0x1', limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/erc20/${address}/trades?chain=${chain}&limit=${limit}`
      );
    }
  },
  {
    name: 'getTokenTransfers',
    description: 'Get token transfer events',
    requiredParams: ['address'],
    dataSchema: 'table: from, to, value, transaction_hash, timestamp',
    run: async ({ address, chain = '0x1', limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/erc20/${address}/transfers?chain=${chain}&limit=${limit}`
      );
    }
  }
];

/**
 * NFT Tools
 * Tools for interacting with NFTs and NFT collections
 */
export const nftTools: Tool[] = [
  {
    name: 'getNFTMetadata',
    description: 'Get metadata for an NFT collection or specific NFT',
    requiredParams: ['address'],
    dataSchema: 'json: NFT metadata',
    run: async ({ chain = '0x1', address, tokenId }: ToolParams) => {
      // If tokenId is provided, get metadata for a specific NFT
      if (tokenId) {
        const response = await Moralis.EvmApi.nft.getNFTMetadata({
          chain,
          address,
          tokenId: tokenId.toString()
        });
        return response.raw;
      }
      
      // Otherwise, get collection-level metadata
      const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
        chain,
        address
      });
      return response.raw;
    }
  },
  {
    name: 'getNFTTokenIds',
    description: 'Get all token IDs for an NFT collection',
    requiredParams: ['address'],
    dataSchema: 'list: token IDs with metadata',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      const response = await Moralis.EvmApi.nft.getContractNFTs({
        chain,
        address,
        limit: Number(limit)
      });
      return response.raw;
    }
  },
  {
    name: 'getNFTTrades',
    description: 'Get recent trades for an NFT collection',
    requiredParams: ['address'],
    dataSchema: 'table: trade details including price, from, to, token ID',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/nft/${address}/trades?chain=${chain}&limit=${limit}`
      );
    }
  },
  {
    name: 'getNFTSales',
    description: 'Get recent sales for an NFT collection',
    requiredParams: ['address'],
    dataSchema: 'table: sale details including price, buyer, seller, token ID',
    run: async ({ chain = '0x1', address, limit = 10, fromDate, toDate }: ToolParams) => {
      let url = `https://deep-index.moralis.io/api/v2.2/nft/${address}/trades?chain=${chain}&limit=${limit}`;
      
      if (fromDate) url += `&from_date=${fromDate}`;
      if (toDate) url += `&to_date=${toDate}`;
      
      return fetchMoralisData(url);
    }
  },
  {
    name: 'getNFTLowestPrice',
    description: 'Get the lowest listed price for an NFT collection',
    requiredParams: ['address'],
    dataSchema: 'stat_card: lowest price with marketplace info',
    run: async ({ chain = '0x1', address }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/nft/${address}/lowestprice?chain=${chain}&days=1`
      );
    }
  },
  {
    name: 'getNFTTokenOwners',
    description: 'Get all owners of a specific NFT collection',
    requiredParams: ['address'],
    dataSchema: 'table: owner addresses with token IDs',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      const response = await Moralis.EvmApi.nft.getNFTOwners({
        chain,
        address,
        limit: Number(limit)
      });
      return response.raw;
    }
  },
  {
    name: 'getNFTTransfers',
    description: 'Get transfer history for an NFT collection',
    requiredParams: ['address'],
    dataSchema: 'table: transfer history with from, to, token ID, and timestamp',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/nft/${address}/transfers?chain=${chain}&limit=${limit}`
      );
    }
  },
  {
    name: 'searchNFTs',
    description: 'Search for NFTs by name or symbol',
    requiredParams: ['query'],
    dataSchema: 'list: NFT collections matching search query',
    run: async ({ query, chain = 'eth', limit = 10 }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/nft/search?chain=${chain}&format=decimal&q=${query}&filter=name&limit=${limit}`
      );
    }
  }
];

/**
 * Transaction Tools
 * Tools for interacting with blockchain transactions
 */
export const transactionTools: Tool[] = [
  {
    name: 'getTransaction',
    description: 'Get details of a specific transaction',
    requiredParams: ['transactionHash'],
    dataSchema: 'json: transaction details',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      const response = await Moralis.EvmApi.transaction.getTransaction({
        chain,
        transactionHash
      });
      return response.raw;
    }
  },
  {
    name: 'getWalletTransactions',
    description: 'Get transaction history for a wallet address',
    requiredParams: ['address'],
    dataSchema: 'table: transaction history with details',
    run: async ({ chain = '0x1', address, limit = 10 }: ToolParams) => {
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        chain,
        address,
        limit: Number(limit)
      });
      return response.raw;
    }
  },
  {
    name: 'getInternalTransactions',
    description: 'Get internal transactions for a transaction hash',
    requiredParams: ['transactionHash'],
    dataSchema: 'table: internal transaction details',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/internal-transactions?chain=${chain}`
      );
    }
  },
  {
    name: 'getTransactionLogs',
    description: 'Get event logs for a specific transaction',
    requiredParams: ['transactionHash'],
    dataSchema: 'table: transaction event logs',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      // First get the transaction to get the contract address
      const tx = await Moralis.EvmApi.transaction.getTransaction({
        chain,
        transactionHash
      });
      
      if (!tx?.result?.to) {
        throw new Error('Could not find contract address for transaction');
      }
      
      // Get transaction logs using the Moralis API
      const response = await fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/logs?chain=${chain}`
      );
      
      if (!response || !response.result) {
        throw new Error('No logs found for this transaction');
      }
      
      return response.raw;
    }
  },
  {
    name: 'getTokenTransfersByTransaction',
    description: 'Get token transfers for a specific transaction',
    requiredParams: ['transactionHash'],
    dataSchema: 'table: token transfers in the transaction',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/erc20-transfers?chain=${chain}`
      );
    }
  },
  {
    name: 'getNFTTransfersByTransaction',
    description: 'Get NFT transfers for a specific transaction',
    requiredParams: ['transactionHash'],
    dataSchema: 'table: NFT transfers in the transaction',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/nft-transfers?chain=${chain}`
      );
    }
  },
  {
    name: 'getTransactionReceipt',
    description: 'Get the receipt of a transaction by transaction hash',
    requiredParams: ['transactionHash'],
    dataSchema: 'json: transaction receipt details',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      // Use the web3 API to get the transaction receipt
      const response = await Moralis.EvmApi.transaction.getTransaction({
        chain,
        transactionHash
      });
      
      // Get the receipt using the Moralis API
      const receiptResponse = await fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/receipt?chain=${chain}`
      );
      
      if (!receiptResponse) {
        throw new Error('Failed to fetch transaction receipt');
      }
      
      const receipt = receiptResponse.result || receiptResponse;
      
      return {
        ...response.raw,
        receipt: {
          status: receipt.status,
          blockHash: receipt.blockHash,
          blockNumber: receipt.blockNumber,
          contractAddress: receipt.contractAddress,
          cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
          effectiveGasPrice: receipt.effectiveGasPrice.toString(),
          from: receipt.from,
          gasUsed: receipt.gasUsed.toString(),
          logs: receipt.logs,
          logsBloom: receipt.logsBloom,
          to: receipt.to,
          transactionHash: receipt.transactionHash,
          transactionIndex: receipt.transactionIndex,
          type: receipt.type
        }
      };
    }
  },
  {
    name: 'getTransactionVerbose',
    description: 'Get verbose transaction details including internal transactions and logs',
    requiredParams: ['transactionHash'],
    dataSchema: 'json: verbose transaction details',
    run: async ({ chain = '0x1', transactionHash }: ToolParams) => {
      return fetchMoralisData(
        `https://deep-index.moralis.io/api/v2.2/transaction/${transactionHash}/verbose?chain=${chain}`
      );
    }
  }
];

// Export all tools in a single object for easier importing
export const allTools = {
  ...walletTools.reduce((acc, tool) => ({ ...acc, [tool.name]: tool }), {}),
  ...marketTools.reduce((acc, tool) => ({ ...acc, [tool.name]: tool }), {}),
  ...nftTools.reduce((acc, tool) => ({ ...acc, [tool.name]: tool }), {}),
  ...transactionTools.reduce((acc, tool) => ({ ...acc, [tool.name]: tool }), {})
};

// Export a function to get a tool by name
export function getToolByName(name: string): Tool | undefined {
  return allTools[name as keyof typeof allTools];
}

// Export a function to get all tools as an array
export function getAllTools(): Tool[] {
  return [
    ...walletTools,
    ...marketTools,
    ...nftTools,
    ...transactionTools
  ];
}
