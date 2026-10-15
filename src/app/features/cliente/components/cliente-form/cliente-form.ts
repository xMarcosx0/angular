// src/app/features/cliente/components/cliente-form/cliente-form.ts
 
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteForm {
  // Recibe el FormGroup desde la página padre
  @Input() form!: FormGroup;
}
