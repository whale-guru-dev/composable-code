import create from 'zustand'

const useBlockStore = create(set => ({
    blocks: 0,
    add: (block) => set(
        state => ({
            blocks: [
                {
                    id: block.id,
                    hash: block.hash
                },
                ...state.blocks, 
            ]
        })
    ),
    remove: (blockId) => set(state => ({
        blocks: state.blocks.filter(block => block.id !== blockId)
    }))
}))

export default useBlockStore;