// Carrito
let carrito = [];
let productos = []; 

// Cargar productos desde el JSON
fetch("data/data.json")
  .then(res => res.json())
  .then(data => {
    productos = data.productos;
    mostrarCatalogo(productos);
  })
  .catch(error => {
    Swal.fire({ icon: 'error', title: 'Error al cargar productos' });
  });

// Catálogo
function mostrarCatalogo(lista) {
  const catalogoDiv = document.getElementById("catalogo");
  catalogoDiv.innerHTML = "";
  lista.forEach(gorra => {
    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
      <div class="card h-100">
        <img src="${gorra.imagen}" class="card-img-top" alt="${gorra.nombre}">
        <div class="card-body">
          <h5 class="card-title">${gorra.nombre}</h5>
          <p class="card-text">Precio: $${gorra.precio}</p>
          <p class="card-text">Stock: ${gorra.stock}</p>
          <button class="btn btn-primary" onclick="agregarAlCarrito(${gorra.id})">Agregar al carrito</button>
        </div>
      </div>
    `;
    catalogoDiv.appendChild(card);
  });
}

// Función para agregar al carrito
function agregarAlCarrito(id) {
  const gorra = productos.find(g => g.id === id); // uso productos en vez de gorras
  if (!gorra) return;

  const itemEnCarrito = carrito.find(item => item.id === id);
  if (itemEnCarrito) {
    if (itemEnCarrito.cantidad < gorra.stock) {
      itemEnCarrito.cantidad++;
      Swal.fire({ icon: 'success', title: 'Cantidad actualizada en el carrito' });
    } else {
      Swal.fire({ icon: 'error', title: 'Stock insuficiente' });
    }
  } else {
    carrito.push({ ...gorra, cantidad: 1 });
    Swal.fire({ icon: 'success', title: 'Producto agregado al carrito' });
  }

  mostrarCarrito();
}

// Función para mostrar carrito
function mostrarCarrito() {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.innerHTML = "";
  if (carrito.length === 0) {
    carritoDiv.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  const lista = document.createElement("ul");
  lista.classList.add("list-group");
  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      ${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}
      <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  carritoDiv.appendChild(lista);
  const totalDiv = document.createElement("p");
  totalDiv.classList.add("mt-2");
  totalDiv.textContent = `Total: $${total}`;
  carritoDiv.appendChild(totalDiv);
}

// Función para eliminar del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  Swal.fire({ icon: 'info', title: 'Producto eliminado del carrito' });
  mostrarCarrito();
}

// Función para finalizar compra
document.getElementById("finalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire({ icon: 'warning', title: 'El carrito está vacío' });
    return;
  }

  Swal.fire({
    title: '¿Confirmar compra?',
    text: `Total: $${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, comprar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      carrito = [];
      mostrarCarrito();
      Swal.fire({ icon: 'success', title: 'Compra realizada con éxito' });
    }
  });
});