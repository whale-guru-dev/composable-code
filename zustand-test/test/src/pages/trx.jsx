import {useState} from 'react';
import useTrxStore from '../hooks/useTrxStore';
const Trx = () => {
    const trxs = useTrxStore(state => state.trxs);
    const add = useTrxStore(state => state.add);
    const remove = useTrxStore(state => state.remove);

    const [trxID, setTrxID] = useState('');
    const [trxHash, setTrxHash] = useState('');

    return (
        <div>
            <div>
                <h2>Add Trxs</h2>
                <br/>
                <label for='trxID'>Trx ID</label>
                <input type='text' id='trxID' name='trxID' value={trxID} onChange={(e) => {setTrxID(e.target.value)}}/>
                <label for='trxHash'>Trx Hash</label>
                <input type='text' id='trxHash' name='trxHash' value={trxHash} onChange={(e) => {setTrxHash(e.target.value)}}/>
                <button onClick={(e) => add({id: trxID, hash: trxHash})}>Add Trx</button>
            </div>

            <div>
                <h2>Trxs</h2>
                {
                    trxs && trxs.map(trx => 
                        <div key={trx.id}>
                            <p>Transaction Hash : {trx.hash}</p>
                            <button onClick={(e) => {remove(trx.id)}}>Remove</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Trx;