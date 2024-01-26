import StatusLabel, { StatusLabelProps } from '../StatusLabel'
import { NFTTransferStatusValues } from './constants'
import { NftTransferStatusType } from './types'

interface NftStatusLabelProps extends StatusLabelProps {
    status?: NftTransferStatusType
}

const NftStatusLabel = (props: NftStatusLabelProps) => {

    const { status, ...rest } = props
    return (
        <StatusLabel {...rest} 
            color={status == NFTTransferStatusValues.done ? 
                'success' 
                : (status == NFTTransferStatusValues.error ? 'error' : undefined)}/>
    )
}

export default NftStatusLabel