import { HMDataGrid, IColumn } from '@funcd-dev/ui';
import { Box, Button } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { WorkflowStoreType } from './workflow.store';
import { WorkflowModel } from '@funcd-dev/lib';

interface IWorfklowsProps {
  store: WorkflowStoreType;
}

const Workflows: FC<IWorfklowsProps> = (props) => {
  const { store } = props;
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  const init = async () => {
    await store.load();
  };

  useEffect(() => {
    init();
  }, []);

  const navigate = useNavigate();

  const columns: IColumn<WorkflowModel>[] = [
    {
      key: 'id',
      name: 'Id'
    },
    { key: 'workflow_def.metadata.name', name: 'Workflow name' },
    { key: 'workflow_def.api_version', name: 'Api version' }
  ];
  console.log(store.getRows());

  return (
    <Box style={{ paddingBlock: '12px' }}>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button>New</Button>
      </Box>
      <HMDataGrid
        withRowSelection
        withSorting
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={store.getRows()}
        onRowClick={({ id }) => navigate(`./${id}`)}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
      <Outlet />
    </Box>
  );
};

export default observer(Workflows);
