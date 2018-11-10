import { Module } from './Module.js';
import http from 'http';
import fs from 'fs';
import path from 'path';

export class Router extends Module {
  constructor () {
    super(...arguments);
    this.controllers = {};
  }

  start () {
    http.createServer((request, response) => {
      let url = request.url;

      this.serveStaticFiles(request, response);
      this.serveController(request, response);

    }).listen(3000);
  }

  serveStaticFiles(request, response) {
    let filePath = '.' + request.url;

    if (filePath.substring(2, 8) === 'server') {
      filePath = filePath.replace('server', 'client');
    }

    if (fs.existsSync(filePath)) {
      let extname = path.extname(filePath);
      let contentType = 'text/html';
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
        case '.wav':
          contentType = 'audio/wav';
          break;
      }

      fs.readFile(filePath, 'utf8', function(error, content) {
        if (error) {
          if(error.code === 'ENOENT'){
            fs.readFile('./404.html', function(error, content) {
              response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'utf-8');
            });
          }
          else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end();
          }
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
        }
      });
    }
  }

  serveController (request, response) {
    let url = request.url;
    if (this.controllers[url]) {
      let currentPathController = this.controllers[url];
      let execution = currentPathController.execute();

      if (execution instanceof Promise) {
        execution.then(markup => {
          response.writeHead(200, {
            'Content-Length': Buffer.byteLength(markup),
            'Content-Type': 'text/html'
          });
          response.write(markup);
          response.end();
        })
      }
      else {
        response.write(execution);
        response.end('ok');
      }
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