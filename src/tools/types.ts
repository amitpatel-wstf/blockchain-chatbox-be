export interface ToolParams extends Record<string, string> {}

export interface Tool {
  name: string;
  requiredParams: string[];
  func: (params: ToolParams) => Promise<any>;
  dataSchema?: string;
  description?: string;
}
