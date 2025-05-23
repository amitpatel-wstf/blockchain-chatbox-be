export interface ToolParams extends Record<string, string> {}

export interface Tool {
  name: string;
  requiredParams: string[];
  run: (params: ToolParams) => Promise<any>;
  dataSchema?: string;
  description?: string;
}