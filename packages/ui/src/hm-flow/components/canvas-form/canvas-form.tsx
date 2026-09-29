import { useHmFlowChildrenDeps } from '@/hm-flow/hooks';
import { IReactiveFieldMeta, ReactiveForm } from '@/reactive-form';
import { Box, Button } from '@mantine/core';
import { DefaultValues, useForm } from 'react-hook-form';

interface ICanvasForm<T extends Record<string, any>> {
  submitButtonText: string;
  meta: IReactiveFieldMeta<T>[];
  defaultValues: DefaultValues<T>;
  onSubmit: (submitedData: T) => void;
}

const CanvasForm = <T extends Record<string, any>>(props: ICanvasForm<T>) => {
  const { meta, submitButtonText, defaultValues, onSubmit } = props;
  const { deps } = useHmFlowChildrenDeps();

  const form = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues
  });

  return (
    <>
      <Box p={4}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            onSubmit(data);
            deps.setDrawerOpened(false);
          })}>
          <ReactiveForm form={form} meta={meta} />
          <Box mt={20}>
            <Button fullWidth type="submit">
              {submitButtonText}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default CanvasForm;
