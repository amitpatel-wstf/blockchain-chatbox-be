import { AIAgentRouter } from './AgentRouter';
import { initMoralis } from './tools';

export interface BlockchainChatSDKConfig {
  openaiApiKey: string;
  moralisApiKey: string;
  port?: number;
}

export class BlockchainChatSDK {
  private agentRouter: AIAgentRouter;
  private config: BlockchainChatSDKConfig;

  constructor(config: BlockchainChatSDKConfig) {
    this.config = {
      port: 3000,
      ...config
    };

    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    if (!this.config.moralisApiKey) {
      throw new Error('Moralis API key is required');
    }

    // Initialize Moralis
    initMoralis(this.config.moralisApiKey);
    
    // Initialize the AI Agent Router with OpenAI key
    this.agentRouter = new AIAgentRouter(this.config.openaiApiKey);
  }

  /**
   * Get the underlying agent router for direct access
   */
  public getAgentRouter(): AIAgentRouter {
    return this.agentRouter;
  }

  /**
   * Handle a chat prompt
   * @param prompt The user's prompt
   * @returns The AI's response
   */
  public async handlePrompt(prompt: string): Promise<{
    message: string;
    summary: string;
    prompt: string;
    status: boolean;
    data?: any;
  }> {
    try {
      if (!prompt) {
        return {
          message: 'Prompt is required',
          summary: '',
          prompt: '',
          status: false
        };
      }

      const response = await this.agentRouter.handlePrompt(prompt);
      
      if (typeof response === 'string') {
        return {
          message: response,
          summary: '',
          prompt,
          status: true
        };
      }
      
      return {
        message: response.data,
        summary: response.summary || '',
        prompt,
        status: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error handling prompt:', error);
      return {
        message: 'An error occurred while processing your request',
        summary: '',
        prompt,
        status: false,
        data: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export a default instance factory function
export const createBlockchainChatSDK = (config: BlockchainChatSDKConfig) => {
  return new BlockchainChatSDK(config);
};
