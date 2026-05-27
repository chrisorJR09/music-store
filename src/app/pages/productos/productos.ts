import { Component, inject, ChangeDetectorRef } from '@angular/core'; // <-- 1. Importa ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent {

  private fb = inject(FormBuilder);
  private service = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef); // <-- 2. Inyecta el detector de cambios

  editandoId: string | null = null;

  productos: any[] = [];

  form = this.fb.group({
    tipo: [''],
    cantidad: [''],
    precio: ['']
  });

  constructor() {
    this.service.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Datos Firestore:', data);
        this.productos = data;
        
        // 3. OBLIGA A ANGULAR A PINTAR LA PANTALLA DE INMEDIATO
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al traer productos de Firestore:', err);
      }
    });
  }

  agregar() {
     if (this.editandoId) {
      // UPDATE
      this.service.actualizarProducto(this.editandoId, this.form.value)
        .then(() => {
          alert('Producto actualizado');
          this.form.reset();
          this.editandoId = null;
        });

    } else {
      // CREATE
      this.service.agregarProducto(this.form.value)
        .then(() => {
          alert('Producto agregado');
          this.form.reset();
        });
    }
  }

  eliminar(id: string) {
    this.service.eliminarProducto(id)
      .then(() => alert('Producto eliminado'));
  }

  editar(producto: any) {
    this.editandoId = producto.id;

    this.form.patchValue({
      tipo: producto.tipo,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
  }
}