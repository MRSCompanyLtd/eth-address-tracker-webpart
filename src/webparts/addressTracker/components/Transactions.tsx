import { Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { ITransaction } from "../../../interfaces/ITransaction";
import { capitalizeFirstLetter } from "../../../utils/format";
import styles from "./AddressTracker.module.scss";
import TransactionCard from "./TransactionCard";

interface ITransactionsProps {
    txs: ITransaction[];
    loading: boolean;
    type: 'sent' | 'received';
}

const Transactions: React.FC<ITransactionsProps> = ({ txs, loading, type }) => {
    const [list, setList] = React.useState<ITransaction[]>(
        txs.sort((a: ITransaction, b: ITransaction) => b.blockNumber - a.blockNumber).slice(0, 10)
    );
    const [page, setPage] = React.useState<number>(1);

    function pageList() {
        const items: JSX.Element[] = [];
        for (let i = 0; i < Math.ceil(txs.length / 10); i++) {
            items.push(
                <div
                    role="button"
                    key={i}
                    className={`${styles.pageButton} ${page === i + 1 && styles.activePage}`}
                    onClick={() => setPage(i + 1)}>
                    {i + 1}
                </div>
            );
        }

        return items;
    }

    React.useEffect(() => {
        const ls = txs.sort((a: ITransaction, b: ITransaction) => b.blockNumber - a.blockNumber);
        if (page === 1) {
            setList(ls.slice(0, 10));
        } else {
            const start = (page - 1) * 10;
            const end = start + 10;
            setList(ls.slice(start, end));
        }
    }, [page, txs]);

    return (
        <div>
            <div style={{ margin: '12px 0' }}>
                <h3>{capitalizeFirstLetter(type)} Transactions</h3>
            </div>
            {loading ?
            <Spinner />
            :
            list.map((item, index) => (
                <div key={index}>
                    <TransactionCard tx={item} type={type} />
                </div>
            ))
            }
            {!loading &&
            <div className={styles.paging}>
                {pageList()}
            </div>
            }
        </div>
    );
}

export default Transactions;