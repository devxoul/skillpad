import { type ChildProcess, spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

function getE2eHome(): string {
  if (process.env.SKILLPAD_HOME) return process.env.SKILLPAD_HOME
  const dir = resolve(import.meta.dirname, 'home')
  mkdirSync(dir, { recursive: true })
  return dir
}

export function shellProxy(): Plugin {
  const e2eHome = getE2eHome()
  console.log(`[e2e-shell-proxy] HOME=${e2eHome}`)

  return {
    name: 'e2e-shell-proxy',
    transformIndexHtml(html) {
      const style = `<style>html,body,#root{background:#1c1c1e !important}@media(prefers-color-scheme:light){html,body,#root{background:#fafafa !important}}</style>`
      return html.replace('</head>', `${style}</head>`)
    },
    configureServer(server) {
      server.middlewares.use('/__api/exec', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        let body = ''
        req.on('data', (chunk: string) => {
          body += chunk
        })
        req.on('end', () => {
          const { program, args, options } = JSON.parse(body) as {
            program: string
            args: string[]
            options?: { cwd?: string }
          }

          let child: ChildProcess
          try {
            child = spawn(program, args, {
              cwd: options?.cwd,
              env: { ...process.env, HOME: e2eHome },
            })
          } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ code: 1, stdout: '', stderr: String(err) }))
            return
          }

          let stdout = ''
          let stderr = ''

          child.stdout?.on('data', (data: Buffer) => {
            stdout += data.toString()
          })
          child.stderr?.on('data', (data: Buffer) => {
            stderr += data.toString()
          })

          child.on('close', (code) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ code: code ?? 0, stdout, stderr }))
          })
          child.on('error', (err) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ code: 1, stdout: '', stderr: err.message }))
          })
        })
      })

      server.middlewares.use('/__api/home', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ home: e2eHome }))
      })

      server.middlewares.use('/__proxy/external/', (req, res) => {
        const encodedUrl = req.url?.replace('/__proxy/external/', '') ?? ''
        const targetUrl = decodeURIComponent(encodedUrl)

        if (!targetUrl.startsWith('https://')) {
          res.statusCode = 400
          res.end('Invalid URL')
          return
        }

        const method = req.method ?? 'GET'
        const headers: Record<string, string> = {}
        if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'] as string
        if (req.headers.accept) headers.accept = req.headers.accept as string

        let body = ''
        req.on('data', (chunk: string) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const response = await globalThis.fetch(targetUrl, {
              method,
              headers,
              body: method !== 'GET' && method !== 'HEAD' ? body || undefined : undefined,
            })
            res.statusCode = response.status
            const contentType = response.headers.get('content-type')
            if (contentType) res.setHeader('Content-Type', contentType)
            const text = await response.text()
            res.end(text)
          } catch (err) {
            res.statusCode = 502
            res.end(String(err))
          }
        })
      })
    },
  }
}
