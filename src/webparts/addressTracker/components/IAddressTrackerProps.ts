import { MSGraphClientV3 } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IAddress } from '../../../interfaces/IAddress';
import { INetwork } from '../../../interfaces/INetwork';

export interface IAddressTrackerProps {
  networks: INetwork[];
  addresses: IAddress[];
  apiKey: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
