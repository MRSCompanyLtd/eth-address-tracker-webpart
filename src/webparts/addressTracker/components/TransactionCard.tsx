import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { ITransaction } from "../../../interfaces/ITransaction";
import { formatNumber } from "../../../utils/format";
import styles from "./TransactionCard.module.scss";

interface ITransactionCardProps {
    tx: ITransaction;
    type: 'sent' | 'received';
}

const TransactionCard: React.FC<ITransactionCardProps> = ({ tx, type }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    function toggleOpen() {
        setOpen(!open);
        console.log(open);
    }

    return (
        <div className={styles.tx}>
            <div className={styles.main}>
                <h3>
                    {`${type === 'sent' ? `Sent` : `Received`} ${formatNumber(tx.value)} ${tx.asset}`}
                </h3>
                <div className={styles.icons}>
                    <Icon
                        iconName="NavigateExternalInline"
                        className={styles.dropdown}
                        onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank noreferrer')}
                    />
                    <Icon
                        iconName="ChevronDown"
                        className={`${styles.dropdown} ${open ? styles.open : styles.close}`}
                        onClick={toggleOpen}
                    />
                </div>
            </div>
            <div className={`${styles.details}`} style={{height: !open ? '0px' : '120px'}}>
                <div role="span">{`${type === 'sent' ? `To: ${tx.to}` : `From: ${tx.from}`}`}</div>
                <div role="span">{`Value: ${formatNumber(tx.value)} ${tx.asset}`}</div>
                <div role="span">
                    {`Hash: ${tx.hash}`}
                </div>          
            </div>
        </div>
    );
}

export default TransactionCard;