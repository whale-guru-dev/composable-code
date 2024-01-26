import create from 'zustand'

const useTrxStore = create(set => ({
  trxs: 0,
  add: (trx) => set(state => ({ 
      trxs: [
          {
              id: trx.id,
              hash: trx.hash
          },
          ...state.bears, 
      ]
    })),
  remove: (trxId) => set(state => ({trxs: state.trxs.filter(trx => trx.id !== trxId)}))
}))

export default useTrxStore;