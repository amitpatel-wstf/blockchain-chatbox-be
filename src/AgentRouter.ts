import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { initMoralis, tools as moralisTools } from "./tools";
import dotenv from "dotenv";
import config from "./config";
import fs from "fs";
import path from "path";

dotenv.config();

// Tool interface definition
export interface Tool {
  name: string;
  requiredParams: string[];
  run: (params: Record<string, string>) => Promise<any>;
  dataSchema?: string; // Added for frontend use
}

interface AgentResponse {
  prompt: string;
  response: string;
  schemaHint?: string;
}

// Agent class definition
export class AIAgentRouter {
  private tools: Tool[] = [];
  private model: ChatOpenAI;

  constructor(apiKey: string) {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      openAIApiKey: apiKey,
      temperature: 0.3,
    });
  }

  registerTool(tool: Tool) {
    this.tools.push(tool);
  }

  private matchTool(userInput: string): Tool | undefined {
    const normalizedPrompt = userInput.toLowerCase();
    const keywords = [
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
  
    const matched =  keywords.find(k => normalizedPrompt.includes(k.keyword));
    if (!matched) return undefined;
    return this.tools.find(t => t.name === matched.name);
  }

  private extractParams(userInput: string): Record<string, string> {
    const match = userInput.match(/0x[a-fA-F0-9]{40}/);
    if (match) return { address: match[0], chain: "0x1" };
    if (userInput.includes("vitalik.eth")) return { domain: "vitalik.eth" };
    return {};
  }

  async handlePrompt(prompt: string): Promise<AgentResponse> {
    const tool = this.matchTool(prompt);
    if (!tool) return { prompt, response: "No matching tool found for this prompt." };

    const inputParams = this.extractParams(prompt);
    const missingParams = tool.requiredParams.filter(
      (param) => !(param in inputParams)
    );

    if (missingParams.length > 0) {
      return {
        prompt,
        response: `This prompt requires these fields, please provide: [${missingParams.join(", ")}].`
      };
    }

    try {
      const result = await tool.run(inputParams);
      return {
        prompt,
        response: JSON.stringify(result, null, 2),
        schemaHint: tool.dataSchema || undefined
      };
    } catch (error) {
      return {
        prompt,
        response: `Tool execution failed: ${error}`
      };
    }
  }
}

// === Vitest Test Case ===
// describe("AIAgentRouter", () => {
//   it("should handle prompts correctly", async () => {
async function test(){
    await initMoralis(config.MORALIS_KEY);
    const agent = new AIAgentRouter(config.OPENAI_API_KEY);
    moralisTools.forEach((tool: any) => agent.registerTool(tool));

    const prompts = [
      "What's in my wallet 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "What NFTs do I own at 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "Show my DeFi positions for 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj",
      "What is my net worth at 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "Generate a PnL for my wallet 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj",
      "What token approvals have I made for 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "Show my swap history for 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj",
      "What chains am I active on 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "What's the domain for 5VvSStWPjkDTUqp4J2XMwN2MEoXePsZH9PApaaazpoGj ?",
      "What wallet owns vitalik.eth?"
    ];

    const results: AgentResponse[] = [];

    for (const prompt of prompts) {
      const result = await agent.handlePrompt(prompt);
      results.push(result);
      console.log(`\nPrompt: ${result.prompt}\nResponse: ${result.response}`);
      if (result.schemaHint) console.log(`[Visualization Hint]: ${result.schemaHint}`);
    }

    fs.writeFileSync(
      path.resolve(__dirname, "./agent-output.json"),
      JSON.stringify(results, null, 2),
      "utf8"
    );
}

// test()
