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
