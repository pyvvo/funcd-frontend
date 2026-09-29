import {
  ActionIcon,
  ActionIconProps,
  useMantineColorScheme
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { FC } from 'react';

const ToggleThemeMode: FC<ActionIconProps> = (props) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="default"
      mx="xs"
      onClick={() => toggleColorScheme()}
      size={30}
      {...props}>
      {colorScheme === 'dark' ? (
        <IconSun size={16} />
      ) : (
        <IconMoonStars size={16} />
      )}
    </ActionIcon>
  );
};

export default ToggleThemeMode;
