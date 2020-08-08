import React from 'react';
import { Box, Button, ButtonGroup, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ArrowDropDown as ArrowDropDownIcon, Close as CloseIcon } from '@material-ui/icons';
import API from '../../../Services/API';

export default function SendToManufacturerButton({ order, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [orderState, setOrderState] = React.useState(order);
  const [manufacturer, setManufacturer] = React.useState(null);
  const [manufacturers, setManufacturers] = React.useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = React.useState(null);
  const [buttonLabel, setButtonLabel] = React.useState(<Skeleton variant="text" width={200} />);
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const anchorRef = React.useRef(null);

  // Load associated manufacturer user data if needed
  React.useEffect(() => {
    setSelectedManufacturer(null); // If order data has changed, the selection is no longer relevant

    if (orderState && orderState.manufacturerId) {
      API.Users.get(orderState.manufacturerId).then(manufacturer => setManufacturer(manufacturer));
    } else {
      setManufacturer(null);
    }
  }, [orderState]);

  // Load list of manufacturers when list is opened
  React.useEffect(() => {
    //BUG: does not reload manufactures every use, remove second clause and set a dirty timer?
    if (open && manufacturers.length === 0) {
      API.Users.getManufacturers().then(mfgs => {
        setManufacturers(mfgs || []);
      });
    }
  }, [open, manufacturers]);

  // Update button when things change
  React.useEffect(() => {
    if (!orderState) {
      setButtonLabel(<Skeleton variant="text" width={200} />);
    }

    if (orderState.manufacturerId) {
      if (manufacturer) {
        setButtonLabel(<span>Assigned to: {manufacturer.name}</span>);
      } else {
        setButtonLabel(<span><Skeleton variant="text" width={200} /></span>);
      }
    } else {
      if (selectedManufacturer) {
        setButtonLabel(<span>Assign to: {selectedManufacturer.name}</span>);
      } else {
        setButtonLabel(<span>Assign to Manufacturer</span>);
      }
    }
  }, [orderState, manufacturer, selectedManufacturer]);

  // Update button disabled state
  React.useEffect(() => {
    setButtonDisabled(!orderState || orderState.manufacturerId !== null);
  }, [orderState]);

  // Assign order to manufacturer
  const handleClick = (event) => {
    if (selectedManufacturer) {
      API.Orders
        .update(orderState.glid, { manufacturerId: selectedManufacturer.glid })
        .then(orderData => setOrderState(orderData));
    } else {
      setOpen(true);
    }
  }

  // Toggle popper
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Close popper
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // Select item
  const handleMenuItemClick = (event, index) => { 
    setSelectedManufacturer(manufacturers[index]);
    setOpen(false);
  };

  // Unset manufacturer
  const handleClear = (event) => {
    API.Orders
      .update(orderState.glid, { manufacturerId: null })
      .then(orderData => setOrderState(orderData));
  };

  return (
    <Box {...props}>
      <ButtonGroup variant="contained" color="secondary" ref={anchorRef} aria-label="assign order">
        <Button
          onClick={handleClick}
          disabled={buttonDisabled}
        >
          {buttonLabel}
        </Button>
        {!buttonDisabled && (
          <Button
            color="secondary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="assign order to manufacturer"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        )}
        {buttonDisabled && (
          <Button
            color="secondary"
            size="small"
            aria-label="unassign order"
            onClick={handleClear}
          >
            <CloseIcon />
          </Button>
        )}
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {manufacturers && manufacturers.map((mfg, index) => (
                    <MenuItem
                      key={mfg.glid}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {mfg.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}