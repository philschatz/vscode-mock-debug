import * as cp from 'child_process'
import * as path from 'path'
import {existsSync} from 'fs'

let handle: cp.ChildProcess | null = null
let port: number = 0

export function launchServer() {
	console.log('Maybe launching server')
	if (handle === null) {
		port = Math.round(Math.random() * 10000 + 1024)
		const opts: cp.SpawnOptions = {
			stdio: 'inherit',
		}
		const debuggerArg = [
			// '-agentlib:jdwp=transport=dt_socket,address=127.0.0.1:8888,server=y,suspend=n'
		]
		const jarPath = path.join(__dirname, '..', 'server', `com.philschatz.xslt-1.0-SNAPSHOT-jar-with-dependencies.jar`)
		// Check that the jar file exists
		if (!existsSync(jarPath)) {
			throw new Error(`Error: XSLT Jar file does not exist. Maybe a plugin packaging problem? Looked for "${jarPath}"`)
		}
		const args = [
			...debuggerArg,
			'-jar',
			jarPath,
			`${port}`
		]
		console.log(`Spawning server on port ${port} with "java ${args.join(' ')}"`)
		handle = cp.spawn('java', args, opts);

		handle.on('close', (status: number, signal: string) => {
			console.error(`XSLT Server exited with status code ${status}`)
			stopServer()
		})
	}
	return port
}

export function stopServer() {
	if (handle) {
		handle.kill()
		handle = null
		port = 0
	}
}