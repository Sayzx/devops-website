/**
 * @vitest-environment jsdom
 */
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';

describe('App', () => {
  test('renders boot sequence', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.boot-sequence')).toBeInTheDocument();
  });
});
