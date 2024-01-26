import { Typography, Theme, Box, BoxProps } from "@mui/material";

type FeaturedBoxProps = {
  title: string;
  intro: string;
  action?: JSX.Element;
} & BoxProps;

const FeaturedBox = ({ title, intro, action, ...rest }: FeaturedBoxProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: (theme: Theme) => theme.spacing(4),
        background: (theme: Theme) => theme.palette.other.background.n4,
        borderRadius: 1,
      }}
      {...rest}
    >
      <Typography variant="subtitle1">{title}</Typography>
      <Box mb={1} />
      <Typography variant="body2" color="text.secondary">
        {intro}
      </Typography>
      {action && <Box mt={4}> {action}</Box>}
    </Box>
  );
};

type InlineFeaturedBoxProps = {
  content: string;
  image?: JSX.Element;
  action?: JSX.Element;
} & BoxProps;

export const InlineFeaturedBox = ({
  content,
  image,
  action,
  ...rest
}: InlineFeaturedBoxProps) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexWrap: "wrap",
        padding: (theme: Theme) => theme.spacing(2, 4),
        background: (theme: Theme) => theme.palette.other.background.n4,
        borderRadius: 1,
      }}
      {...rest}
    >
      {image && (
        <Box
          sx={{
            display: "flex",
          }}
        >
          {image}
        </Box>
      )}
      <Box flex="1 1 0%" textAlign="center" minWidth="200px" mx={2}>
        <Typography variant="subtitle1">{content}</Typography>
      </Box>

      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default FeaturedBox;
