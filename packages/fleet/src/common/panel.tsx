import { Group, Paper, PaperProps, Title } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface IPanel extends PaperProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

// A titled card for a page's sections.
const Panel: FC<IPanel> = (props) => {
  const { title, action, children, ...rest } = props;

  return (
    <Paper
      p="lg"
      radius="var(--mantine-card-border-radius)"
      withBorder
      {...rest}>
      <Group justify="space-between" mb="md">
        <Title order={5}>{title}</Title>
        {action}
      </Group>
      {children}
    </Paper>
  );
};

export default Panel;
