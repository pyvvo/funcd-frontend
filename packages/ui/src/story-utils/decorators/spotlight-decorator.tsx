import { Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { IDecoratorParams } from './common';

export const MantineSpotlightDecorator = (
  Story: IDecoratorParams['Story'],
  props: IDecoratorParams['props']
) => {
  const {
    args: { actions, ...rest }
  } = props;

  return (
    <>
      <Spotlight actions={actions as SpotlightActionData[]} />
      <Story args={{ ...rest }} />
    </>
  );
};
