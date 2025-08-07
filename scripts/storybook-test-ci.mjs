import getPort, { portNumbers } from 'get-port';
import concurrently from 'concurrently';

console.log('Hosting built Storybook and running tests against it');
console.log('----------------------------------------------------');

// kind of random starting port, between 6000 and 6100
const startPort = Math.floor(Math.random() * 500 + 6000);

const port = await getPort({ port: portNumbers(startPort, 7000) });
console.log(`Using port: ${port}`);
const url = `http://127.0.0.1:${port}`;
console.log(`URL for Storybook: ${url}`);

console.log('----------------------------------------------------');

const commands = [
  `yarn storybook dev -p ${port} --no-open --quiet`,
  `npx --yes wait-on ${url} && yarn storybook-run --url ${url} --coverage && yarn storybook-coverage-report`,
];

concurrently(commands, {
  killOthers: ['failure', 'success'],
  successCondition: 'first',
  names: ['SB', 'TEST'],
  colors: ['magenta', 'blue'],
});
