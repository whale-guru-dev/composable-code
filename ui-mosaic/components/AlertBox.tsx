import { Theme, Box, BoxProps, alpha } from "@mui/material";

type AlertBoxProps = {
  status?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  icon?: JSX.Element;
  underlined?: boolean;
  link?: JSX.Element;
} & BoxProps;

const AlertBox = ({
  status,
  icon,
  underlined,
  link,
  children,
  ...rest
}: AlertBoxProps) => {
  return (
    <Box {...rest}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: (theme: Theme) => theme.spacing(1.625, 3),
          background: (theme: Theme) =>
            alpha(
              theme.palette[status || "success"].main,
              theme.opacity.lighter
            ),
          backdropFilter: "blur(32px)",
          borderRadius: 1,
          position: "relative",
        }}
      >
        {icon && (
          <Box mr={2.25} display="flex">
            {icon}
          </Box>
        )}
        <Box sx={{ width: "100%" }}>{children}</Box>
        {link && (
          <Box
            sx={{
              position: "absolute",
              right: 10,
            }}
          >
            {link}
          </Box>
        )}
      </Box>
      {underlined && (
        <Box
          sx={{
            borderBottom: (theme: Theme) =>
              `2px solid ${theme.palette[status || "success"].main}`,
          }}
        />
      )}
    </Box>
  );
};

AlertBox.defualtProps = {
  status: "success",
};

export default AlertBox;
