import React from "react";
import API from "../../../Services/API";
import ListTable, { tableIcons } from "../../UI/ListTable";
import GLID, { makeGLID } from "../../UI/GLID";

export default function CustomerList({ history }) {
  const [customers, setCustomers] = React.useState([]);
  const [filteringEnabled, setFilteringEnabled] = React.useState(false);

  React.useEffect(() => {
    API.Customers.getAll().then((customers) => setCustomers(customers));
  }, []);

  return (
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
          tooltip: "Add Customer",
          isFreeAction: true,
          onClick: () => history.push("/customers/new"),
        },
        {
          icon: tableIcons.Edit,
          tooltip: "Edit Customer",
          onClick: (event, rowData) =>
            history.push(`/customers/${makeGLID(rowData.glid)}`),
        },
        (rowData) => ({
          icon: tableIcons.Delete,
          tooltip: "Delete Customer",
          onClick: (event, rowData) =>
            alert(
              "Not implemented. Yes, this is a soft-delete. No you cannot delete SuperAdmins lolol."
            ),
          disabled: rowData.type === 0,
        }),
      ]}
      columns={[
        { title: "Name", field: "name" },
        {
          title: "Customer ID",
          field: "glid",
          render: (rowData) => <GLID id={rowData.glid} />,
        },
        { title: "Email", field: "email" },
        { title: "Phone", field: "phone" },
      ]}
      data={customers.map((customer) => ({
        name: `${customer.firstName} ${customer.lastName}`,
        glid: customer.glid,
        email: customer.email,
        phone: customer.phone,
      }))}
      title="Customers"
      onRowClick={(event, rowData) =>
        history.push(`/customers/${makeGLID(rowData.glid)}`)
      }
    />
  );
}
