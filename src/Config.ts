export interface ConfigProps {
  url?: string;
}
export class Config {
  url: string;
  constructor(config: ConfigProps) {
    this.url = config?.url ?? 'monittURL';
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
