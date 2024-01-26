import { TransactionType } from "@/submodules/contracts-operations/src/api";
import { Box, BoxProps, Theme, alpha } from "@mui/material";
import { useRouter } from "next/router";

type TransactionItemProps = {
  transactionId?: string;
  transactionType?: TransactionType;
} & BoxProps;

const TransactionItem = ({
  children,
  transactionId,
  transactionType,
  ...rest
}: TransactionItemProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/tx/${transactionType}/${transactionId}`);
  };
  return (
    <Box
      sx={{
        border: (theme: Theme) =>
          `1px solid ${alpha(
            theme.palette.common.white,
            theme.opacity.lighter
          )}`,
        cursor: "pointer",
        borderRadius: 1,
        padding: (theme: Theme) => theme.spacing(3),
        ":hover": {
          backgroundColor: (theme: Theme) =>
            alpha(theme.palette.background.default, 0.05),
        },
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default TransactionItem;
