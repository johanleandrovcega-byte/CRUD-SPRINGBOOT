import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Producto } from './models/producto';
import { ProductoService } from './services/producto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  productos: Producto[] = [];

  nuevoProducto: Producto = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    estado: 'Activo'
  };

  productoEditandoId: number | null = null;

  
  mostrandoFormularioEditar = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  guardarProducto(): void {

    this.productoService.guardarProducto(this.nuevoProducto)
      .subscribe({
        next: () => {
          alert('Producto guardado');

          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  editarProducto(producto: Producto): void {

    this.productoEditandoId = producto.id!;

    this.nuevoProducto = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
      estado: producto.estado
    };

    this.mostrandoFormularioEditar = true;
  }

  actualizarProducto(): void {

    if (this.productoEditandoId === null) return;

    this.productoService.actualizarProducto(
      this.productoEditandoId,
      this.nuevoProducto
    ).subscribe({
      next: () => {

        alert('Producto actualizado correctamente');

        this.mostrandoFormularioEditar = false;

        this.limpiarFormulario();
        this.cargarProductos();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  cancelarEdicion(): void {

    this.mostrandoFormularioEditar = false;
    this.limpiarFormulario();
  }

  confirmarEliminar(id: number): void {

    const confirmar = confirm(
      '¿Seguro que quieres eliminar este producto?'
    );

    if (!confirmar) return;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {

        alert('Producto eliminado');

        this.cargarProductos();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  limpiarFormulario(): void {

    this.productoEditandoId = null;

    this.nuevoProducto = {
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      estado: 'Activo'
    };
  }
}