import React from 'react'
import {
  Box,
  Typography,
  BoxProps
} from '@mui/material'
import useMobile from '@/hooks/useMobile';

type SummaryCellProps = {
  label?: string,
  children: JSX.Element,
} & BoxProps

const SummaryCell = ({
  label,
  children,
  ...rest
}: SummaryCellProps) => {
  const isMobile = useMobile('sm');

  return (
    <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          {...rest}>
      {isMobile && label && <Typography variant="body2" color="text.secondary">{label}</Typography>}
      {children}
    </Box>
  )
}

export default SummaryCell
