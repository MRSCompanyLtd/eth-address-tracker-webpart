import { AlchemyProvider, AlchemyWebSocketProvider, JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import * as React from "react";
import { AlchemyUrls } from "../eth/networks";
import { ITransaction } from "../interfaces/ITransaction";
import { TOKEN_ABI } from "../eth/abis";
import { IToken } from "../interfaces/IToken";

interface ITxs {
    sent: ITransaction[];
    received: ITransaction[];
}

const useAddress = (provider: AlchemyWebSocketProvider, address: string) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [balance, setBalance] = React.useState<string>('0');
    const [txs, setTxs] = React.useState<ITxs>({
        sent: [],
        received: []
    });
    const [tokens, setTokens] = React.useState<IToken[]>([]);
    
    async function getBalance(): Promise<void> {
        if (!provider) {
            return;
        }
        setBalance(ethers.utils.formatEther(await provider.getBalance(address).then((res: BigNumber) => res.toString())));
    }

    async function getRecentTransactions(): Promise<void> {
        if (!provider) {
            return;
        }

        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 0,
            "method": "alchemy_getAssetTransfers",
            "params": [{
                "fromBlock": "0x0",
                "toBlock": "latest",
                "fromAddress": address,
                "category": ["external", "erc20", "erc721", "erc1155"]
            }]
        });

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data
        };

        let url = '';
        let apiKey = provider.apiKey;

        const chainId = Number(provider.network.chainId);

        if (chainId === 137) {
            url = `https://${AlchemyUrls.polygon}/${apiKey}`
        } else if (chainId === 42161) {
            url = `https://${AlchemyUrls.arbitrum}/${apiKey}`
        } else {
            url = `https://${AlchemyUrls.ethereum}/${apiKey}`
        }

        const sent = await axios(url, requestOptions).then(res => {
            return res.data.result.transfers;
        }).catch(e => {
            console.log(e);
            return [];
        });

        data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 0,
            "method": "alchemy_getAssetTransfers",
            "params": [{
                "fromBlock": "0x0",
                "toBlock": "latest",
                "toAddress": address,
                "category": ["external", "erc20", "erc721", "erc1155"]
            }]
        });

        requestOptions.data = data;

        const received = await axios(url, requestOptions).then(res => {
            console.log(res.data.result);
            return res.data.result.transfers;
        }).catch(e => {
            console.log(e);
            return [];
        });

        const sentFormatted = sent.map((item) => {
            return {
                asset: item.asset,
                blockNumber: Number(item.blockNum),
                category: item.category,
                contract: item.rawContract.address,
                erc721TokenId: item.erc721TokenId,
                erc1155Metadata: item.erc1155Metadata,
                from: item.from,
                to: item.to,
                value: item.value,
                hash: item.hash
            }
        });

        const receivedFormatted = received.map((item) => {
            return {
                asset: item.asset,
                blockNumber: Number(item.blockNum),
                category: item.category,
                contract: item.rawContract.address,
                erc721TokenId: item.erc721TokenId,
                erc1155Metadata: item.erc1155Metadata,
                from: item.from,
                to: item.to,
                value: item.value,
                hash: item.hash
            }
        });
        
        setTxs({
            sent: sentFormatted,
            received: receivedFormatted
        });
    }

    async function getTokenBalances() {
        if (!provider) {
            return;
        }
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "alchemy_getTokenBalances",
            "headers": {
                "Content-Type": "application/json"
            },
            "params": [
                `${address}`,
                "DEFAULT_TOKENS"
            ],
            "id": 42
        });

        const config = {
            method: "POST",
            url: `https://${AlchemyUrls.ethereum}/${provider.apiKey}`,
            headers: {
                "Content-Type": "application/json"
            },
            data
        }

        const raw = await axios(config).then(res => res.data.result?.tokenBalances ?? []);

        async function getTokenData(address: string): Promise<{name: string, symbol: string, decimals: number}> {
            const contract = new ethers.Contract(address, TOKEN_ABI, provider);
            const name = await contract.name();
            const symbol = await contract.symbol();
            const decimals = await contract.decimals().then((res: BigNumber) => Number(res.toString())).catch(() => 18);

            return { name, symbol, decimals }
        }

        const tokenList = await raw.reduce(async (prev, curr) => {
            const list = await prev;
            if (BigNumber.from(curr.tokenBalance) > BigNumber.from(0)) {
                const { name, symbol, decimals } = await getTokenData(curr.contractAddress);
                list.push({
                    address: curr.contractAddress,
                    error: curr.error,
                    name,
                    symbol,
                    decimals,
                    balance: ethers.utils.formatUnits(curr.tokenBalance, decimals)
                });
            }

            return list;
        }, Promise.resolve([]));
        
        setTokens(tokenList);
    }

    React.useEffect(() => {
        if (provider && address) {
            setLoading(true);
            Promise.all([
                getBalance(),
                getRecentTransactions(),
                getTokenBalances()
            ]).then(() => {
                setLoading(false);
            });            
        }
    }, [provider, address]);

    return { balance, loading, tokens, txs, getBalance, getRecentTransactions }
}

export default useAddress;