import { ReactNode } from 'react'
import { Theme, Typography } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'

export type VerticalMetricProps = {
  label: string
  value: ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
    label: {
      fontSize: '16px',
      lineHeight: '32px',
      color: theme.palette.text.secondary
    },
    value: {
      fontSize: '36px',
      lineHeight: '40px',
      color: theme.palette.text.primary
    }
  })
)

const VerticalMetric = ({ label, value }: VerticalMetricProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.label} component="div" gutterBottom>
        {label}
      </Typography>
      <Typography className={classes.value} component="div">
        {value}
      </Typography>
    </div>
  )
}

export default VerticalMetric
