# address-tracker-webpart

__NOTE: This webpart is still under active development and is not complete.__

## Summary

Provides tracking on Ethereum wallets via SharePoint webpart. Currently only supports Ethereum mainnet.

## Setup

1. Clone this repo.

2. Create Addresses list in your SharePoint dev tenant. Use the Title field for the address, and add a "Label" single line of text field for your tag to make the address more understandable to a human. The webpart pulls this in on mount.

3. Adjust /config/serve.json to point to your SharePoint site with the Addresses list.

4. Run yarn install

```bash
yarn install
```

5. Run gulp serve

```bash
yarn exec gulp serve
```

To build:  
6. Run build

```bash
yarn exec gulp build
yarn exec gulp bundle --ship
yarn exec gulp package-solution --ship
```

The browser should open to the workbench and you can add the webpart there to test it out.