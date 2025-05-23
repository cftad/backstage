/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SwitchFilter } from './SwitchFilter';

describe('<SwitchFilter/>', () => {
  test('should render value', () => {
    render(<SwitchFilter label="My label" value={false} onChange={() => {}} />);

    expect(screen.getByLabelText('My label')).toBeInTheDocument();
    expect(screen.getByLabelText('My label')).not.toBeChecked();
  });

  test('should toggle value', async () => {
    const onChange = jest.fn();
    render(<SwitchFilter label="My label" value onChange={onChange} />);

    expect(screen.getByLabelText('My label')).toBeInTheDocument();
    expect(screen.getByLabelText('My label')).toBeChecked();

    await userEvent.click(screen.getByLabelText('My label'));

    expect(onChange).toHaveBeenCalledWith(false);
  });
});
