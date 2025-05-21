import { Tool } from "langchain/tools";
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import config from "./config";
import { marketTools } from "./tools/Market-Tool";
import { walletTools } from "./tools/wallet-tools";
import { tools } from "./tools";
import { nftTools } from "./tools/NFT-Tools";
import { tokenTools } from "./tools/Token-Tools";
// import { HumanChatMessage, AIChatMessage } from "langchain";

class SumTool extends Tool {
    name = "sum_numbers";
    description = "Takes two numbers separated by space and returns their sum";

    async _call(input: string): Promise<string> {
        const parts = input.trim().split(/\s+/);
        if (parts.length !== 2) {
            return "Error: please provide exactly two numbers";
        }
        const [a, b] = parts.map(Number);
        if (isNaN(a) || isNaN(b)) {
            return "Error: inputs must be valid numbers";
        }
        return (a + b).toString();
    }
}

export class Agent {
    sumTool: Tool;
    model: ChatOpenAI;

    constructor() {
        this.sumTool = new SumTool();
        this.model = new ChatOpenAI({
            modelName: "gpt-4",      // or whichever model you have access to
            temperature: 0,
            apiKey:config.OPENAI_API_KEY
        });
    }

    async handlePrompt(prompt: string) {
       


        // 3. Create the agent, passing in our tool
        const executor = await initializeAgentExecutorWithOptions(
            [...marketTools,...walletTools,...tokenTools,...nftTools,...tools],
            // [this.sumTool],
            this.model,
            {
                agentType: "chat-conversational-react-description",
                verbose: true,
            }
        );

        // const userInput = "12 of 13 kitne hote hai ? ";
        const response = await executor.call({
            input: prompt,
        });

        // console.log("Agent response:",response.output);
        // for (const [msg,index] of response.output) {
        //     // if (msg instanceof any) {
        //     console.log("==> ",index,"=> ", msg.text);
        //     // }
        // }
        return response.output;
    }

}

