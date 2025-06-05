import { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    talla: '',
    color: '',
    stock: '',
    imagenUrl: ''
  });
  const [editando, setEditando] = useState(false);
  const [productoId, setProductoId] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editando 
        ? `http://localhost:8080/api/productos/${productoId}`
        : 'http://localhost:8080/api/productos';
      
      const method = editando ? 'PUT' : 'POST';
      
      const body = {
        ...producto,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock)
      };
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error(`Error al ${editando ? 'actualizar' : 'guardar'} producto`);
      
      alert(`Producto ${editando ? 'actualizado' : 'guardado'} correctamente`);
      resetForm();
      fetchProductos();
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  const handleEditar = (prod) => {
    setProducto({
      nombre: prod.nombre,
      precio: prod.precio.toString(),
      talla: prod.talla,
      color: prod.color,
      stock: prod.stock.toString(),
      imagenUrl: prod.imagenUrl || ''
    });
    setEditando(true);
    setProductoId(prod.id);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Error al eliminar producto');
      
      fetchProductos();
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  const resetForm = () => {
    setProducto({
      nombre: '',
      precio: '',
      talla: '',
      color: '',
      stock: '',
      imagenUrl: ''
    });
    setEditando(false);
    setProductoId(null);
  };

  return (
    <div className="container">
      <h1 className="title">Gestión de Productos</h1>
      
      <form onSubmit={handleSubmit} className="product-form">
        <h2>{editando ? 'Editar Producto' : 'Agregar Producto'}</h2>
        
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={producto.color}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Talla:</label>
          <select
            name="talla"
            value={producto.talla}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una talla</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Imagen URL:</label>
          <input
            type="url"
            name="imagenUrl"
            value={producto.imagenUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
          {editando && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="product-list">
        <h2>Lista de Productos</h2>
        {productos.length === 0 ? (
          <p>No hay productos registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Color</th>
                <th>Talla</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.color}</td>
                  <td>{p.talla}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td className="actions">
                    <button onClick={() => handleEditar(p)}>Editar</button>
                    <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;