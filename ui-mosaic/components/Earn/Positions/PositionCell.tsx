import React from 'react'
import {
  Box,
  Typography,
  BoxProps
} from '@mui/material'
import useMobile from '@/hooks/useMobile';

type PositionCellProps = {
  label?: string,
  children: JSX.Element,
} & BoxProps

const PositionCell = ({
  label,
  children,
  ...rest
}: PositionCellProps) => {
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

export default PositionCell
