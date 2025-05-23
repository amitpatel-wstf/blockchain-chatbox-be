import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "openai"; // npm install openai
import { ChatCompletionTool } from "openai/resources/chat/completions";
import { tools } from "./tools";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";
import { getInstruction, HUMAN_RESPONSE_PROMPT } from "./tools/constant";
import { Tool } from "./tools/types";
import { toolSchemas } from "./tools/tool-schemas";

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
  { "chain": "Zircuit Mainnet",             "hexChainId": "0xbf04" },
  { "chain": "Core Blockchain Mainnet",     "hexChainId": "0x45c"  },
  { "chain": "Unichain",                    "hexChainId": "0x82"   },
  { "chain": "Sei Network",                 "hexChainId": "0x531"  },
  { "chain": "Cronos Mainnet",              "hexChainId": "0x19"   },
  { "chain": "Bitlayer Mainnet",            "hexChainId": "0x310c5"},
  
  { "chain": "Metis Andromeda Mainnet",     "hexChainId": "0x440"  },
  { "chain": "Aurora Mainnet",              "hexChainId": "0x4E454152" },
  { "chain": "Fantom Opera",                "hexChainId": "0xFA"   },
  { "chain": "XDC Mainnet",                 "hexChainId": "0x32"   },
  { "chain": "Evmos Mainnet",               "hexChainId": "0x2329" },
  { "chain": "Theta Mainnet",               "hexChainId": "0x169"  },
  { "chain": "Filecoin Main Network",       "hexChainId": "0x13A"  },
  { "chain": "OKXChain",                    "hexChainId": "0x42"   },
  { "chain": "Moonbeam",                    "hexChainId": "0x504"  },
  { "chain": "Gnosis",                      "hexChainId": "0x64"   },
  { "chain": "Celo",                        "hexChainId": "0xA4EC" },
  
  { "chain": "Optimism",                    "hexChainId": "0xA"    },
  { "chain": "Moonriver",                   "hexChainId": "0x505"  },
  { "chain": "Klaytn Cypress",              "hexChainId": "0x2019" },
  { "chain": "Ronin Mainnet",               "hexChainId": "0x7E4"  },
  { "chain": "Palm Mainnet",                "hexChainId": "0x2A15C308D" },
  { "chain": "Mantle",                      "hexChainId": "0x1388" },
  { "chain": "PulseChain",                  "hexChainId": "0x171"  },
  { "chain": "zkSync Mainnet",              "hexChainId": "0x144"  },
  { "chain": "Fuse Mainnet",                "hexChainId": "0x7A"   },
  { "chain": "Harmony Mainnet (Shard 0)",   "hexChainId": "0x63564C40" },
  { "chain": "IoTeX Mainnet",               "hexChainId": "0x1251" },
  { "chain": "Telos EVM Mainnet",           "hexChainId": "0x28"   },
  { "chain": "Boba Network",                "hexChainId": "0x120"  },
  { "chain": "Boba BNB Mainnet",            "hexChainId": "0xDBE0" },
  { "chain": "Shiden",                      "hexChainId": "0x150"  },
  
  { "chain": "Arbitrum Nova",               "hexChainId": "0xA4EA" },
  { "chain": "Ethereum Classic",            "hexChainId": "0x3D"   },
  { "chain": "Energi Mainnet",              "hexChainId": "0x9B4D" },
  { "chain": "Bitgert (Brise)",             "hexChainId": "0x7F08" },
  { "chain": "Crab Network",                "hexChainId": "0x2C"   },
  { "chain": "Energy Web Chain",            "hexChainId": "0xF6"   },
  { "chain": "TomoChain",                   "hexChainId": "0x58"   },
  { "chain": "Syscoin",                     "hexChainId": "0x39"   },
  { "chain": "Ubiq",                        "hexChainId": "0x8"    },
  { "chain": "LACHAIN",                     "hexChainId": "0xE1"   },
  { "chain": "Milkomeda A1",                "hexChainId": "0x7D2"  },
  { "chain": "HPB",                         "hexChainId": "0x10D"  },
  { "chain": "CUBE Chain",                  "hexChainId": "0x71A"  },
  { "chain": "GoChain",                     "hexChainId": "0x3C"   }
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
        parameters: fn.function.parameters
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