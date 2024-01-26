import { useRouter } from 'next/router'
import { Theme, useTheme, useMediaQuery } from '@mui/material'

const DESKTOP_PAGES = [
  '/explorer', '/my-transfers'
]

const useOnlyDesktop = () => {
  const router = useRouter()
  const theme: Theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return !isDesktop && DESKTOP_PAGES.some(page => router.pathname.startsWith(page))
}

export default useOnlyDesktop
