import { Kernel } from './Kernel.js';

let kernel = new Kernel();

kernel.module('Router').then(router => {
  router.add('/about', kernel.component('About'));
  router.add('/home', kernel.component('Home'));
  router.start();
});
