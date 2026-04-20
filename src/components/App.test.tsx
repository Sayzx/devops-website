/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';

describe('App', () => {
  test('renders terminal simulator', () => {
    render(<App />);
    const elements = screen.queryAllByRole('textbox');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });
});
