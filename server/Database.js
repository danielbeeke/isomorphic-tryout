import { Module } from './Module.js';

export class Database extends Module {
  constructor () {
    super(...arguments);
  }

  version () {
    return '3.2.1'
  }
}