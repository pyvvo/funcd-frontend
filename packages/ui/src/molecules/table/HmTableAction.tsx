import { IRowAction } from './types';
import styles from './table.module.css';
import { Table } from '@mantine/core';

type MEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface ITableActions<TRow extends Record<string, any>> {
  actions: IRowAction<TRow>[];
  row: TRow;
  index: number;
}

const HMTableAction = <TRow extends Record<string, any>>(
  props: ITableActions<TRow>
) => {
  const { actions, row, index } = props;
  const hasActions = actions.length > 0;

  const handleClick = (e: MEvent) => {
    e.preventDefault();
    const buttonElem = (e.target as HTMLElement).closest('button');
    if (!buttonElem) return;

    const action = actions.find((action) => action.name === buttonElem.name);
    if (!action) return;
    action.fn(row, index);
  };

  if (!hasActions) return '';

  return (
    <Table.Td className={styles.action} onClick={handleClick}>
      {actions.map((act, idx) => {
        const ActionRender = act.actionRender;
        return (
          <ActionRender key={idx} name={act.name} row={row} index={index} />
        );
      })}
    </Table.Td>
  );
};

export default HMTableAction;
