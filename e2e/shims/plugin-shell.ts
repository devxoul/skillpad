export class Command {
  static create(_program: string, _args?: string[], _options?: unknown) {
    return new Command()
  }
  async execute() {
    return { code: 0, stdout: '', stderr: '' }
  }
}

export const open = (url: string) => window.open(url, '_blank')
