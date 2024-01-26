import { Box, DialogProps } from "@mui/material";
import { Dialog } from "../PreReview/Dialog";

import NetworkButton from "components/NetworkButton";
import { NETWORKS } from "../../defi/networks";
import { SupportedNetworks } from "defi/types";

interface NetworkModalProps extends DialogProps {
  networks: SupportedNetworks[];
  selected: SupportedNetworks;
  onChoose: (network: SupportedNetworks) => void;
}
const NetworkModal = ({
  networks,
  open,
  onClose,
  onChoose,
}: NetworkModalProps) => {
  const handleClose = (event: React.SyntheticEvent) => {
    if (onClose) onClose(event, "escapeKeyDown");
  };

  const handleClick =
    (id: SupportedNetworks) => (event: React.SyntheticEvent) => {
      onChoose(id);
      if (onClose) onClose(event, "escapeKeyDown");
    };

  const networksRender = networks.map((id) => {
    const network = NETWORKS[id];
    return (
      <div key={id}>
        <NetworkButton
          network={network}
          onClick={handleClick(id)}
          fullWidth
        />
        <Box mb={2} />
      </div>
    );
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box margin="auto" maxWidth={500} width="100%">{networksRender}</Box>
    </Dialog>
  );
};

export default NetworkModal;
