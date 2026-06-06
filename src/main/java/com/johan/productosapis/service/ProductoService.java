package com.johan.productosapis.service;

import com.johan.productosapis.model.Producto;
import com.johan.productosapis.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository repository;

    public List<Producto> listarTodos() {
        return repository.findAll();
    }

    public Producto buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Producto guardar(Producto producto) {

        if (producto.getId() == null) {

            if (repository.existsByCodigo(producto.getCodigo())) {
                throw new RuntimeException("El código ya existe");
            }
        }

        if (producto.getPrecio() < 0) {
            throw new RuntimeException("El precio no puede ser negativo");
        }

        if (producto.getCantidad() < 0) {
            throw new RuntimeException("La cantidad no puede ser negativa");
        }

        return repository.save(producto);

    }
    public Producto actualizar(Long id, Producto producto) {

        Producto existente = repository.findById(id).orElse(null);

        if (existente == null) {
            return null;
        }

        existente.setCodigo(producto.getCodigo());
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setCantidad(producto.getCantidad());
        existente.setEstado(producto.getEstado());

        return repository.save(existente);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
