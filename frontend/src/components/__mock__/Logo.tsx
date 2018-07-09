export const mockLogo = jest.fn();
const mock = jest.fn().mockImplementation(() => {
  const React = require('react');
  return <div>Logo</div>;
});

export default mock;
