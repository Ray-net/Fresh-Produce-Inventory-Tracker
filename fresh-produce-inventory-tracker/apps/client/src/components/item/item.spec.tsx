import { render } from '@testing-library/react';

import Item from './item';

describe('Item', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Item type={''} />);
    expect(baseElement).toBeTruthy();
  });
});
