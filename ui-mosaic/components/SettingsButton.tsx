import Button from "./Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {Dispatch} from "react";

type SettingsButtonProps = {
  setSettingModalOpen: Dispatch<boolean>;
};

const SettingsBtn = ({setSettingModalOpen}: SettingsButtonProps) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      transparent
      sx={{
        minWidth: "unset",
        width: 50,
        height: 50,
        p: "0 !important",
        "&:hover": {
          borderColor: {
            opacity: 0.8,
          },
        },
        cursor: "pointer",
        "&:hover svg": {
          opacity: 0.8,
        },
      }}
      onClick={() => setSettingModalOpen(true)}
    >
      <SettingsOutlinedIcon fontSize="medium" />
    </Button>
  );
};

export default SettingsBtn;