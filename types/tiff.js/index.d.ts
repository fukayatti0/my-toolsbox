// types/tiff.js/index.d.ts
declare module 'tiff.js' {
    export class TIFF {
      constructor(buffer: ArrayBuffer);
      width(): number;
      height(): number;
      toImageData(): ImageData;
    }
  }