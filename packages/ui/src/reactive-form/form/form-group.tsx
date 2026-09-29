/* oxlint-disable @typescript-eslint/no-explicit-any */
/* oxlint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/require-default-props */
import { cloneElement, CSSProperties, FC, ReactNode } from 'react';
import { FormGroupComponentType } from './types';

const styles: Record<string, CSSProperties> = {
  container: {
    minWidth: '100%'
  },
  header: {
    marginBlock: '8px'
  }
};

interface IFormGroup {
  name?: string;
  component?: FormGroupComponentType;
  children?: ReactNode;
}

const FormGroup: FC<IFormGroup> = (props) => {
  const { name, children, component, ...rest } = props;

  const bootstrapElement = (reactComponent: IFormGroup['component']) => {
    if (reactComponent) {
      return cloneElement(reactComponent, {
        children
      });
    }
    return undefined;
  };

  return (
    <>
      {bootstrapElement(component) ??
        (name && (
          <div style={styles.container} {...rest}>
            <h2 id="group-title" style={styles.header}>
              {name}
            </h2>
            <div>{children}</div>
          </div>
        ))}
    </>
  );
};

export default FormGroup;
