import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ModalProps,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Theme } from "@mui/material/styles";
import { close } from "@/assets/icons/common";

const Container = styled(Dialog)(({ theme }) => ({
  background: "transparent",
  boxShadow: "none",
  [theme.breakpoints.down("sm")]: {
    margin: 0,
    width: "100%",
  },

  "& .MuiBackdrop-root": {
    background:
      "linear-gradient(180deg, rgba(18, 12, 16, 0.8) 0%, rgba(28, 0, 18, 0.8) 82.99%)",
    backdropFilter: "blur(32px)",
  },

  "& .MuiPaper-root": {
    background: "transparent",
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      width: "100%",
    },
  },

  "& .MuiDialog-container": {
    alignItems: "center",
  },
}));

export interface TitleProps {
  id: string;
  children: React.ReactNode;
  onClose: ModalProps["onClose"];
}

const Title = (props: TitleProps) => {
  const { children, onClose, ...other } = props;

  const handleClose = (e: {}) => {
    if (onClose) {
      onClose(e, "escapeKeyDown");
    }
  };

  return (
    <DialogTitle
      sx={{
        fontSize: "28px",
        lineHeight: "48px",
        color: (theme: Theme) => theme.palette.text.primary,
        textAlign: "center",
      }}
      {...other}
    >
      <Typography variant="h3">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: (theme: Theme) => theme.spacing(3),
            top: 0,
          }}
          onClick={handleClose}
          size="large"
        >
          <Image src={close} width={14} height={14} alt="Close modal" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const Content = styled(DialogContent)(() => ({}));

const Actions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  display: "flex",
  flexDirection: "column",

  "&.MuiDialogActions-spacing": {
    "& > :not(:first-child)": {
      marginLeft: 0,
      marginTop: theme.spacing(1.5),
    },
  },
}));

const Modal = {
  Container,
  Title,
  Content,
  Actions,
};

export default Modal;
