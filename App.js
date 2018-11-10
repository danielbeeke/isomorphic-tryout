import { Kernel } from './Kernel.js';

let kernel = new Kernel();

kernel.module('Router').then(router => {
  router.add('/about', kernel.controller('About'));
  router.add('/home', kernel.controller('Home'));

  router.start();
});

// kernel.get('router', 'database').then(modules => {
//   let [router, database] = modules;
//
//   console.log(database.version())
// });