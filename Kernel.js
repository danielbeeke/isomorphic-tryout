export class Kernel {
  constructor () {
    this.modules = {};
    this.controllers = {};
    this.views = {};
  }

  async module (moduleName) {
    return this._load(
      'modules',
      moduleName,
      `./${this.environment}/${moduleName}.js`
    );
  }

  async view (viewName) {
    return this._load(
      'views',
      viewName,
      `./views/${viewName}.js`
    );
  }

  async controller (controllerName) {
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
      return import(file)
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
    let keys = Object.keys(window);
    return keys.includes('denoMain') ? 'server' : 'client';
  }

}