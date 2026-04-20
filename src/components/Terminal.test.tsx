/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Terminal from './Terminal';

describe('Terminal Component', () => {
  test('renders prompt correctly', () => {
    render(<Terminal />);
    expect(screen.getByText(/user@k8s-cluster/i)).toBeInTheDocument();
  });
});
