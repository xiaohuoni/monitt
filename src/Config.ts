export interface ConfigProps {
  url?: string;
  skipPlugins?: string[];
}
export class Config {
  url: string;
  skipPlugins: string[];
  constructor(config: ConfigProps) {
    this.url = config?.url ?? '';
    this.skipPlugins = config.skipPlugins ?? [''];
  }
  setConfig(type: string, value: any) {
    switch (type) {
      case 'url':
        this.url = value;
        break;
      default:
        break;
    }
  }
}
