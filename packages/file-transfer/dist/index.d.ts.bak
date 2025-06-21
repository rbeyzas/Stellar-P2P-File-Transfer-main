export * from '@stellar/stellar-sdk';
export { contract, rpc } from '@stellar/stellar-sdk';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDXKKAEMCJG5UKFXWVIAE2RBWKXMZ3EV6DQTIPOJJBCRJ62FUWZOXEF6";
    };
};
export declare class Client {
    private contractClient;
    constructor(options: any);
    grant_permission(params: {
        grantor: string;
        grantee: string;
    }, options?: any): Promise<any>;
    has_permission(params: {
        grantor: string;
        grantee: string;
    }, options?: any): Promise<any>;
    delete_permission(params: {
        grantor: string;
        grantee: string;
    }, options?: any): Promise<any>;
    get_all_grantees(params: {
        grantor: string;
    }, options?: any): Promise<any>;
}
