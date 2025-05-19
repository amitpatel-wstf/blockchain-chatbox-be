import express, { json, Request, Response } from 'express';
import config from './config';
import cors from 'cors'
import { AIAgentRouter } from './AgentRouter';
import { initMoralis, tools } from './tools';
import { tokenTools } from './tools/Token-Tools';
import { nftTools } from './tools/NFT-Tools';
import { walletTools } from './tools/wallet-tools';
import { marketTools } from './tools/Market-Tool';
import { prompts } from './tools/constant';


// app
const app = express();
const PORT = config.PORT;

const agentRouter = new AIAgentRouter(config.OPENAI_API_KEY);

// middlewares
app.use(json());
app.use(cors({credentials:true,origin:"*"}))
// app.use('/api/tokens', );

app.get("/",(req:Request, res:Response)=>{
    res.status(200).json({message:"Server helth is OK", status:true})
})

app.get("/api/samples",(req:Request, res:Response)=>{
    res.status(200).json({message:"Server helth is OK", status:true, data:prompts})
})

app.post("/api/prompt",async(req:Request,res:Response)=>{
    try {
        const {prompt }= req.body;
        console.log("User Prompt : ",prompt);
        if(prompt){
            const response = await agentRouter.handlePrompt(prompt);
            console.log("Response==>",response);
            
            // Handle both string and object responses
            if (typeof response === 'string') {
                res.status(200).json({message: response, summary: '', prompt:prompt, status:true});
            } else {
                res.status(200).json({message: response.data, summary: response.summary, prompt:prompt, status:true});
            }
            
        }else{
            res.status(404).json({message : "Prompt not Found", status: false});
        }
    } catch (error) {
        res.status(500).json({message : "Internal Server Error", status: false});
    }
})


app.listen(PORT,async ()=>{
    await initMoralis(config.MORALIS_KEY);
    [...tools, ...tokenTools, ...nftTools, ...walletTools, ...marketTools].forEach((tool: any) => agentRouter.registerTool(tool));
    console.log(`Server is Running on ${PORT}`);
})
