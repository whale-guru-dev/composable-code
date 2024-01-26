import { Container } from "@mui/material";
import { useState } from "react";

import Earn from "../../components/Earn-phase1";

const EarnContainer = () => {
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleCompleted = () => {
    setCompleted(false);
    setConfirming(false);
  };

  return (
    <Container maxWidth="md">
      <Earn
        confirming={confirming}
        completed={completed}
        onConfirmCompleted={handleCompleted}
      />
    </Container>
  );
};

export default EarnContainer;
