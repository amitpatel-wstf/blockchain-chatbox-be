import { ChatOpenAI } from "@langchain/openai";
import { tools } from "./tools";
import { walletTools } from "./tools/wallet-tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
import { marketTools } from "./tools/Market-Tool";
import { getInstruction, HUMAN_RESPONSE_PROMPT } from "./tools/constant";
import { Tool } from "./tools/types";
import { Tool as Tools } from "@langchain/core/tools";

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

  async handlePrompt(prompt: string): Promise<string | { data: string, summary: string }> {
    const toolNames = this.tools.map(t => t.name);
    const toolDescriptions = this.tools.reduce((acc, t) => {
      acc[t.name] = {
        requiredParams: t.requiredParams,
        dataSchema: t.dataSchema,
      };
      return acc;
    }, {} as Record<string, any>);

    const instruction = getInstruction(toolNames, toolDescriptions, prompt);

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
      const summary = await this.NLP(result);
      return { data: JSON.stringify(result, null, 2), summary: summary };
    } catch (err) {
      return `Failed to parse AI result or run tool: ${err}`;
    }
  }


  async NLP(result: string): Promise<string> {
    try {
      const summary = await this.model.invoke(`${HUMAN_RESPONSE_PROMPT}\n\n${JSON.stringify(result)}`);
      console.log("Summary => ", summary);
      return summary.content?.toString()

    } catch (error) {
      return "Error "
    }
  }

}


