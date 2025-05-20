import express, { json, Request, Response } from 'express';
import config from './config';
import cors from 'cors';
import { BlockchainChatSDK } from './BlockchainChatSDK';
import { prompts } from './tools/constant';
export {BlockchainChatSDK};


// Initialize Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Initialize SDK with configuration
const sdk = new BlockchainChatSDK({
  openaiApiKey: config.OPENAI_API_KEY,
  moralisApiKey: config.MORALIS_KEY, // Using the correct config key
  port: PORT
});

// Middleware
app.use(json());

app.use(cors({ credentials: true, origin: "*" }));

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server health is OK", status: true });
});

// Get sample prompts
app.get("/api/samples", (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "Success", 
    status: true, 
    data: prompts 
  });
});

// Handle chat prompts
app.post("/api/prompt", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body as { prompt?: string };
    
    if (!prompt) {
      res.status(400).json({
        message: "Prompt is required",
        status: false
      });
      return;
    }

    console.log("Processing prompt:", prompt);
    const response = await sdk.handlePrompt(prompt);
    console.log("Response:", response);
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error processing prompt:", error);
    res.status(500).json({
      message: "Internal Server Error", 
      status: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start the server
app.listen(PORT, async() => {
  console.log(`Server is running on port ${PORT}`);
});
