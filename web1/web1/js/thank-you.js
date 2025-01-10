document.addEventListener('DOMContentLoaded', function() {
    const orderNumber = localStorage.getItem('orderNumber') || 'Unknown';
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // Display order details
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) {
        fetch('/data/products.json')
            .then(response => response.json())
            .then(data => {
                displayOrderDetails(cart, data.products);
            });
    }
    
    // Clear cart after displaying details
    localStorage.removeItem('cart');
});

function displayOrderDetails(cart, products) {
    const orderDetails = document.getElementById('orderDetails');
    let total = 0;
    
    const itemsHtml = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="order-item">
                <p>${product.name} x ${item.quantity}</p>
                <p>$${itemTotal.toFixed(2)}</p>
            </div>
        `;
    }).join('');
    
    orderDetails.innerHTML = `
        <div class="order-items">
            ${itemsHtml}
        </div>
        <div class="order-total">
            <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
        </div>
    `;
} 