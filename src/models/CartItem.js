// Modelo que representa un item en el carrito de compras
export class CartItem {
  constructor({ id, productId, name, price, image,
                quantity }) {
    this.id = id;                 // ID único en SQLite
    this.productId = productId;   // Referencia al producto
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity || 1;
  }

  // Calcula el subtotal de este item
  getSubtotal() {
    return this.price * this.quantity;
  }

  // Crea instancia desde fila de SQLite
  static fromRow(row) {
    return new CartItem({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      price: row.price,
      image: row.image,
      quantity: row.quantity,
    });
  }
}
