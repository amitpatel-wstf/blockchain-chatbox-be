import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { initMoralis, tools as moralisTools, tools } from "./tools";
import dotenv from "dotenv";
import config from "./config";
import fs from "fs";
import path from "path";
import { keywords } from "./tools/constant";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";

dotenv.config();

const predefineQuestions = [
  {
    keyword:"",
    name : ""
  }
]

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

  // async handlePrompt(prompt: string): Promise<AgentResponse> {
  //   const tool = this.matchTool(prompt);
  //   if (!tool) return { prompt, response: "No matching tool found for this prompt." };

  //   const inputParams = this.extractParams(prompt);
  //   const missingParams = tool.requiredParams.filter(
  //     (param) => !(param in inputParams)
  //   );

  //   if (missingParams.length > 0) {
  //     return {
  //       prompt,
  //       response: `This prompt requires these fields, please provide: [${missingParams.join(", ")}].`
  //     };
  //   }

  //   try {
  //     const result = await tool.run(inputParams);
  //     return {
  //       prompt,
  //       response: JSON.stringify(result, null, 2),
  //       schemaHint: tool.dataSchema || undefined
  //     };
  //   } catch (error) {
  //     return {
  //       prompt,
  //       response: `Tool execution failed: ${error}`
  //     };
  //   }
  // }

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
      const rawContent = response?.content || "";
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
    const HUMAN_RESPONSE_PROMPT = `
You are a blockchain AI assistant. You receive structured JSON responses from Moralis API tools.
Your job is to convert these raw API results into helpful, human-readable summaries.

🧩 Instructions:
1. Parse the provided JSON result.
2. Translate data into natural, user-friendly language.
3. Include numbers with proper formatting (e.g., 1,500 instead of 1500).
4. Convert timestamps into relative time if possible (e.g., "2 hours ago").
5. If values are in lamports/wei, convert them to SOL/ETH and format as currency.
6. Label all values clearly, and provide insights when helpful (e.g., explain what net worth means).

🛠️ If the tool response contains:
- Token balances: summarize total value, list top 3 tokens with name, balance, and value.
- NFTs: summarize how many NFTs were found, group by collection if applicable.
- Floor prices: report the lowest listing price and convert it to USD if possible.
- Profitability: report total PnL, percent gain, and notable trends.
- Trades/swaps: summarize recent trades, including from→to token, value, and timestamp.

💡 Examples:
- Raw JSON:
{
  "netWorthUsd": 12152.52,
  "tokens": [ { "symbol": "ETH", "balanceUsd": 8000 }, { "symbol": "USDC", "balanceUsd": 3000 } ]
}

- Output:
You have a total net worth of $12,152. Your largest holdings are:
• 1. ETH: $8,000  
• 2. USDC: $3,000

⚠️ NEVER include raw JSON in the final output.  
⚠️ NEVER return markdown or code blocks (\`\`\`).  
✅ ONLY return natural language summaries.

Now convert the following data into a human-readable summary.
`;
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


