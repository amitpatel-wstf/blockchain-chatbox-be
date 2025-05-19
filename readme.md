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


# Blockchain Chat SDK

A powerful SDK for building blockchain-powered chat applications with AI capabilities. This SDK provides an easy-to-use interface for interacting with blockchain data through natural language prompts.

## Features

- 🤖 AI-powered natural language processing for blockchain queries
- 🔗 Supports multiple blockchain networks (Ethereum, Polygon, BSC, etc.)
- 💰 Query wallet balances, token prices, NFT data, and more
- 🛠️ Easy integration with existing Node.js/TypeScript projects
- 🔒 Secure API key management

## Installation

```bash
npm install blockchain-chat-sdk
# or
yarn add blockchain-chat-sdk
```

## Prerequisites

- Node.js 16.x or later
- OpenAI API key
- Moralis API key

## Getting Started

1. Install the package:

```bash
npm install blockchain-chat-sdk
```

2. Import and initialize the SDK:

```typescript
import { createBlockchainChatSDK } from 'blockchain-chat-sdk';

// Initialize the SDK with your API keys
const sdk = createBlockchainChatSDK({
  openaiApiKey: 'your-openai-api-key',
  moralisApiKey: 'your-moralis-api-key',
});
```

## Usage

### Basic Example

```typescript
// Handle a user prompt
const response = await sdk.handlePrompt("What's the balance of vitalik.eth?");
console.log(response);
```

### Available Methods

#### `handlePrompt(prompt: string)`

Process a natural language prompt and return a response with blockchain data.

**Parameters:**
- `prompt` (string): The user's natural language query

**Returns:**
```typescript
{
  message: string;      // The AI's response
  summary: string;      // Summary of the response (if applicable)
  prompt: string;      // The original prompt
  status: boolean;      // Whether the request was successful
  data?: any;          // Additional data (if any)
}
```

#### `getAgentRouter()`

Get direct access to the underlying AIAgentRouter instance for advanced use cases.

**Returns:** Instance of `AIAgentRouter`

## Environment Variables

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=your_openai_api_key
MORALIS_KEY=your_moralis_api_key
PORT=3000
```

## Error Handling

The SDK throws the following error types:

- `Error`: When required API keys are missing
- `Error`: When there's an issue processing the prompt

## Examples

### Query Wallet Balance

```typescript
const response = await sdk.handlePrompt("What's the ETH balance of 0x1234...?");
```

### Get Token Prices

```typescript
const response = await sdk.handlePrompt("What's the current price of Bitcoin?");
```

### Query NFT Data

```typescript
const response = await sdk.handlePrompt("Show me the NFTs owned by 0x1234...");
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in our GitHub repository or contact our support team at support@example.com.

## Acknowledgments

- Built with [OpenAI](https://openai.com/)
- Powered by [Moralis](https://moralis.io/)
- Inspired by the need for better blockchain data accessibility


## 💡 Tip

Use `getWalletActiveChains` to detect wallet activity, or combine Solana and EVM tools for deeper portfolio analytics.

---

## 📄 License

MIT – Customize and extend freely for your blockchain AI agent!
