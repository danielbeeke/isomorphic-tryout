import { Module } from './Module.js';
import { listen } from 'https://raw.githubusercontent.com/lenkan/deno-http/v0.0.4/src/http'
import { readDir, readFile } from 'deno';

export class Router extends Module {
  constructor () {
    super(...arguments);
    this.controllers = {};
  }

  /**
   * Starts the server side router (HTTP server)
   */
  start () {
    listen('127.0.0.1:3000', this.serve());
    console.log('Listening on port 3000');
  }

  getContentType (name) {
    const extension = name.split('.').pop();
    const contentTypes = {
      'css': 'text/css',
      'js': 'text/javascript',
      'html': 'text/html'
    };

    return contentTypes[extension] ? contentTypes[extension] : 'text/html';
  }

  async getFile (path) {
    let pathParts = path.split('/');
    let name = pathParts.pop();
    let folder = './' + pathParts.join('/');
    const files = await readDir(folder);
    const file = files.find(file => file.name === name);
    if (!file) { return undefined }
    return await readFile(file.path);
  }

  /**
   * Static file server
   */

  serve () {
    return async (req, res) => {
      let path = req.path.replace(/^$/, 'index.html');
      let fileName = path.substring(1);

      let content = await this.getFile(fileName);
      const contentType = this.getContentType(fileName);

      if (!content && this.controllers[path]) {
        const encoder = new TextEncoder();
        let currentPathController = this.controllers[path];
        content = encoder.encode(await currentPathController.execute());
      }

      if (!content) { return res.status(404, 'Not Found').send() }

      return res.status(200, 'OK')
        .headers({
          'Content-Length': content.byteLength.toString(),
          'Content-Type': contentType
        }).send(content)
    }
  }

  add (path, controller) {
    if (controller instanceof Promise) {
      return controller.then(controller => {
        this.controllers[path] = controller;
      })
    }
    else {
      this.controllers[path] = controller;
      return new Promise(resolve => resolve());
    }
  }
}