import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warning-popup',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-warning-popup.component.html',
  styleUrl: './delete-warning-popup.component.scss',
})
export class DeleteWarningPopupComponent {}
