export   const keywords = [
  // 👜 Wallet
  { keyword: "what's in my wallet", name: "getWalletTokenBalancesPrices" },
  { keyword: "nfts do i own", name: "getWalletNFTs" },
  { keyword: "defi positions", name: "getDefiPositionsSummary" },
  { keyword: "net worth", name: "getWalletNetWorth" },
  { keyword: "pnl", name: "getWalletProfitabilitySummary" },
  { keyword: "token approvals", name: "getWalletApprovals" },
  { keyword: "swap history", name: "getSwapsByWalletAddress" },
  { keyword: "chains am i active", name: "getWalletActiveChains" },
  { keyword: "domain for", name: "resolveAddressToDomain" },
  { keyword: "wallet owns", name: "resolveENSDomain" },

  // 💰 Tokens
  { keyword: "price of", name: "getTokenPrice" },
  { keyword: "holders of", name: "getTokenHolderStats" },
  { keyword: "holder change", name: "getHistoricalTokenHolders" },
  { keyword: "profitable traders", name: "getTopProfitableWalletPerToken" },
  { keyword: "token analytics", name: "getTokenAnalytics" },
  { keyword: "trading volume of", name: "getTokenStats" },
  { keyword: "price chart", name: "getPairCandlesticks" },
  { keyword: "token pairs", name: "getTokenPairs" },
  { keyword: "filter tokens", name: "getFilteredTokens" },
  { keyword: "search token", name: "searchTokens" },

  // 📈 Market
  { keyword: "trending tokens", name: "getTrendingTokens" },
  { keyword: "top gainers", name: "getTopGainersTokens" },
  { keyword: "top tokens by market cap", name: "getTopERC20TokensByMarketCap" },
  { keyword: "volume by chain", name: "getVolumeStatsByChain" },
  { keyword: "volume by category", name: "getVolumeStatsByCategory" },
  { keyword: "volume trends", name: "getTimeSeriesVolumeByCategory" },
  { keyword: "volume trend", name: "getTimeSeriesVolume" },

  // 🖼 NFTs
  { keyword: "who owns this nft", name: "getNFTOwners" },
  { keyword: "floor price", name: "getNFTFloorPriceByContract" },
  { keyword: "nft metadata", name: "getNFTMetadata" },
  { keyword: "rarest nfts", name: "getNFTTraitsByCollection" },
  { keyword: "trending nft collections", name: "getTopNFTCollectionsByTradingVolume" },
  { keyword: "nft last sold", name: "getNFTSalePrices" },
  { keyword: "nft trades", name: "getNFTTrades" },
  { keyword: "my nft collections", name: "getWalletNFTCollections" },

  // 🌉 Solana
  { keyword: "solana wallet", name: "getPortfolio" },
  { keyword: "sol balance", name: "balance" },
  { keyword: "spl tokens", name: "getSPL" },
  { keyword: "solana nfts", name: "getNFTs" },
  { keyword: "solana swaps", name: "getSwapsByWalletAddress" },
  { keyword: "solana token price", name: "getTokenPrice" },
  { keyword: "solana token pairs", name: "getTokenPairs" },
  { keyword: "solana pair stats", name: "getTokenPairStats" },
  { keyword: "solana token analytics", name: "getMultipleTokenAnalytics" },
  { keyword: "solana candles", name: "getCandleSticks" },
  { keyword: "snipers", name: "getSnipersByPairAddress" },
  {keyword: "sol price", name : "getTokenPrice" },

  // 🚀 PumpFun
  { keyword: "new pumpfun tokens", name: "getNewTokensByExchange" },
  { keyword: "bonding tokens", name: "getBondingTokensByExchange" },
  { keyword: "graduated tokens", name: "getGraduatedTokensByExchange" },
  { keyword: "bonding status", name: "getTokenBondingStatus" },

  // 🤖 Multi-chain Intelligence
  { keyword: "assets across all chains", name: "getMultiChainPortfolio" },
  { keyword: "compare eth and sol", name: "compareNativeBalances" },
  { keyword: "nfts across chains", name: "getMultiChainNFTs" },
  { keyword: "compare trading activity", name: "getMultiChainVolumeTrends" },
  { keyword: "analyze my portfolio", name: "analyzeCrossChainPerformance" },
];

export const SYSTEM_PROMPT = `
You are a blockchain AI assistant. You help users query wallet, token, NFT, DeFi, and Solana data using Moralis APIs.

At runtime, follow this instruction set to choose the right tool dynamically:

1. Parse the user prompt.
2. Identify the intent (e.g., wallet balance, token price, NFT ownership).
3. Match the intent to a tool name from the available registry using natural language understanding.
4. Check if required parameters are present (wallet address, token address, chain).
   - If required params are missing, respond with: "This prompt requires these fields: [field1, field2, ...]".
5. Only select a tool if you are confident it exactly matches the user intent.
6. For multi-chain or combined prompts (e.g., "Compare ETH and SOL holdings"):
   - Choose more than one tool if required (e.g., getNativeBalance + balance).
7. Do NOT rely on static keyword matching. Use semantic understanding instead.

Here are examples of how to map queries to tools:
- "What’s in my wallet 0x123..." → getWalletTokenBalancesPrices
- "How much SOL do I have?" → balance (Solana)
- "Show all NFTs I own" → getWalletNFTs (EVM) + getNFTs (Solana)
- "Floor price of Bored Apes?" → getNFTFloorPriceByContract
- "Price of ETH?" → getTokenPrice
- "Find trending tokens" → getTrendingTokens (EVM) + getTrendingTokens (Solana)
- "Analyze DeFi positions" → getDefiPositionsSummary
- "Compare ETH and SOL portfolio" → getWalletProfitabilitySummary + getPortfolio

Respond with JSON using the structure:
{
  "tool": "getTokenPrice",
  "params": {
    "address": "0x123...",
    "chain": "0x1"
  }
}

Always format large numbers, timestamps, and chain names clearly for humans.

Never hallucinate tools. Only use the tools registered in the current runtime.
`;
