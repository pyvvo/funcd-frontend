import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { IconSearch, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { FC } from 'react';

const SearchBar: FC<TextInputProps> = (props) => {
  const theme = useMantineTheme();

  return (
    <TextInput
      // variant="default"
      leftSection={<IconSearch size={18} stroke={1.5} />}
      radius="xl"
      size="md"
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled">
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
      placeholder="Search questions Ctrl + K"
      rightSectionWidth={42}
      {...props}
    />
  );
};

export default SearchBar;
