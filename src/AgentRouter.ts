import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { initMoralis, tools as moralisTools, tools } from "./tools";
import dotenv from "dotenv";
import config from "./config";
import fs from "fs";
import path from "path";
import { keywords, HUMAN_RESPONSE_PROMPT } from "./tools/constant";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";

// Define types
export type ToolParams = Record<string, string>;

export interface Tool {
  name: string;
  requiredParams: string[];
  run: (params: ToolParams) => Promise<any>;
  dataSchema?: string;
}

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

dotenv.config();

const predefineQuestions = [
  {
    keyword:"",
    name : ""
  }
]

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
      
    const matched = predefineQuestions.find(q => q.keyword.includes(normalizedPrompt)) && keywords.find(k => normalizedPrompt.includes(k.keyword));
    if (!matched) return undefined;
    return this.tools.find(t => t.name === matched.name);
  }

  private extractParams(userInput: string): Record<string, string> {
    const match = userInput.match(/0x[a-fA-F0-9]{40}/);
    if (match) return { address: match[0], chain: "0x1" };
    if (userInput.includes("vitalik.eth")) return { domain: "vitalik.eth" };
    return {};
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


}

// === Vitest Test Case ===
// describe("AIAgentRouter", () => {
//   it("should handle prompts correctly", async () => {
async function test(){
    await initMoralis(config.MORALIS_KEY);
    const agent = new AIAgentRouter(config.OPENAI_API_KEY);
    moralisTools.forEach((tool: any) => agent.registerTool(tool));

    
    const results: ApiResponse[] = [];

    // for (const prompt of prompts) {
    //   const result = await agent.handlePrompt(prompt);
    //   results.push(result);
    //   console.log(`\nPrompt: ${result.prompt}\nResponse: ${result.response}`);
    //   if (result.schemaHint) console.log(`[Visualization Hint]: ${result.schemaHint}`);
    // }

    // fs.writeFileSync(
    //   path.resolve(__dirname, "./agent-output.json"),
    //   JSON.stringify(results, null, 2),
    //   "utf8"
    // );
}

// test()


