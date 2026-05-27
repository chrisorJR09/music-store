import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot // <-- Usaremos el listener nativo de Firebase
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private firestore = inject(Firestore);

  // READ usando el SDK Nativo convertido a Observable
  obtenerProductos(): Observable<any[]> {
    return new Observable((subscriber) => {
      const productosRef = collection(this.firestore, 'productos');
      
      // onSnapshot escucha cambios en tiempo real directamente en Firestore
      const unsubscribe = onSnapshot(
        productosRef, 
        (snapshot) => {
          const productos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          subscriber.next(productos); // Emitimos los datos al componente
        },
        (error) => {
          subscriber.error(error); // Emitimos el error si ocurre
        }
      );

      // Cuando el componente se destruya, dejamos de escuchar para evitar fugas de memoria
      return () => unsubscribe();
    });
  }

  // CREATE
  agregarProducto(producto: any) {
    const productosRef = collection(this.firestore, 'productos');
    return addDoc(productosRef, producto);
  }

  // UPDATE
  actualizarProducto(id: string, producto: any) {
    const ref = doc(this.firestore, `productos/${id}`);
    return updateDoc(ref, producto);
  }

  // DELETE
  eliminarProducto(id: string) {
    const ref = doc(this.firestore, `productos/${id}`);
    return deleteDoc(ref);
  }
}