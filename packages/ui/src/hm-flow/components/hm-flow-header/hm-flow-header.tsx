import { FC } from 'react';
import { IHmFlowHeaderItem } from './hm-flow-header.type';

export interface IHmFlowHeaderProps {
  items: IHmFlowHeaderItem[];
}

const HmFlowHeader: FC<IHmFlowHeaderProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item) => {
        const { component: HmFlowHeaderItem, name } = item;
        return <HmFlowHeaderItem key={name} />;
      })}
    </div>
  );
};

export default HmFlowHeader;
