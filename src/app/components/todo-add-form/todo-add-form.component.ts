import { Component, inject, Injector, signal } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, MatDialogModule } from '@angular/material/dialog';
import { title } from 'process';

@Component({
  selector: 'app-todo-add-form',
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
     MatButtonModule,
     MatDividerModule, 
    MatIconModule, 
    MatDialogContent,       
    MatDialogModule, 
    MatDialogTitle,
     MatDialogActions,
    MatDialogClose,],
  templateUrl: './todo-add-form.component.html',
  styleUrl: './todo-add-form.component.scss',
  
})
export class TodoAddFormComponent {
  readonly dialogRef = inject(MatDialogRef<TodoAddFormComponent>);
  data = signal<any>({});

  constructor(injector: Injector){
    const a =injector.get(MAT_DIALOG_DATA, null);
    this.data.set({title:"" , body:""});

    //this.test.set(this.data()?.title) //safe null detected


    console.log(this.data());
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  append(){
console.log(this.data());

   }
}

   
