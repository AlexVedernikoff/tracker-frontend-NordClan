/* eslint-disable no-undef */

import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { fireEvent, queryByLabelText, queryByText, render, waitFor } from '@testing-library/react';

import Guide from './Guide';
import PluggableGuideIterator from './domain/PluggableGuide/PluggableGuide';

let container: HTMLElement | null;

describe('Guide tests', () => {
  beforeEach(() => {
    container = document.createElement('div');

    container.insertAdjacentHTML('afterbegin', `
      <div class="target-1"></div>
      <div class="target-2"></div>
    `);

    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('should show first step', async () => {
    render(
      <Guide
        steps={[
          {
            target: '.target-1',
            content: 'step 1'
          }
        ]}
        shouldRunGuide
        guide={new PluggableGuideIterator(jest.fn(), [])}
      />
    );

    await waitFor(() => {
      return queryByLabelText(document.body, 'Open the dialog');
    });

    fireEvent.click(queryByLabelText(document.body, 'Open the dialog') as Element);

    await waitFor(() => {
      const actual = queryByText(document.body, 'step 1')?.innerHTML;
      const expected = 'step 1';

      expect(actual).toBe(expected);
    });
  });
});
