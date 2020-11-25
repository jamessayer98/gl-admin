import React from "react";
import { Box, Button } from "@material-ui/core";
import { Receipt as ReceiptIcon, Print as PrintIcon } from "@material-ui/icons";
import Modal from "../../UI/Modal";
import PackingSlip from "./PackingSlip";
import { makeGLID } from "../../UI/GLID";

export default function PackingSlipButton({ order }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    console.log("order === ", order);
  }, [order]);

  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        startIcon={<ReceiptIcon />}
        fullWidth
        spacing="normal"
      >
        Packing Slip
      </Button>
      {open && (
        <Modal title="Packing Slip" onClose={() => setOpen(false)} fullScreen>
          <Box mb={3}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PrintIcon />}
              href={`/orders/${makeGLID(order.glid)}/packing-slip`}
              target="_blank"
            >
              Print
            </Button>
          </Box>
          <PackingSlip order={order} />
        </Modal>
      )}
    </Box>
  );
}
