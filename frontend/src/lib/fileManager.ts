import { File, FileInfo } from "./file";

export class FileManager {
  private _currentPath: string;

  constructor(startingPath: string = "/") {
    this._currentPath = startingPath;
  }

  get currentPath(): string {
    return this._currentPath;
  }

  async listFiles(): Promise<File[]> {
    // TODO: Implement API call to list files
    console.log(`Listing files in ${this._currentPath}`);
    return [];
  }

  async createDirectory(name: string): Promise<void> {
    // TODO: Implement API call to create directory
    console.log(`Creating directory ${name} in ${this._currentPath}`);
  }

  async deleteFile(name: string): Promise<void> {
    // TODO: Implement API call to delete file
    console.log(`Deleting file ${name} in ${this._currentPath}`);
  }

  async changeDirectory(path: string): Promise<void> {
    // TODO: Implement logic to change directory
    this._currentPath = path;
    console.log(`Changed directory to ${this._currentPath}`);
  }
}
