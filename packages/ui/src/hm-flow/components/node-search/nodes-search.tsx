import {
  IActionsHandlersParams,
  INodeAction,
  IPyNode,
  pyNodeToNodeProps,
  useHmFlowChildrenDeps
} from '@/hm-flow';
import { Input } from '@mantine/core';
import { FC, useCallback, useMemo, useState } from 'react';
import NodesItem from './nodes-item';
interface INodesSearchProps {
  searchItems: IPyNode[];
  actions: INodeAction[];
}

const NodesSearch: FC<INodesSearchProps> = (props) => {
  const { searchItems, actions } = props;
  const { deps } = useHmFlowChildrenDeps();
  const [search, setSearch] = useState('');
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return searchItems.filter((pyNode) =>
      pyNode.data.label.toLowerCase().includes(query)
    );
  }, [searchItems, search]);
  const onSelectSearchItems = useCallback(
    (params: IActionsHandlersParams) => {
      const handler = actions.find(
        (action) => action.type === 'selectSearchItem'
      );
      if (!handler) return;
      handler.onClick(params);
    },
    [actions]
  );

  return (
    <>
      <Input
        placeholder="Search nodes"
        radius="md"
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />
      <div className="space-y-0">
        {filteredItems.map((pyNode) => {
          const {
            id,
            data: { icon, label }
          } = pyNode;
          return (
            <NodesItem
              key={id}
              img={icon}
              label={label}
              onSelect={() =>
                onSelectSearchItems({ node: pyNodeToNodeProps(pyNode), deps })
              }
            />
          );
        })}
      </div>
    </>
  );
};

export default NodesSearch;
