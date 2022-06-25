import { ethers } from "ethers";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { WebSocketProvider, JsonRpcProvider, AlchemyWebSocketProvider, AlchemyProvider } from "@ethersproject/providers";
import * as React from "react";
import { INetwork } from "../interfaces/INetwork";

const useConnection = (apiKey: string) => {
    const [connected, setConnected] = React.useState<boolean>(false);
    const [provider, setProvider] = React.useState<AlchemyWebSocketProvider>(establishConnection(apiKey));

    function establishConnection(apiKey: string) {
        return new ethers.providers.AlchemyWebSocketProvider(1, apiKey);
    }

    function updateConnection(apiKey: string) {
        setProvider(establishConnection(apiKey));
    }

    async function getChainId(connect = provider): Promise<number> {
        if (provider) {
            const details = await connect.getNetwork();
            return Number(details.chainId);
        } else {
            return 0;
        }
    }

    React.useEffect(() => {
        if (provider.apiKey === apiKey) {
            setConnected(true);
        } else {
            setConnected(false);
        }
    }, [provider, apiKey]);

    return { connected, provider, updateConnection, getChainId }
}

export default useConnection;