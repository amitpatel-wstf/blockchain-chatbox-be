import { ChatOpenAI } from "@langchain/openai";
import { tools } from "./tools";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";
import { HUMAN_RESPONSE_PROMPT, keywords } from "./tools/constant";
import { Tool } from "./tools/types";

export interface AgentResponse {
  prompt: string;
  response: string;
  schemaHint?: string;
}

export interface ApiResponse {
  message: string;
  summary: string;
  prompt: string;
  status: boolean;
  data?: any;
}

const predefineQuestions: Array<{ keyword: string; name: string }> = [];

// Agent class definition
export class AIAgentRouter {
  private tools: Tool[] = [];
  private model: ChatOpenAI;

  constructor(openaiApiKey: string) {
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      openAIApiKey: openaiApiKey,
      temperature: 0.3,
    });

    // Load all tools
    this.tools = [
      ...walletTools,
      ...nftTools,
      ...tokenTools,
      ...marketTools,
      ...tools
    ];
  }

  registerTool(tool: Tool) {
    this.tools.push(tool);
  }

  private matchTool(userInput: string): Tool | undefined {
    const normalizedPrompt = userInput.toLowerCase();
    
    // First check predefined questions
    const matchedQuestion = predefineQuestions.find(q => 
      q.keyword && normalizedPrompt.includes(q.keyword.toLowerCase())
    );
    
    if (matchedQuestion) {
      return this.tools.find(t => t.name === matchedQuestion.name);
    }
    
    // Then check keywords
    const matchedKeyword = keywords.find(k => 
      k.keyword && normalizedPrompt.includes(k.keyword.toLowerCase())
    );
    
    return matchedKeyword ? this.tools.find(t => t.name === matchedKeyword.name) : undefined;
  }

  private extractParams(userInput: string): Record<string, string> {
    const params: Record<string, string> = {};
    
    // Extract Ethereum address
    const ethAddressMatch = userInput.match(/0x[a-fA-F0-9]{40}/);
    if (ethAddressMatch) {
      params.address = ethAddressMatch[0];
      params.chain = params.chain || '0x1'; // Default to Ethereum mainnet
    }
    
    // Extract ENS domain
    if (userInput.includes('.eth')) {
      const ensMatch = userInput.match(/[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/);
      if (ensMatch) {
        params.domain = ensMatch[0];
      }
    }
    
    // Extract chain if mentioned
    const chainMatch = userInput.match(/(ethereum|eth|polygon|bsc|arbitrum|optimism|avalanche)/i);
    if (chainMatch) {
      const chainMap: Record<string, string> = {
        'ethereum': '0x1',
        'eth': '0x1',
        'polygon': '0x89',
        'bsc': '0x38',
        'arbitrum': '0xa4b1',
        'optimism': '0xa',
        'avalanche': '0xa86a'
      };
      params.chain = chainMap[chainMatch[0].toLowerCase()] || params.chain || '0x1';
    }
    
    return params;
  }

   async handlePrompt(prompt: string): Promise<string | { data:string, summary:string }> {
    const toolNames = this.tools.map(t => t.name);
    const toolDescriptions = this.tools.reduce((acc, t) => {
      acc[t.name] = {
        requiredParams: t.requiredParams,
        dataSchema: t.dataSchema,
      };
      return acc;
    }, {} as Record<string, any>);

    const instruction = `
You are a blockchain AI assistant. You help users query wallet, token, NFT, DeFi, and Solana data using Moralis APIs.

At runtime, follow this instruction set to choose the right tool dynamically:

1. Parse the user prompt.
2. Identify the intent (e.g., wallet balance, token price, NFT ownership).
3. Match the intent to a tool name from the available registry using natural language understanding.
4. Identify and extract all required parameters for the tool.
   - For EVM chains: use chain format like "0x1", "0x89", etc.
   - For Solana: use "mainnet" for the network.
   - Do not return chains like "eth", "polygon" — this causes SDK error: [C0005] Invalid provided chain.
5. If required params are missing, return a message listing missing fields like:  
   "This prompt requires these fields: [field1, field2]"

Examples:
- ✅ Correct EVM chain: "chain": "0x1"
- ❌ Incorrect chain: "chain": "eth" → results in Moralis SDK Core Error: [C0005]

6. For combined prompts (e.g. "compare ETH and SOL holdings"):
   - Select multiple tools if needed (e.g., getNativeBalance + balance)

Respond in JSON format (no markdown or \`\`\`):
{
  "tool": "toolName",
  "params": {
    "chain": "0x1",
    "address": "0x..."
  }
}

Never return markdown code blocks. Only return clean JSON object. Do not format response with \`\`\`.

Available tools and descriptions will be provided.


Available tools:
${toolNames.map(t => `- ${t}`).join("\n")}

Each tool has required parameters defined below:
${JSON.stringify(toolDescriptions, null, 2)}

User prompt:
${prompt}

Return JSON: { tool: "toolName", params: { ...requiredParams } }
`;

    const response = await this.model.invoke(instruction);

    try {
      const rawContent = response?.content;
      // @ts-ignore
      const cleaned = rawContent?.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(cleaned);
      // @ts-ignore
      // const parsed = JSON.parse(response?.content || "{}");

      const tool = this.tools.find(t => t.name === parsed.tool);
      if (!tool) return `No tool matched the name "${parsed.tool}".`;

      const missing = tool.requiredParams.filter(p => !(p in parsed.params));
      if (missing.length > 0) {
        return `This prompt requires these fields: [${missing.join(", ")}].`;
      }

      const result = await tool.run(parsed.params);
      // const summary = await this.NLP(result);
      return {data:JSON.stringify(result, null, 2) , summary : ""};
    } catch (err) {
      return `Failed to parse AI result or run tool: ${err}`;
    }
  }

  async NLP(result:string):Promise<string>{
  try {
    
    const summary = await this.model.invoke(`${HUMAN_RESPONSE_PROMPT}\n\n${JSON.stringify(result)}`);
    console.log("Summary => ",summary);
    return summary.content?.toString()

  } catch (error) {
    return "Error "
  }
}

// function test() {
//   console.log('AIAgentRouter test function');
  // Example usage:
  // const router = new AIAgentRouter("your-openai-api-key");
  // router.handlePrompt("What's the price of ETH?").then(console.log);
// }
    // );
}

// test()


