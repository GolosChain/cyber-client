import Cyber from './CyberGolos';

export { default as CyberGolos } from './CyberGolos';
export * from './CyberGolos';

export default new Cyber({
  endpoint: process.env.CYBERWAY_HTTP_URL,
});
