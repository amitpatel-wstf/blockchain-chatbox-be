import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "openai"; // npm install openai
import { ChatCompletionTool } from "openai/resources/chat/completions";
import { tools } from "./tools";
import { HUMAN_RESPONSE_PROMPT } from "./tools/constant";
import { Tool } from "./tools/types";
import { toolSchemas } from "./tools/tool-schemas";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";

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


export const chains = [
  { "chain": "eth",           "hexChainId": "0x1"    },
  { "chain": "bnb",           "hexChainId": "0x38"   },
  { "chain": "bsc",           "hexChainId": "0x38"   },
  { "chain": "Ethereum Mainnet",           "hexChainId": "0x1"    },
  { "chain": "BNB Smart Chain Mainnet",     "hexChainId": "0x38"   },
  { "chain": "Base",                        "hexChainId": "0x2105" },
  { "chain": "Berachain",                   "hexChainId": "0x138de"},
  { "chain": "Arbitrum One",                "hexChainId": "0xa4b1" },
  { "chain": "Avalanche C-Chain",           "hexChainId": "0xa86a" },
  { "chain": "Sonic Mainnet",               "hexChainId": "0x92"   },
  { "chain": "Hemi",                        "hexChainId": "0xa867" },
  { "chain": "Polygon Mainnet",             "hexChainId": "0x89"   },
  { "chain": "Core Blockchain Mainnet",     "hexChainId": "0x45c"  },
  { "chain": "Sei Network",                 "hexChainId": "0x531"  },
  { "chain": "Aurora Mainnet",              "hexChainId": "0x4E454152" },
  { "chain": "Fantom Opera",                "hexChainId": "0xFA"   },
  { "chain": "XDC Mainnet",                 "hexChainId": "0x32"   },
  { "chain": "Moonbeam",                    "hexChainId": "0x504"  },
  
  { "chain": "Optimism",                    "hexChainId": "0xA"    },
  { "chain": "PulseChain",                  "hexChainId": "0x171"  },
  { "chain": "zkSync Mainnet",              "hexChainId": "0x144"  },
  { "chain": "Fuse Mainnet",                "hexChainId": "0x7A"   },
  
  { "chain": "Arbitrum Nova",               "hexChainId": "0xA4EA" }
]


export class AIAgentRouter {
  private tools: Tool[] = [];
  private openai: OpenAI;
  private model: ChatOpenAI;

  constructor(openaiApiKey: string) {
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: openaiApiKey
    });

    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: openaiApiKey,
      temperature: 0.3,
    });

  }

  async handlePrompt(prompt: string): Promise<string | { data: string; summary: string }> {
    const messages = [{ role: "user" as const, content: prompt }];

    const toolz: ChatCompletionTool[] = toolSchemas.map(fn => ({
      type: "function",
      function: {
        name: fn.function.name,
        description: fn.function.description,
        parameters: fn.function.parameters,
      }
    }));
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      tools: toolz,
      tool_choice: "auto",
    });

    try {
      const message = response.choices[0].message;
      const toolCalls = message.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        return "No tool calls in the response";
      }

      const toolCall = toolCalls[0];
      const toolName = toolCall.function.name;
      const params = JSON.parse(toolCall.function.arguments);

      console.log("Tool Name => ", toolName);
      console.log("Params => ", params);

      // Check and replace chain parameter with hexChainId (needs to be improved!!)
      // if (params.chain) {
      //   const chainInfo = chains.find(c => 
      //     c.chain.toLowerCase() === params.chain.toLowerCase()
      //   );
        
      //   if (chainInfo) {
      //     params.chain = chainInfo.hexChainId;
      //   } else {
      //     return `Invalid chain specified: ${params.chain}`;
      //   }
      // }

      if (params.chain) {
        const inputChain = params.chain.trim().toLowerCase();
        const chainInfo = chains.find(c => c.chain.trim().toLowerCase() === inputChain);
      
        if (chainInfo) {
          params.chain = chainInfo.hexChainId;
        } else {
          return `Invalid chain specified: ${params.chain}`;
        }
      }
      

      console.log("After mapping with hexcode: ");
      console.log("Params => ", params);

      const implementationTool = [...walletTools, ...nftTools, ...tokenTools, ...marketTools, ...tools]
        .find(t => t.name === toolName);

      if (!implementationTool) {
        return `No tool matched the name "${toolName}"`;
      }

      const missing = implementationTool.requiredParams.filter(p => !(p in params));
      if (missing.length > 0) {
        return `This prompt requires these fields: [${missing.join(", ")}]`;
      }

      // Execute the tool
      const result = await implementationTool.run(params);

      // Get the summary using the existing model
      const summary = await this.NLP(result);

      // Return both the data and summary
      return { 
        data: JSON.stringify(result, null, 2), 
        summary: summary 
      };

    } catch (err) {
      return `Failed to parse AI result or run tool: ${err}`;
    }
  }

  async NLP(result: string): Promise<string> {
    try {
      const summary = await this.model.invoke(`${HUMAN_RESPONSE_PROMPT}\n\n${JSON.stringify(result)}`);
      return summary.content?.toString() || "No summary generated";
    } catch (error) {
      console.error("Error in NLP processing:", error);
      return "Error generating summary";
    }
  }
}