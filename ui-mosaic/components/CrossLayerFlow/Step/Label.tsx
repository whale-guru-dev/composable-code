import { 
  Typography, 
  IconButton,
  Link, 
  Box, 
  Theme 
} from "@mui/material";
import Image from "next/image";
import { openInNew } from "assets/icons/common";

const Label = ({
  text,
  urlInfo,
}: {
  text: string;
  urlInfo?: { url: string; alt: string };
}) => {

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Typography sx={{
        color: (theme: Theme) => theme.palette.text.primary,
        fontSize: "12px",
        lineHeight: "16px",
      }}>{text}</Typography>
      {urlInfo && (
        <Link
          href={urlInfo.url}
          target="_blank"
          rel="noreferrer"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: (theme: Theme) => theme.spacing(1),
            "& svg path": {
              fill: (theme: Theme) => theme.palette.primary.main,
            },
          }}
        >
          <IconButton
            sx={{
              border: "none",
            }}
            size="small"
          >
            <Image
              src={openInNew} // TODO ?
              alt={urlInfo.alt}
              height={14}
              width={14}
              />
          </IconButton>
        </Link>
      )}
    </Box>
  );
};

export default Label;
