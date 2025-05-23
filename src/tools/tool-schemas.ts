export const toolSchemas = [
  // Wallet Tools
  {
    type: "function",
    function: {
      name: "getWalletTokenBalancesPrices",
      description: "Get token balances with prices for a wallet address",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "The blockchain network (e.g., 'eth', 'bsc')" },
          address: { type: "string", description: "The wallet address to query" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWalletNFTs",
      description: "Get NFTs owned by a wallet address",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "The blockchain network (e.g., 'eth', 'bsc')" },
          address: { type: "string", description: "The wallet address to query" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWalletActiveChains",
      description: "Get list of active blockchains for a wallet address",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "The wallet address to query" }
        },
        required: ["address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWalletProfitabilitySummary",
      description: "Get profitability summary for a wallet",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "The blockchain network (e.g., 'eth', 'bsc')" },
          address: { type: "string", description: "The wallet address to query" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getSwapsByWalletAddress",
      description: "Get swap transactions for a wallet address",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "The wallet address to query" },
          chain: { type: "string", description: "The blockchain network (e.g., 'eth', 'bsc')", default: "eth" }
        },
        required: ["address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "resolveAddressToDomain",
      description: "Resolve a wallet address to its ENS domain",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "The wallet address to resolve" }
        },
        required: ["address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "resolveENSDomain",
      description: "Resolve an ENS domain to its wallet address",
      parameters: {
        type: "object",
        properties: {
          domain: { type: "string", description: "The ENS domain to resolve (e.g., 'vitalik.eth')" }
        },
        required: ["domain"]
      }
    }
  },

  // Market Tools
  {
    type: "function",
    function: {
      name: "getTrendingTokens",
      description: "Get trending tokens with their volume and trend score",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getTopGainersTokens",
      description: "Get top gaining tokens with their percentage gain, price, and volume",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getTopERC20TokensByMarketCap",
      description: "Get top ERC20 tokens by market capitalization",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "searchTokens",
      description: "Search for tokens by query",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query for tokens" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getFilteredTokens",
      description: "Get filtered tokens based on specified criteria",
      parameters: {
        type: "object",
        properties: {
          filters: { type: "object", description: "Filters to apply" },
          sortBy: { type: "string", description: "Field to sort by" },
          limit: { type: "number", description: "Maximum number of results" }
        },
        required: ["filters", "sortBy", "limit"]
      }
    }
  },

  // NFT Tools
  {
    type: "function",
    function: {
      name: "getNFTOwners",
      description: "Get owners of a specific NFT collection",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network (e.g., 'eth', 'bsc')" },
          address: { type: "string", description: "NFT contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getNFTFloorPriceByContract",
      description: "Get floor price for an NFT collection",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "NFT contract address" },
          tokenId: { type: "string", description: "NFT token ID" }
        },
        required: ["chain", "address", "tokenId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getNFTMetadata",
      description: "Get metadata for an NFT",
      parameters: {
        type: "object",
        properties: {
          network: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "NFT contract address" }
        },
        required: ["network", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getNFTTraitsByCollection",
      description: "Get traits distribution for an NFT collection",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "NFT contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getTopNFTCollectionsByTradingVolume",
      description: "Get top NFT collections by trading volume",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getNFTSalePrices",
      description: "Get historical sale prices for an NFT",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "NFT contract address" },
          tokenId: { type: "string", description: "NFT token ID" }
        },
        required: ["chain", "address", "tokenId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getNFTTrades",
      description: "Get trades for an NFT collection",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "NFT contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWalletNFTCollections",
      description: "Get NFT collections owned by a wallet",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "Wallet address" }
        },
        required: ["chain", "address"]
      }
    }
  },

  // Token Tools
  {
    type: "function",
    function: {
      name: "getTokenPrice",
      description: "Get current price and price changes for a token",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "Token contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getTokenHolderStats",
      description: "Get holder statistics for a token",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "Token contract address" }
        },
        required: ["address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getHistoricalTokenHolders",
      description: "Get historical holder count for a token",
      parameters: {
        type: "object",
        properties: {
          address: { type: "string", description: "Token contract address" },
          fromDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
          toDate: { type: "string", description: "End date (YYYY-MM-DD)" },
          timeFrame: { type: "string", description: "Time frame for data points (e.g., '1d', '1w')" }
        },
        required: ["address", "fromDate", "toDate", "timeFrame"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getTopProfitableWalletPerToken",
      description: "Get top profitable wallets for a token",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "Token contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getTokenStats",
      description: "Get statistics for a token",
      parameters: {
        type: "object",
        properties: {
          chain: { type: "string", description: "Blockchain network" },
          address: { type: "string", description: "Token contract address" }
        },
        required: ["chain", "address"]
      }
    }
  },

  // Solana Tools (same as market tools for now, adjust as needed)
  {
    type: "function",
    function: {
      name: "getSolanaTrendingTokens",
      description: "Get trending tokens on Solana",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getSolanaTopGainers",
      description: "Get top gaining tokens on Solana",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "searchSolanaTokens",
      description: "Search for tokens on Solana",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query for tokens" }
        },
        required: ["query"]
      }
    }
  }
];