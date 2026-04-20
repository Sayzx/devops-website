import { expect, test, describe, beforeEach } from 'vitest';
import { parseCommand } from './commandParser';

describe('commandParser', () => {
  beforeEach(() => {
    // Basic setup
  });

  test('handles empty command', () => {
    const result = parseCommand('', 'default');
    expect(result.output).toBe('');
    expect(result.error).toBeUndefined();
  });

  test('handles basic ls command', () => {
    const result = parseCommand('ls', 'default');
    expect(result.output).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  test('handles clear command', () => {
    const result = parseCommand('clear', 'default');
    expect(result.output).toBe('CLEAR');
    expect(result.error).toBeUndefined();
  });

  test('handles help command', () => {
    const result = parseCommand('help', 'default');
    expect(result.output).toContain('Available mock commands');
  });

  test('handles unknown command', () => {
    const result = parseCommand('ping google.com', 'default');
    expect(result.error).toBe(true);
    expect(result.output).toBe('bash: ping: command not found');
  });

  describe('kubectl commands', () => {
    test('kubectl without args', () => {
      const result = parseCommand('kubectl', 'default');
      expect(result.output).toContain('kubectl controls the Kubernetes cluster manager');
    });

    test('kubectl get namespaces', () => {
      const result = parseCommand('kubectl get ns', 'default');
      expect(result.output).toContain('NAME');
    });

    test('kubectl get pods in default namespace', () => {
      const result = parseCommand('kubectl get pods', 'default');
      expect(result.output).toContain('NAME');
    });
  });
});
