import React from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  Popper,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { Person as PersonIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import Auth from "../../Services/Auth";
import Modal from "../UI/Modal";
import ProfileForm from "./ProfileForm";

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: theme.zIndex.drawer + 1,
    marginTop: theme.spacing(1),
    minWidth: 200,
  },
  username: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    "& .MuiSvgIcon-root": {
      marginbottom: theme.spacing(1),
    },
  },
}));

export default function ProfileMenu() {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = React.useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [menuId, setMenuId] = React.useState(undefined);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileFormOpen, setProfileFormOpen] = React.useState(false);

  React.useEffect(() => {
    Auth.currentUser.subscribe((data) => setUser(data ? data.user : null));
  });

  const handleClick = (event) => {
    const anchorEl = menuAnchorEl ? null : event.currentTarget;
    const open = Boolean(anchorEl);
    const id = open ? "profile_menu" : undefined;

    setMenuAnchorEl(anchorEl);
    setMenuOpen(open);
    setMenuId(id);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setMenuOpen(false);
    setMenuId(undefined);
  };

  const handleLogout = () => {
    Auth.logout();
    history.push("/");
    return;
  };

  return (
    <React.Fragment>
      {user && (
        <React.Fragment>
          <IconButton onClick={handleClick}>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Popper
            className={classes.popper}
            id={menuId}
            open={menuOpen}
            anchorEl={menuAnchorEl}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <React.Fragment>
                  <Box className={classes.username}>
                    <PersonIcon fontSize="large" />
                    <Typography>{user.username}</Typography>
                  </Box>
                  <Divider />
                  <MenuList autoFocusItem={menuOpen} id="menu_list_grow">
                    <MenuItem
                      onClick={() => {
                        setProfileFormOpen(true);
                        handleClose();
                      }}
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose} disabled>
                      Preferences
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </React.Fragment>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </React.Fragment>
      )}
      <Modal
        open={profileFormOpen}
        title="Your Profile"
        onClose={() => setProfileFormOpen(false)}
      >
        <ProfileForm
          user={user}
          onComplete={(newUser) => {
            Auth.handleProfileUpdate(newUser);
            setProfileFormOpen(false);
            enqueueSnackbar("Profile Updated", { variant: "success" });
          }}
        />
      </Modal>
    </React.Fragment>
  );
}
