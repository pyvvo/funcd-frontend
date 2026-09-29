---
paths:
  - 'packages/ui/src/reactive-form/**/*'
  - 'packages/*/src/register-reactive-fields.tsx'
---

# Reactive form (`packages/ui/src/reactive-form`)

- Forms are data-driven. `ReactiveForm` takes `meta: IReactiveFieldMeta<TFormValues>[]` (groups of fields `{ type, fieldKey, label, options, customProps }`) and a react-hook-form `form` that the caller creates with `useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit', defaultValues })`.
- `FormBuilder.defineWidget({ name, component })` maps a `type` to a field component, and `DynamicField` looks it up. The library never registers fields itself. The apps register them in `src/register-reactive-fields.tsx`, which `App.tsx` imports for its side effect. Storybook registers them in `story-utils/decorators/reactive-form-decorator.tsx`, and a story that needs another field calls `defineWidget` at the top of its file.
- A new field copies `reactive-fields/reactive-text-field/reactive-text-field.tsx` line by line:
  - Destructure `{ form, fieldKey, label, options, error, customProps }`, then `customProps`.
  - Build `fieldProps: ReactiveFieldProps<MantineInputProps>` with `id` and `'data-testid'` set to `fieldKey`, `withAsterisk: !!options?.required`, the `hidden` style and `error: getMantineError(error)`.
  - Wrap the Mantine input in a `Controller` with `rules={{ ...options }}`, and call `customHandlechange({ form, event })` before react-hook-form's `onChange`.
- Field folder: `reactive-<name>/` with `reactive-<name>.tsx`, `types.ts` (`export type <Name>CustomProps = { size?: MantineSize; ... }`), `index.ts` and `reactive-<name>.stories.tsx`.
- Adding a field type touches `InputType` (`reactive-fields/types/reactive-field-base.ts`), `ICustomProps` (`field-custom-props.ts`), `IConditionalProp` (`field-custom-meta.ts`), `reactive-fields/index.ts`, the Storybook registration and the apps' `register-reactive-fields.tsx`.
- Model: `packages/ui/src/reactive-form/reactive-fields/reactive-text-field/` (component, types, index and story).
