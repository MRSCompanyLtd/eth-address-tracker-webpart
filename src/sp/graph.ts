import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const SITE_ID = "ac7fe862-2f60-4a06-a91b-7729ee91b8b9";

export default class Graph {
    private _context: WebPartContext;
    private _addressListId: string;
    private _networksListId: string;

    constructor(context: WebPartContext) {
        this._context = context;
       const ids = this._getListIds();
       Promise.resolve(ids).then(res => {
        this._addressListId = res.addressListId;
        this._networksListId = res.networksListId;
       });
    }

    public async _getListIds(): Promise<{addressListId: string, networksListId: string}> {
        return await this._context.msGraphClientFactory.getClient('3').then(async (client: MSGraphClientV3) => {
            const lists = await client.api(`/sites/${SITE_ID}/lists`).get();
            const addressListId = lists.value.find(l => l.name === 'Addresses').id;
            const networksListId = lists.value.find(l => l.name === 'Networks').id;
            return {
                addressListId,
                networksListId
            }
        });
    }

    public async getListItems(listId: string): Promise<any> {
        return await this._context.msGraphClientFactory.getClient('3').then(async (client: MSGraphClientV3) => {
            return await client.api(`/sites/${SITE_ID}/lists/${listId}/items`).get();
        })
    }

    public async getNetworks(): Promise<any> {
        return await this._context.msGraphClientFactory.getClient('3').then(async (client: MSGraphClientV3) => {
            return await client.api(`/sites/${SITE_ID}/lists/${this._networksListId}/items`).get();
        });
    }

    public printIds(): void {
        console.log(this._addressListId, this._networksListId);
    }
}