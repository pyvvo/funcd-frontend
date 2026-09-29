import { Box, Title } from '@mantine/core';
import { cloneElement, FC, ReactNode } from 'react';
import { ChartGroupComponentType } from './types';

interface IChartGroup {
  name?: string;
  component?: ChartGroupComponentType;
  children?: ReactNode;
}

const ChartGroup: FC<IChartGroup> = (props) => {
  const { name, component, children } = props;

  return (
    <Box component="section">
      {name && (
        <Title order={4} mb="sm">
          {name}
        </Title>
      )}
      {component ? cloneElement(component, { children }) : children}
    </Box>
  );
};

export default ChartGroup;
