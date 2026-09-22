declare module '@digitalbazaar/vc' {
  export const documentLoader: (url: string) => Promise<{ document: any; contextUrl: any }>;
  export const vc: {
    issue: (options: { credential: any; suite: any; documentLoader: any }) => Promise<{ credential: any }>;
    verifyCredential: (options: { credential: any; suite: any; documentLoader: any; checkStatus?: any }) => Promise<{ verified: boolean }>;
  };
}

declare module '@digitalbazaar/ed25519-signature-2020' {
  export class Ed25519Signature2020 {
    constructor(options?: { key?: any });
  }
}

declare module '@digitalbazaar/ed25519-verification-key-2020' {
  export class Ed25519VerificationKey2020 {
    static generate(): Promise<{ privateKeyMultibase: string; publicKeyMultibase: string; id: string; controller: string; type: string }>;
    static from(privateKeyMultibase: string): Ed25519VerificationKey2020;
    privateKeyMultibase: string;
    publicKeyMultibase: string;
  }
}

declare module 'ipfs-http-client' {
  export interface IPFSHTTPClient {
    add(data: any): Promise<{ cid: { toString: () => string } }>;
    cat(cid: string): AsyncIterable<Uint8Array>;
    pin: {
      add(cid: string): Promise<void>;
      rm(cid: string): Promise<void>;
      ls(cid?: string): AsyncIterable<any>;
    };
  }
  export function create(options: { url?: string; headers?: Record<string, string> }): IPFSHTTPClient;
}

declare module 'multiformats' {
  export const base58btc: { encode: (bytes: Uint8Array) => string; decode: (str: string) => Uint8Array };
}

declare module 'uint8arrays' {
  export function fromString(str: string, encoding: 'utf8' | 'base64' | 'base64url' | 'hex'): Uint8Array;
  export function toString(bytes: Uint8Array, encoding: 'utf8' | 'base64' | 'base64url' | 'hex'): string;
}