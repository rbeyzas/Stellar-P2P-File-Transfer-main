"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.networks = exports.rpc = exports.contract = void 0;
// Simple wrapper for Stellar SDK
__exportStar(require("@stellar/stellar-sdk"), exports);
var stellar_sdk_1 = require("@stellar/stellar-sdk");
Object.defineProperty(exports, "contract", { enumerable: true, get: function () { return stellar_sdk_1.contract; } });
Object.defineProperty(exports, "rpc", { enumerable: true, get: function () { return stellar_sdk_1.rpc; } });
// Network configuration
exports.networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CDXKKAEMCJG5UKFXWVIAE2RBWKXMZ3EV6DQTIPOJJBCRJ62FUWZOXEF6",
    }
};
// Simple client class that wraps the contract functionality
class Client {
    constructor(options) {
        // Import contract client dynamically to avoid build issues
        const { contract } = require('@stellar/stellar-sdk');
        this.contractClient = new contract.Client(new contract.Spec([
            "AAAAAgAAAAAAAAAAAAAAD1Blcm1pc3Npb25FdmVudAAAAAACAAAAAQAAAAAAAAARUGVybWlzc2lvbkdyYW50ZWQAAAAAAAACAAAAEwAAABMAAAABAAAAAAAAABFQZXJtaXNzaW9uRGVsZXRlZAAAAAAAAAIAAAATAAAAEw==",
            "AAAAAAAAAAAAAAAQZ3JhbnRfcGVybWlzc2lvbgAAAAIAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAAAAAAHZ3JhbnRlZQAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAOaGFzX3Blcm1pc3Npb24AAAAAAAIAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAAAAAAHZ3JhbnRlZQAAAAATAAAAAQAAAAE=",
            "AAAAAAAAAAAAAAARZGVsZXRlX3Blcm1pc3Npb24AAAAAAAACAAAAAAAAAAdncmFudG9yAAAAABMAAAAAAAAAB2dyYW50ZWUAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAQZ2V0X2FsbF9ncmFudGVlcwAAAAEAAAAAAAAAB2dyYW50b3IAAAAAEwAAAAEAAAPqAAAAEw=="
        ]), options);
    }
    async grant_permission(params, options) {
        return this.contractClient.grant_permission(params, options);
    }
    async has_permission(params, options) {
        return this.contractClient.has_permission(params, options);
    }
    async delete_permission(params, options) {
        return this.contractClient.delete_permission(params, options);
    }
    async get_all_grantees(params, options) {
        return this.contractClient.get_all_grantees(params, options);
    }
}
exports.Client = Client;
// Buffer polyfill for browser
if (typeof window !== 'undefined') {
    const { Buffer } = require('buffer');
    window.Buffer = window.Buffer || Buffer;
}
