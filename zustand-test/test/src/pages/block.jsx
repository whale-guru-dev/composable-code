import {useState} from 'react';
import useBlockStore from '../hooks/useBlockStore';
const Block = () => {
    const blocks = useBlockStore(state => state.blocks);
    const add = useBlockStore(state => state.add);
    const remove = useBlockStore(state => state.remove);

    const [blockID, setBlockID] = useState('');
    const [blockHash, setBlockHash] = useState('');

    return (
        <div>
            <div>
                <h2>Add Blocks</h2>
                <br/>
                <label for='blockID'>Block ID</label>
                <input type='text' id='blockID' name='blockID' value={blockID} onChange={(e) => {setBlockID(e.target.value)}}/>
                <label for='blockHash'>Block Hash</label>
                <input type='text' id='blockHash' name='blockHash' value={blockHash} onChange={(e) => {setBlockHash(e.target.value)}}/>
                <button onClick={(e) => add({id: blockID, hash: blockHash})}>Add Block</button>
            </div>

            <div>
                <h2>Blocks</h2>
                {
                    blocks && blocks.map(block => 
                        <div key={block.id}>
                            <p>Block Hash : {block.hash}</p>
                            <button onClick={(e) => remove(block.id)}>Remove</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Block;