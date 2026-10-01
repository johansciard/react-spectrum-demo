/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {FocusableProvider as FocusableProviderFromIndex} from '../../exports/index.ts';
import {FocusableProvider} from '../../exports/FocusableProvider.ts';
import {useFocusable} from '../../exports/useFocusable.ts';
import {pointerMap, render} from '@react-spectrum/test-utils-internal';
import React, {useRef} from 'react';
import userEvent from '@testing-library/user-event';

function FocusableChild(props) {
  let ref = useRef(null);
  let {focusableProps} = useFocusable({}, ref);
  return <span role="button" ref={ref} {...props} {...focusableProps} />;
}

describe('FocusableProvider', function () {
  it('should provide DOM props to focusable descendants', async function () {
    let user = userEvent.setup({delay: null, pointerMap});
    let onFocus = jest.fn();
    let {getByRole} = render(
      <FocusableProvider aria-describedby="tooltip" onFocus={onFocus}>
        <FocusableChild />
      </FocusableProvider>
    );

    let button = getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'tooltip');
    expect(button).toHaveAttribute('tabindex', '0');

    await user.tab();
    expect(onFocus).toHaveBeenCalled();
  });

  it('should be exported from the react-aria package entry', function () {
    expect(FocusableProviderFromIndex).toBe(FocusableProvider);
  });
});
