export interface ITransaction {
    asset: string;
    blockNumber: number;
    category: string;
    erc721TokenId?: string;
    erc1155Metadata?: any;
    from: string;
    to: string;
    value: number;
    hash: string;
}