// describe("AIAgentRouter", () => {
//   it("should handle prompts correctly", async () => {
//     await initMoralis(config.MORALIS_KEY);
//     const agent = new AIAgentRouter(config.OPENAI_API_KEY);
//     moralisTools.forEach((tool: any) => agent.registerTool(tool));

//     const prompts = [
//       "What's in my wallet 0xcB1C1FdE09f811B294172696404e88E658659905?",
//       "What NFTs do I own at 0xcB1C1FdE09f811B294172696404e88E658659905?",
//       "Show my DeFi positions for 0xd100d8b69c5ae23d6aa30c6c3874bf47539b95fd",
//       "What is my net worth at 0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326?",
//       "Generate a PnL for my wallet 0xcB1C1FdE09f811B294172696404e88E658659905",
//       "What token approvals have I made for 0xcB1C1FdE09f811B294172696404e88E658659905?",
//       "Show my swap history for 0xcB1C1FdE09f811B294172696404e88E658659905",
//       "What chains am I active on 0xcB1C1FdE09f811B294172696404e88E658659905?",
//       "What's the domain for 0x94ef5300cbc0aa600a821ccbc561b057e456ab23?",
//       "What wallet owns vitalik.eth?"
//     ];

//     for (const prompt of prompts) {
//       const response = await agent.handlePrompt(prompt);
//       console.log(`\nPrompt: ${prompt}\nResponse: ${response}`);
//     }
//   });
// });
