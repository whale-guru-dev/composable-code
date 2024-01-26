import logdown from 'logdown'

export const LOGGER_ID: string = process.env.REACT_APP_LOGGER_ID || 'DefiApp'

export const getLogger = (title: string) => {
    const logger = logdown(`${LOGGER_ID}::${title}`)

    if (process.env.NODE_ENV === 'development') {
        logger.state.isEnabled = true
    } else {
        logger.state.isEnabled = false
    }

    return logger
}
