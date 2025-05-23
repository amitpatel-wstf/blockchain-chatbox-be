// src/routes/token.routes.ts
import express, {Request, Response} from 'express';
import { tools, initMoralis } from '../tools';
import config from '../config';

const router = express.Router();

router.post('/:tool', async (req : Request, res:Response):Promise<any> => {
  const { tool } = req.params;
  const input = req.body;

  try {
    await initMoralis(config.MORALIS_KEY);
    const selected = tools.find(t => t.name === tool);
    if (!selected) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    const missing = selected.requiredParams.filter(p => !(p in input));
    if (missing.length) {
      return res.status(400).json({
        error: `Missing required parameters: [${missing.join(', ')}]`
      });
    }

    const result = await selected.func(input);
    res.status(200).json({ data: result, schemaHint: selected.dataSchema || null });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Execution failed' });
  }
});

export default router;
