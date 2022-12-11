import * as vscode from "vscode";

const KEY = "vsregexkey";

export class KeyManager {
  static globalState: vscode.Memento;

  static setApiKey(key: string) {
    return this.globalState.update(KEY, key);
  }

  static getApiKey(): string | undefined {
    return this.globalState.get(KEY);
  }
}