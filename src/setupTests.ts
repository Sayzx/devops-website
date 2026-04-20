import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollIntoView. This mocks it safely.
Element.prototype.scrollIntoView = function () {};
