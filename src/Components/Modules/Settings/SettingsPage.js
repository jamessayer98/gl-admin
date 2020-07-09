import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Box
} from '@material-ui/core';
import DefaultLayout from '../../Layout/DefaultLayout';

export default function SettingsPage() {
  const [title] = React.useState('Pricing Table');

  const rows = [1, 2, 3, 4];

  return (
    <DefaultLayout
      title={title}
    >
      <Box
        style={{ maxWidth: 500 }}
      >
        {rows.map(row => (
          <TableContainer
            component={Paper}
            key={row}
            style={{ marginBottom: '1rem' }}
          >
            <Table
              size="small"
            >
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" rowSpan={3}>
                    <TextField
                      name="area[0]"
                      placeholder="Min. Area"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">Layers</TableCell>
                  <TableCell component="th" scope="row">Multiplier</TableCell>
                  <TableCell component="th" scope="row">Offset</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    2
                          </TableCell>
                  <TableCell>
                    <TextField
                      name="multi[0]"
                      placeholder="Multiplier"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="offset[0]"
                      placeholder="Offset"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    4
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="multi[0]"
                      placeholder="Multiplier"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="offset[0]"
                      placeholder="Offset"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </Box>
    </DefaultLayout>
  );
};