import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'AddressTrackerWebPartStrings';
import AddressTracker from './components/AddressTracker';
import { IAddressTrackerProps } from './components/IAddressTrackerProps';
import { INetwork } from '../../interfaces/INetwork';
import { IAddress } from '../../interfaces/IAddress';

export interface IAddressTrackerWebPartProps {
  networks: INetwork[];
  addresses: IAddress[];
  apiKey: string;
}

export default class AddressTrackerWebPart extends BaseClientSideWebPart<IAddressTrackerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IAddressTrackerProps> = React.createElement(
      AddressTracker,
      {
        networks: this.properties.networks,
        addresses: this.properties.addresses,
        apiKey: this.properties.apiKey,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    await super.onInit();

    const sp = spfi().using(SPFx(this.context as any));
    const networks = await sp.web.lists.getByTitle('Networks').items();
    const addresses = await sp.web.lists.getByTitle('Addresses').items();

    this.properties.networks = networks.map((item) => {
      return {
        network: item.Title,
        key: item.RPC,
        currency: item.Currency,
        explorer: item.Explorer,
        chainId: Number(item.ChainId) ?? 1
      }
    });

    this.properties.addresses = addresses.map((item) => {
      return {
        address: item.Title,
        label: item.Label
      }
    });

    return;
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: "Ethereum Address Tracker" },
          groups: [
            {
              groupName: "API Information",
              groupFields: [
                PropertyPaneTextField('apiKey', {
                  label: "Alchemy API Key",
                  placeholder: "Paste key from Alchemy",
                  description: "Sign up for a free API key with Alchemy and paste it here."
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
