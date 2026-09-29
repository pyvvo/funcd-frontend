import type { PartialStoryFn } from 'storybook/internal/types';
import type { StoryContext } from '@storybook/react';

export interface IDecoratorParams {
  Story: PartialStoryFn;
  props: StoryContext;
}
