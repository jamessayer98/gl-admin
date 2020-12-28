import React from "react";
import { Check as CheckIcon, Close as CloseIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import API from "../../../Services/API";
import Auth, { roles } from "../../../Services/Auth";
import ListTable, { tableIcons } from "../../UI/ListTable";
import GLID, { makeGLID } from "../../UI/GLID";
import { Confirm } from "../../UI/Modal";
import { Typography } from "@material-ui/core";

export default function UserList({ history }) {
  const { enqueueSnackbar } = useSnackbar();
  const [authUser, setAuthUser] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [filteringEnabled, setFilteringEnabled] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState(null);

  const loadData = () => {
    API.Users.getAll().then((users) => setUsers(users));
  };

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    Auth.currentUser.subscribe((data) =>
      data ? setAuthUser(data.user) : setAuthUser(null)
    );
  }, []);

  const handleDeleteClick = (event, rowData) => {
    setSelectedRowData(rowData);
    setConfirmDeleteOpen(true);
  };

  return (
    <React.Fragment>
      <ListTable
        options={{
          filtering: filteringEnabled,
        }}
        actions={[
          {
            icon: tableIcons.Filter,
            tooltip: "Toggle Filtering",
            isFreeAction: true,
            onClick: () => setFilteringEnabled(!filteringEnabled),
          },
          {
            icon: tableIcons.Add,
            tooltip: "Add User",
            isFreeAction: true,
            onClick: () => history.push("/users/new"),
          },
          (rowData) => ({
            icon: tableIcons.Edit,
            tooltip: "Edit User",
            onClick: (event, rowData) =>
              history.push(`/users/${makeGLID(rowData.glid)}`),
            disabled:
              rowData.type === roles.superadmin ||
              authUser === null ||
              authUser.role > rowData.type,
          }),
          (rowData) => ({
            icon: tableIcons.Delete,
            tooltip: "Delete User",
            onClick: handleDeleteClick,
            disabled:
              rowData.type === roles.superadmin ||
              authUser === null ||
              authUser.role > rowData.type,
          }),
        ]}
        columns={[
          { title: "Name", field: "name" },
          {
            title: "User ID",
            field: "glid",
            render: (rowData) => <GLID id={rowData.glid} />,
          },
          {
            title: "Type",
            field: "type",
            lookup: { 0: "Super Admin", 1: "Admin", 2: "Manufacturer" },
          },
          { title: "Manufaucturer", field: "manufacturer" },
          { title: "Email", field: "email" },
          {
            title: "Enabled",
            field: "enabled",
            render: (rowData) =>
              rowData.enabled ? <CheckIcon /> : <CloseIcon />,
          },
          { title: "Last Login", field: "lastLogin", type: "datetime" },
          { title: "IP", field: "ip" },
        ]}
        data={users.map((user) => ({
          name: user.name,
          glid: user.glid,
          type: user.role,
          manufacturer: user.manufacturer ? (
            user.manufacturer.name
          ) : (
            <span>&mdash;</span>
          ),
          email: user.email,
          enabled: user.enabled,
          lastLogin: user.lastAuth || <span>&mdash;</span>,
          ip: user.ip.substr(0, 6) || <span>&mdash;</span>,
        }))}
        title="Users"
      />
      <Confirm
        title="Confirm Delete"
        open={confirmDeleteOpen}
        onConfirm={() => {
          API.Users.delete(selectedRowData.glid).then((response) => {
            enqueueSnackbar("User deleted", { variant: "success" });
            setConfirmDeleteOpen(false);
            setSelectedRowData(null);
            loadData();
          });
        }}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setSelectedRowData(null);
        }}
      >
        {selectedRowData && (
          <Typography>
            Are you sure you want to delete user:{" "}
            <strong>{selectedRowData.name}</strong>?
          </Typography>
        )}
      </Confirm>
    </React.Fragment>
  );
}
