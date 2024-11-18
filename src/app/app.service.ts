import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { log } from 'console';
import { resolve } from 'path';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  http = inject(HttpClient);

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }
}
