import { Theme } from '@mui/material';
import { iconButtonStyleWithSizeProps, outlinedIconButtonStyleWithColorProps } from './utils';

const iconButtonVariants = (baseTheme: Theme) => {
  return [

    // start of customizing the outlined variant
    {
        props: { color: 'primary' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme)
    },
    {
        props: { color: 'secondary' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme, 'secondary')
    },
    {
        props: { color: 'success' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme, 'success')
    },
    {
        props: { color: 'info' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme, 'info')
    },
    {
        props: { color: 'warning' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme, 'warning')
    },
    {
        props: { color: 'error' },
        style: outlinedIconButtonStyleWithColorProps(baseTheme, 'error')
    },
    // end of customizing size variant

    // start of customizing size variant
    {
        props: { size: 'large' },
        style: iconButtonStyleWithSizeProps(baseTheme, '1.25rem', '1rem', 64),
      },
      {
        props: { size: 'medium' },
        style: iconButtonStyleWithSizeProps(baseTheme, '1.25rem', '1rem', 52),
      },
      {
        props: { size: 'small' },
        style: iconButtonStyleWithSizeProps(baseTheme, '1.25rem', '1rem', 40),
      },
      // end of customizing size variant

  ];   
}; 

export default iconButtonVariants;
