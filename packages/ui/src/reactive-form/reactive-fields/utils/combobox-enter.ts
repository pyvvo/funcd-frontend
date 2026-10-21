import { KeyboardEvent } from 'react';

// Enter in an open dropdown belongs to the list: Mantine picks the highlighted
// option, and nothing happens when none is, instead of the browser submitting
// the form. With the dropdown closed, Enter submits as in any other field.
export const keepEnterInDropdown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (
    event.key === 'Enter' &&
    event.currentTarget.getAttribute('aria-expanded') === 'true'
  ) {
    event.preventDefault();
  }
};
