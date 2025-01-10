document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    fetch('/data/products.json')
        .then(response => response.json())
        .then(data => {
            displayCart(cart, data.products);
        });
}

function displayCart(cart, products) {
    const cartItems = document.getElementById('cartItems');
    let subtotal = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + 5).toFixed(2)}`;
}

function proceedToCheckout() {
    // Generate random order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('orderNumber', orderNumber);
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Redirect to thank you page
    window.location.href = '/pages/thank-you.html';
} 