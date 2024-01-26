import { ReactNode } from 'react'
import { Theme, Typography } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    text: {
      fontSize: '16px',
      lineHeight: '24px',
      color: theme.palette.text.secondary
    }
  })
)

export type HorizontalMetricProps = {
  label: string
  value: ReactNode
}

const HorizontalMetric = ({ label, value }: HorizontalMetricProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.text} component="div">
        {label}
      </Typography>
      <Typography className={classes.text} component="div">
        {value}
      </Typography>
    </div>
  )
}

export default HorizontalMetric
