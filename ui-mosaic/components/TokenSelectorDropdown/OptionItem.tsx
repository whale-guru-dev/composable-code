import {
  Theme,
  MenuItemProps,
  alpha,
  MenuItem
} from "@mui/material";

const OptionItem = ({
  value,
  children,
  ...rest
}: MenuItemProps) => {
  return (
    <MenuItem value={value}
              sx={{
                display: "flex",
                justifyContent: "center",
                paddingTop: (theme: Theme) => theme.spacing(1.75),
                paddingBottom: (theme: Theme) => theme.spacing(1.75),
                "&:hover": {
                  backgroundColor: (theme: Theme) => alpha(theme.palette.primary.dark, theme.opacity.dark),
                },
                "&.Mui-disabled": {
                  backgroundColor: 'transparent',
                },
              }}
              {...rest}>
      {children}
    </MenuItem>
  );
};

export default OptionItem;
