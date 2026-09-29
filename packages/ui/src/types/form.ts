/* oxlint-disable @typescript-eslint/no-explicit-any */
import type { UseFormReturn } from 'react-hook-form';

export type FormProps<T extends Record<string, any>> = UseFormReturn<T>;
