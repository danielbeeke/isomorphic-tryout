import { doImport as serverImport } from './server/Helpers.js';
import { doImport as clientImport } from './client/Helpers.js';

export class Kernel {
  constructor () {
    this.modules = {};
    this.controllers = {};
    this.views = {};
  }

  module (moduleName) {
    return this._load(
      'modules',
      moduleName,
      `./${this.environment}/${moduleName}.js`
    );
  }

  view (viewName) {
    return this._load(
      'views',
      viewName,
      `./views/${viewName}.js`
    );
  }

  controller (controllerName) {
    return this._load(
      'controllers',
      controllerName,
      `./controllers/${controllerName.toLowerCase()}/${controllerName[0].toUpperCase() + controllerName.substring(1)}.js`
    );
  }

  _load (type, name, file) {
    if (this[type][name]) {
      return new Promise(resolve => resolve(this[type][name]))
    }
    else {
      let doImport = this.environment === 'server' ? serverImport : clientImport;
      return doImport(file)
        .then(loadedModule => {
          if (typeof loadedModule[name] === 'function') {
            this[type][name] = new loadedModule[name](this);
          }
          else {
            this[type][name] = loadedModule[name];
          }
          return this[type][name];
        });
    }

  }

  get environment () {
    return typeof window === 'undefined' ? 'server' : 'client';
  }

}