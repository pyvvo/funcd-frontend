/* eslint-disable react/require-default-props */
import { FC, ReactNode } from 'react';
import { Box, BoxProps } from '@mantine/core';
import styles from './layout-flex.module.css';

const LayoutFlex: FC<{ children?: ReactNode }> = (props) => {
  const { children, ...rest } = props;

  const fieldsProps: BoxProps = {
    className: styles.fields,
    style: () => ({
      minWidth: '100%',
      flexDirection: 'column',
      alignContent: 'center'
    })
  };

  return (
    <Box {...fieldsProps} {...rest}>
      {children}
    </Box>
  );
};
export default LayoutFlex;
