// Simple wrapper for Stellar SDK
export * from '@stellar/stellar-sdk';
export { contract, rpc } from '@stellar/stellar-sdk';

// Network configuration
export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDXKKAEMCJG5UKFXWVIAE2RBWKXMZ3EV6DQTIPOJJBCRJ62FUWZOXEF6",
  }
} as const;

// Simple client class that wraps the contract functionality
export class Client {
  private contractClient: any;

  constructor(options: any) {
    // Import contract client dynamically to avoid build issues
    const { contract } = require('@stellar/stellar-sdk');
    this.contractClient = new contract.Client(
      new contract.Spec([
        "AAAAAgAAAAAAAAAAAAAAD1Blcm1pc3Npb25FdmVudAAAAAACAAAAAQAAAAAAAAARUGVybWlzc2lvbkdyYW50ZWQAAAAAAAACAAAAEwAAABMAAAABAAAAAAAAABFQZXJtaXNzaW9uRGVsZXRlZAAAAAAAAAIAAAATAAAAEw==",
        "AAAAAAAAAAAAAAAQZ3JhbnRfcGVybWlzc2lvbgAAAAIAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAAAAAAHZ3JhbnRlZQAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAOaGFzX3Blcm1pc3Npb24AAAAAAAIAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAAAAAAHZ3JhbnRlZQAAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAARZGVsZXRlX3Blcm1pc3Npb24AAAAAAAACAAAAAAAAAAdncmFudG9yAAAAABMAAAAAAAAAB2dyYW50ZWUAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQZ2V0X2FsbF9ncmFudGVlcwAAAAEAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAEAAAPqAAAAEw=="
      ]),
      options
    );
  }

  async grant_permission(params: { grantor: string, grantee: string }, options?: any) {
    return this.contractClient.grant_permission(params, options);
  }

  async has_permission(params: { grantor: string, grantee: string }, options?: any) {
    return this.contractClient.has_permission(params, options);
  }

  async delete_permission(params: { grantor: string, grantee: string }, options?: any) {
    return this.contractClient.delete_permission(params, options);
  }

  async get_all_grantees(params: { grantor: string }, options?: any) {
    return this.contractClient.get_all_grantees(params, options);
  }
}

// Buffer polyfill for browser
if (typeof window !== 'undefined') {
  const { Buffer } = require('buffer');
  (window as any).Buffer = (window as any).Buffer || Buffer;
}