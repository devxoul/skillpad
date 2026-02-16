export class Command {
  private program = ''
  private args: string[] = []
  private options: { cwd?: string } | undefined

  static create(program: string, args?: string[], options?: { cwd?: string }) {
    const cmd = new Command()
    cmd.program = program
    cmd.args = args ?? []
    cmd.options = options
    return cmd
  }

  async execute(): Promise<{ code: number; stdout: string; stderr: string }> {
    const response = await fetch('/__api/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        program: this.program,
        args: this.args,
        options: this.options,
      }),
    })
    return response.json()
  }
}

export const open = (url: string) => window.open(url, '_blank')
