import { Module } from './Module.js';
import http from 'http';
import fs from 'fs';
import path from 'path';

export class Router extends Module {
  constructor () {
    super(...arguments);
    this.controllers = {};
  }

  /**
   * Starts the server side router (HTTP server)
   */
  start () {
    http.createServer((req, res) => {
      this.serve(req, res)
    }).listen(3000);
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

  getFile (filePath, callback) {

  }

  /**
   * Static file server
   */

  async serve (req, res) {
    let path = req.url.replace(/^$/, 'index.html');
    let fileName = path.substring(1);
    const contentType = this.getContentType(fileName);
    fs.readFile(fileName, 'utf8', (error, content) => {

      if (!content && this.controllers[path]) {
        let currentPathController = this.controllers[path];

        currentPathController.execute().then(markup => {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(markup, 'utf-8');
        });
      }
      else if (content) {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
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