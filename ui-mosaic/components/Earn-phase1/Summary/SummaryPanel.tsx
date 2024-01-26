import React from 'react'
import { makeStyles, createStyles } from '@mui/styles'
import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material'

export type SummaryPanelProps = {
  children: React.ReactNode,
  className: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${alpha(theme.palette.text.primary, 0.16)}`,
      borderRadius: '10px',
      padding: theme.spacing(3, 4)
    },
  })
)

const SummaryPanel = ({ children, className }: SummaryPanelProps) => {
  const classes = useStyles()

  return (
    <div className={`${classes.root} ${className}`}>
      {children}
    </div>
  )
}

SummaryPanel.defaultProps = {
  className: ''
}

export default SummaryPanel
