/* oxlint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* oxlint-disable array-callback-return */
/* oxlint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable no-console */
import { HMDataGrid, IColumn } from '@funcd-dev/ui';
import { Box, Button } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Store from './store.service';

const Collectors: FC = () => {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const navigate = useNavigate();
  type Data = ReturnType<typeof Store.getRows>;

  //   useEffect(() => {
  //     adminCompanyStore.loadData();
  //   }, [adminCompanyStore]);

  const columns: IColumn<Data[0]>[] = [
    {
      key: 'name',
      name: 'Name'
    },
    { key: 'operator', name: 'Operator' },
    { key: 'subscriber', name: 'Subscriber' }
  ];

  return (
    <Box style={{ paddingBlock: '12px' }}>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button>New</Button>
      </Box>
      <HMDataGrid
        withRowSelection
        withSorting
        rowKeyGetter={(row) => row.name}
        columns={columns}
        rows={Store.getRows()}
        onRowClick={({ name }) => navigate(`./${name}`)}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
      <Outlet />
    </Box>
  );
};

export default Collectors;
