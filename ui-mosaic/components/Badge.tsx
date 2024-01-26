import {
  alpha,
  Box,
  BoxProps,
  Theme
} from "@mui/material";

type BadgeProps = {
  type?: "primary" | "error" | "success" | "info" | "warning" | "in_progress",
} & BoxProps;

const Badge = ({
  type,
  children,
  ...rest
}: BadgeProps) => {
  return (
    <Box sx={{
            backgroundColor: (theme: Theme) =>
                        type ? alpha(theme.palette[type]?.main || theme.palette.primary.main,
                                    theme.opacity.lighter)
                              : alpha(theme.palette.common.white,
                                    theme.opacity.lighter),
            padding: (theme: Theme) => theme.spacing(0.5, 1),
            borderRadius: 0.5,
          }}
          {...rest}
    >
      {children}
    </Box>
  );
}

export default Badge;


