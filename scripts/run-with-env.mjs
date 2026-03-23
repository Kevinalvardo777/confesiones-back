import { existsSync, readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'

const allowedEnvironments = new Set(['local', 'dev', 'cert', 'prod'])

function parseEnvFile(filePath) {
  const entries = {}
  const content = readFileSync(filePath, 'utf8')

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    entries[key] = value
  }

  return entries
}

function loadEnvironment(environment) {
  const cwd = process.cwd()
  const envFiles = [
    path.join(cwd, '.env'),
    path.join(cwd, '.env.local'),
    path.join(cwd, `.env.${environment}`),
    path.join(cwd, `.env.${environment}.local`),
  ]

  return envFiles.reduce((accumulator, filePath) => {
    if (!existsSync(filePath)) {
      return accumulator
    }

    return { ...accumulator, ...parseEnvFile(filePath) }
  }, {})
}

const [, , environment, ...command] = process.argv

if (!allowedEnvironments.has(environment)) {
  console.error('Usage: node scripts/run-with-env.mjs <local|dev|cert|prod> <command> [...args]')
  process.exit(1)
}

if (command.length === 0) {
  console.error('Missing command to run.')
  process.exit(1)
}

const env = {
  ...process.env,
  ...loadEnvironment(environment),
  APP_ENV: environment,
}

const child = spawn(command[0], command.slice(1), {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})
