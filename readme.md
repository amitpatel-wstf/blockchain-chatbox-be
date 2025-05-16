# 🧠 Moralis AI Agent Chatbot

An AI agent that intelligently maps user blockchain queries to Moralis API tools. Supports multi-chain analysis for EVM and Solana wallets, tokens, NFTs, DeFi, and market data.

---

## 🚀 Features

- ✨ Supports function calling across 50+ Moralis endpoints
- 🌐 Handles EVM and Solana chains
- 📦 Modular tool separation by use case
- 📊 Returns schema hints for frontend visualizations
- 🤖 LangChain + GPT-4o based smart router

---

## 📁 Project Structure

```bash
src/
├── tools/
│   ├── wallet-tools.ts         # Wallet data (balances, swaps, domains)
│   ├── nft-tools.ts            # NFT queries (owners, floor, metadata)
│   ├── token-tools.ts          # Token stats (price, holders, analytics)
│   ├── market-tools.ts         # Market insights (trending, gainers)
│   ├── solana-tools.ts         # Solana portfolio, swaps, NFTs
│   └── tool-types.ts           # Shared `Tool` interface (future)
├── agent/
│   └── agent-router.ts         # Main AI agent router logic
└── config.ts                   # API keys and environment variables
```

---

## 🧩 Tool Interface

```ts
export interface Tool {
  name: string;
  requiredParams: string[];
  dataSchema: string; // visual hint: table, stat_card, etc.
  run: (params: Record<string, any>) => Promise<any>;
}
```

Each tool is self-contained, composable, and testable.

---

## 🛠️ Usage

```ts
const agent = new AIAgentRouter(process.env.OPENAI_API_KEY);
const response = await agent.handlePrompt("What's in my wallet 0x123...");
console.log(response);
```

---

## 📊 Visualization Hints

The `dataSchema` in each tool gives the frontend cues like:

- `stat_card`: for balance / price
- `table`: historical or structured data
- `grid`: images or NFTs
- `line_chart`, `bar_chart`, `candlestick_chart`: time-based charts

---

## 🔐 Setup

```bash
npm install
cp .env.example .env  # add MORALIS_KEY + OPENAI_API_KEY
```

---

## ✅ Supported Queries

- "What's my SOL balance?"
- "Who owns this NFT?"
- "Trending tokens on Ethereum"
- "My NFTs across chains"
- "Compare ETH and SOL value"

---

## 🧩 Extending

Just add a new tool in the appropriate file with:
```ts
{
  name: 'getMyNewAPI',
  requiredParams: [...],
  dataSchema: 'your_type_here',
  run: async (params) => { ... }
}
```
It’s automatically available to the agent.

---

## 💡 Tip

Use `getWalletActiveChains` to detect wallet activity, or combine Solana and EVM tools for deeper portfolio analytics.

---

## 📄 License

MIT – Customize and extend freely for your blockchain AI agent!
