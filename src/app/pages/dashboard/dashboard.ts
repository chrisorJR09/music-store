import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {

  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  productos: any[] = [];

  constructor() {

    this.productosService.obtenerProductos().subscribe({
      next: (data) => {

        console.log('Productos dashboard:', data);

        this.productos = data;

        // FORZAR ACTUALIZACIÓN DE UI
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      }
    });

  }
}