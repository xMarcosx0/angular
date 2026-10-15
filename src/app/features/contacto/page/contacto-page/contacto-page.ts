import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";//<---
import { Header } from '../../../../shared/components/header/header';
import { Nav } from '../../../../shared/components/nav/nav';
import { Footer } from '../../../../shared/components/footer/footer';

@Component({
  selector: 'app-contacto-page',
  imports: [RouterOutlet, Header, Nav, Footer],
  templateUrl: './contacto-page.html',
  styleUrl: './contacto-page.css',
})
export class ContactoPage {}