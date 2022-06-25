import * as React from 'react';
import styles from './AddressTracker.module.scss';
import { IAddressTrackerProps } from './IAddressTrackerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Graph from '../../../sp/graph';
import useConnection from '../../../hooks/useConnection';
import { ethers } from 'ethers';
import useAddress from '../../../hooks/useAddress';
import { Dropdown, Pivot, PivotItem, Spinner } from 'office-ui-fabric-react';

const AddressTracker: React.FC<IAddressTrackerProps> = ({ addresses, apiKey, hasTeamsContext, isDarkTheme }) => {
  const [selected, setSelected] = React.useState<number>(1);
  const { connected, provider, updateConnection, getChainId } = useConnection(apiKey);
  const { tokens, txs, balance, loading, getRecentTransactions } = useAddress(provider, addresses[selected].address);

  return (
    <section className={`${styles.addressTracker} ${hasTeamsContext ? styles.teams : ''}`}>
      {!apiKey || apiKey === '' || !connected ?
      <div className={styles.welcome}>
        <h2>{`${apiKey === '' ? 'Add an' : 'Check your'} API key to continue`}</h2>
      </div>
      :
      <>
      <div className={styles.welcome}>
        <h2>You're connected!</h2>
      </div>
      <div>
        <h4>Tracking address {addresses[selected].address}</h4>
        <Dropdown
          options={addresses.map((item, index) => { return { key: index, text: `${item.label} (${item.address.slice(0, 5)}...${item.address.slice(37)})` } })}
          selectedKey={selected}
          onChanged={(e) => setSelected(Number(e.key))}
        />
      </div>
      <div>
        <Pivot linkFormat={1} linkSize={1}>
          <PivotItem headerText="Details">
            {loading ?
            <Spinner />
            :
            <>
            <div>
              Current balance: {balance} ETH  
            </div>
            <div>
              Total sent transactions: {txs.sent.length}  
            </div>
            <div>
              Total received transactions: {txs.received.length}  
            </div>
            <div>
              Tokens held: {tokens.length}
            </div>
            </>
          }
          </PivotItem>
          <PivotItem headerText="Sent">
            Sent view
          </PivotItem>
          <PivotItem headerText="Received">
            Received view
          </PivotItem>
        </Pivot>
      </div>
      </>
      }
    </section>
  )
}

export default AddressTracker;