import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Link, Button,
  Paper,
  makeStyles
} from '@material-ui/core';
import {
  Add as AddIcon
} from '@material-ui/icons';

import API from '../../../Services/API';

const useStyles = makeStyles((theme) => ({
  button: {
    marginBottom: theme.spacing(3)
  }
}));

export default function UserList() {
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    API.Users.getAll()
      .then(users => setUsers(users))
      .catch(err => console.log('yay?'));
  }, []);

  return (
    <React.Fragment>
      <RouterLink to="/users/new">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          New User
        </Button>
      </RouterLink>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 && users.map(user => (
              <TableRow key={user._id}>
                <TableCell component="th" scope="row">
                  <Link
                    to={`/users/${user._id}`}
                    component={RouterLink}
                  >
                    {user.username}
                  </Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};