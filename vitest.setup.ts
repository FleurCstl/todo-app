import '@testing-library/jest-dom/vitest';

if (typeof HTMLFormElement !== 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function (submitter) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'submitter', { value: submitter, enumerable: true });
    this.dispatchEvent(event);
  };
}
