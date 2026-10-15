import { CardGridLayout, FlowCard } from '@funcd-dev/ui';
import { TextInput } from '@mantine/core';
import { IconRobot, IconSearch } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutomationStoreType } from './automation.store';

interface IAutomations {
  store: AutomationStoreType;
}

const Automations: FC<IAutomations> = observer((props) => {
  const { store } = props;
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    store.load();
  }, [store]);

  const automations = store.automations.filter((automation) =>
    automation.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CardGridLayout
      itemMinWidth={320}
      header={
        <TextInput
          placeholder="Search automations"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
      }>
      {automations.map((automation) => (
        <FlowCard
          key={automation.id}
          flowName={automation.name}
          subtitle={`${automation.enabled ? 'Enabled' : 'Disabled'} · ${automation.description}`}
          lastUpdated={new Date(automation.updatedAt)}
          leftIcon={<IconRobot size={18} />}
          onClick={() => navigate(automation.id)}
          onDelete={() => store.remove(automation.id)}
        />
      ))}
    </CardGridLayout>
  );
});

export default Automations;
