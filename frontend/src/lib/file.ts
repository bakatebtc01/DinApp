export interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class File {
  private _info: FileInfo;

  constructor(info: FileInfo) {
    this._info = info;
  }

  get info(): FileInfo {
    return this._info;
  }

  get name(): string {
    return this._info.name;
  }

  get path(): string {
    return this._info.path;
  }

  get size(): number {
    return this._info.size;
  }

  get isDirectory(): boolean {
    return this._info.isDirectory;
  }

  get createdAt(): Date {
    return this._info.createdAt;
  }

  get updatedAt(): Date {
    return this._info.updatedAt;
  }
}
