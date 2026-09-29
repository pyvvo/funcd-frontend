/* oxlint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* oxlint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* oxlint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable react-hooks/rules-of-hooks */
import { Drawer, ScrollArea, useMantineTheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const HMDrawer: FC<{ children: ReactNode }> = ({ ...props }) => {
  const { children } = props;
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  return (
    <>
      <Drawer
        opened
        onClose={() => navigate(-1)}
        position="right"
        padding="md"
        size="xl"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 4,
          color:
            colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]
        }}
        style={{
          root: {
            '.mantineDrawerHeader': {
              borderRadius: '20px 0px 0px 20px'
            }
          }
        }}>
        <ScrollArea style={{ height: '100%' }} pb="6px">
          {children}
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default HMDrawer;
