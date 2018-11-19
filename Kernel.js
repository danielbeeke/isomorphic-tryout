export class Kernel {
  constructor () {
    this.modules = {};
    this.sharedModules = {};
    this.components = {};
  }

  async module (moduleName, variables = {}) {
    return this._load(
      'modules',
      moduleName,
      `./${this.environment}/${moduleName}.js`,
      variables
    );
  }

  async sharedModule (moduleName, variables = {}) {
    return this._load(
      'sharedModules',
      moduleName,
      `./shared/${moduleName}.js`,
      variables
    );
  }

  async component (componentName, variables = {}) {
    return this._load(
      'components',
      componentName,
      `./components/${componentName}.js`,
      variables
    );
  }

  _load (type, name, file, variables) {
    if (this[type][name]) {
      this[type][name].variables = variables;
      return new Promise(resolve => resolve(this[type][name]))
    }
    else {
      return import(file)
        .then(loadedModule => {
          if (typeof loadedModule[name] === 'function') {
            this[type][name] = new loadedModule[name](this, variables);
          }

          return this[type][name];
        });
    }
  }

  get environment () {
    return typeof global !== 'undefined' ? 'server' : 'client';
  }

}