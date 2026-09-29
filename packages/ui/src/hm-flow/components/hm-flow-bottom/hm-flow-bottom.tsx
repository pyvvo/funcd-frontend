import { FC } from 'react';
import { IHmFlowBottomItem } from './hm-flow-bottom.type';

export interface IHmFlowBottomProps {
  items: IHmFlowBottomItem[];
}

const HmFlowBottom: FC<IHmFlowBottomProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item) => {
        const { component: HmFlowBottomItem, name } = item;
        return <HmFlowBottomItem key={name} />;
      })}
    </div>
  );
};

export default HmFlowBottom;
