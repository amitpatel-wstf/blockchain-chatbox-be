import { Tool } from "langchain/tools";
import { ChatOpenAI } from "@langchain/openai";
import config from "./config";

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
            apiKey: config.OPENAI_API_KEY
        });
    }

    async handlePrompt(prompt: string) {


        // try {
        //     let agentTools = [ ...tools];
        //     // 3. Create the agent, passing in our tool
        //     // const executor = await initializeAgentExecutorWithOptions(
        //     //     [...marketTools,...walletTools,...tokenTools,...nftTools,...tools],
        //     //     // [this.sumTool],
        //     //     this.model,
        //     //     {
        //     //         agentType: "chat-conversational-react-description",
        //     //         verbose: true,
        //     //     }
        //     // );

        //     // const final = await executor.run(prompt);
        //     // console.log("🛠️  Agent + Tool result:\n", final);
        //     // return final;


        //     // 1️⃣ First LLM call to decide which tool to use
        //     const initial = await this.model.invoke([
        //         new HumanMessage(prompt),
        //     ], { tools: agentTools });
        //     console.log("Initial response:\n", initial);
        //     // 2️⃣ Check if a tool was requested
        //     const calls = initial.tool_calls ?? [];
        //     if (calls.length === 0) {
        //         console.log("No tool requested:", initial.content);
        //         return;
        //     }

        //     // 3️⃣ We only support one tool here, so grab the first
        //     const call = calls[0];
        //     console.log("Tool requested:", call.name);
        //     const tool = tools.find((t) => t.name === call.name)!;
        //     console.log("Tool found:", tool.name);

        //     // 4️⃣ Execute the tool
        //     const toolOutput = await tool.func(call.args?.query ?? "");

        //     // 5️⃣ Append tool output and ask the LLM to summarize
        //     const followUp = await this.model.invoke([
        //         new HumanMessage("Here are the results of the tool call:"),
        //         new AIMessage(toolOutput),
        //         new HumanMessage("Please summarize these positions for me in plain language."),
        //     ]);

        //     console.log("Final answer:\n", followUp.content);
        //     return followUp.content;
        // } catch (error) {
        //     console.log("Error in handlePrompt:", error);
        //     return "Error";
        // }
    }

}

