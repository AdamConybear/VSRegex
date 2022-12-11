// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';
import { getApiKey, isKeyValid } from './config';
import { KeyManager } from "./KeyManager";

export function activate(context: vscode.ExtensionContext) {
	KeyManager.globalState = context.globalState;
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"vsregex-sidebar",
		sidebarProvider
	  )
	);
	//get key from global state or null
	//send key message
	let key = KeyManager.getApiKey() || "";
	console.log("Stored Key: " + key);
	if(!isKeyValid(key)){
		setTimeout(() => {
			sidebarProvider._view?.webview.postMessage({
				type: "key",
				value: "null",
			});
		}, 4000);
	}else{
		setTimeout(() => {
			sidebarProvider._view?.webview.postMessage({
				type: "key",
				value: key,
			});
		}, 4000);
	}



	// have a config watcher
	//when something cahnges set/update key in global state and send message key message

	//check if configs are changed
	let configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration("VSRegex")) {
			// key is changed
			let newKey = getApiKey();
			console.log("KEY CHANGE DETECTED");
			console.log("New key: " + newKey);
			if(!isKeyValid(newKey)){
				vscode.window.showErrorMessage("ERROR: Invalid key");
				return;
			}
			KeyManager.setApiKey(newKey);
			//post new message to webview
			sidebarProvider._view?.webview.postMessage({
				type: "key",
				value: newKey,
			});
		}
	});
	context.subscriptions.push(configWatcher);

	context.subscriptions.push(
		vscode.commands.registerCommand('vsregex.refresh', async () => {
			// open then close sidebar
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.vsregex-sidebar-view");
			
			// open dev tools
			// setTimeout(() => {
				// 	vscode.commands.executeCommand("workbench.view.webview.openDeveloperTools");
				// },500);
		})
	);
			
	context.subscriptions.push(
		vscode.commands.registerCommand('vsregex.helloWorld', () => {
			// vscode.window.showInformationMessage('Hello World from VSRegex');
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vsregex.askRegex', () => {
			vscode.window.showInformationMessage('My Regex Command, what do you think?', 'good', 'bad');
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
