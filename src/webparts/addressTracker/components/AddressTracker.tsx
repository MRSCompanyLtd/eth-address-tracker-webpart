import * as React from 'react';
import styles from './AddressTracker.module.scss';
import { IAddressTrackerProps } from './IAddressTrackerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Graph from '../../../sp/graph';
import useConnection from '../../../hooks/useConnection';
import { ethers } from 'ethers';
import useAddress from '../../../hooks/useAddress';
import { Dropdown, Pivot, PivotItem, Spinner } from 'office-ui-fabric-react';
import Sent from './Transactions';
import Transactions from './Transactions';
import { formatNumber } from '../../../utils/format';

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
      <div>
        <h3 style={{ margin: '8px 0'}}>Tracking {addresses[selected].label}</h3>
        <span>{addresses[selected].address}</span>
        <Dropdown
          options={addresses.map((item, index) => { return { key: index, text: `${item.label} (${item.address.slice(0, 5)}...${item.address.slice(37)})` } })}
          selectedKey={selected}
          style={{ margin: '12px 0'}}
          onChanged={(e) => setSelected(Number(e.key))}
        />
      </div>
      <div className={styles.pivot}>
        <Pivot linkFormat={1} linkSize={1}>
          <PivotItem headerText="Details">
            {loading ?
            <Spinner />
            :
            <div style={{ margin: '12px 0' }}>
              <h3>
                Account Details
              </h3>
              <div className={styles.detailItem}>
                Current balance: {formatNumber(balance)} ETH  
              </div>
              <div className={styles.detailItem}>
                Total sent transactions: {txs.sent.length}  
              </div>
              <div className={styles.detailItem}>
                Total received transactions: {txs.received.length}  
              </div>
              <div className={styles.detailItem}>
                Tokens held: {tokens.length}
              </div>
            </div>
          }
          </PivotItem>
          <PivotItem headerText="Sent">
            <Transactions txs={txs.sent} loading={loading} type='sent' />
          </PivotItem>
          <PivotItem headerText="Received">
            <Transactions txs={txs.received} loading={loading} type='received' />
          </PivotItem>
        </Pivot>
      </div>
      </>
      }
    </section>
  )
}

export default AddressTracker;