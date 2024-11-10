/* tslint:disable */
/* eslint-disable */
/**
 * @returns {any[]}
 */
export function supported_formats(): any[];
export class ImageConverter {
  free(): void;
  /**
   * @param {Uint8Array} data
   */
  constructor(data: Uint8Array);
  /**
   * @param {string} format
   * @returns {Uint8Array}
   */
  convert_to(format: string): Uint8Array;
  /**
   * @returns {string}
   */
  get_dimensions(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_imageconverter_free: (a: number, b: number) => void;
  readonly imageconverter_new: (a: number, b: number) => Array;
  readonly imageconverter_convert_to: (a: number, b: number, c: number) => Array;
  readonly imageconverter_get_dimensions: (a: number) => Array;
  readonly supported_formats: () => Array;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
