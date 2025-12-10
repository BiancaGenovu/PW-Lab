import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-comparatii',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './comparatii.component.html',
  styleUrls: ['./comparatii.component.css']
})
export class ComparatiiComponent {
  
  modes = [
    {
      id: 'personala',
      icon: '📈',
      title: 'Evoluția Mea',
      description: 'Compară-ți timpii anteriori și vezi progresul tău pe fiecare circuit',
      route: '/evolutia-mea', // <<< RUTA CORECTĂ
      color: '#E10600' // verde
    },
    {
      id: 'pilot',
      icon: '⚔️',
      title: 'Duel cu Pilot',
      description: 'Alege un rival și vedeți cine este mai rapid pe circuit',
      route: '/comparare-pilot',
      color: '#E10600' // albastru
    },
    {
      id: 'top3',
      icon: '🏆',
      title: 'Top 3 Challenge',
      description: 'Vezi cum stai față de cei mai rapizi 3 piloți pe circuit',
      route: '/comparare/top3',
      color: '#e10600' // galben/auriu
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}