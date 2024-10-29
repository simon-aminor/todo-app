import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { AppService } from './app.service';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MatFormFieldModule, MatInputModule,MatButtonModule, MatDividerModule, MatIconModule,MatListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app';
  fetchService = inject(AppService)
  typesOfShoes = []

  ngOnInit(): void {
   const data = this.fetchService.fetch().subscribe({
    next:(res)=> {
         console.log(res);
         
    },
    error:(error)=> {
        console.error = error
    }
})
  
  
   
    
  }
  
}
