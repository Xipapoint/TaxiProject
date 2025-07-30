import { ModuleRef } from '@nestjs/core';

export class ModuleRefStore {
  private static _moduleRef: ModuleRef;

  static set(ref: ModuleRef) {
    this._moduleRef = ref;
  }

  static get(): ModuleRef {
    if (!this._moduleRef) throw new Error('ModuleRef is not initialized');
    return this._moduleRef;
  }
}