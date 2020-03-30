/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { WorkspaceFolder, DebugConfiguration, ProviderResult, CancellationToken } from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('extension.xslt-debug.getProgramName', config => {
		return vscode.window.showInputBox({
			placeHolder: "Please enter the name of an xsl file in the workspace folder",
			value: "transform.xsl"
		});
	}));

	// register a configuration provider for 'xslt' debug type
	const provider = new MockConfigurationProvider();
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('xslt', provider));

	let factory = new DebugAdapterExecutableFactory();

	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('xslt', factory));
	if ('dispose' in factory) {
		context.subscriptions.push(factory);
	}

	// override VS Code's default implementation of the debug hover
	/*
	vscode.languages.registerEvaluatableExpressionProvider('markdown', {
		provideEvaluatableExpression(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.EvaluatableExpression> {
			const wordRange = document.getWordRangeAtPosition(position);
			return wordRange ? new vscode.EvaluatableExpression(wordRange) : undefined;
		}
	});
	*/
}

export function deactivate() {
	// nothing to do
}

class MockConfigurationProvider implements vscode.DebugConfigurationProvider {

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {

		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === 'xsl') {
				config.type = 'xslt';
				config.name = 'Launch';
				config.request = 'launch';
				config.program = '${file}';
				config.stopOnEntry = true;
			}
		}

		if (!config.program) {
			return vscode.window.showInformationMessage("Cannot find a program to debug").then(_ => {
				return undefined;	// abort launch
			});
		}

		return config;
	}
}

class DebugAdapterExecutableFactory implements vscode.DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): ProviderResult<vscode.DebugAdapterDescriptor> {
		// use the executable specified in the package.json if it exists or determine it based on some other information (e.g. the session)
		if (!executable) {
			const command = 'java';
			// const debuggerArg = [
			// 	'-agentlib:jdwp=transport=dt_socket,address=127.0.0.1:8888,server=y,suspend=n'
			// ]
			const args = [
				// ...debuggerArg,
				'-jar',
				path.join(__dirname, '..', 'server', `xslt-debug-adapter-0.1.1-all.jar`)
			];
			executable = new vscode.DebugAdapterExecutable(command, args);
		}

		// make VS Code launch the DA executable
		return executable;
	}
}
