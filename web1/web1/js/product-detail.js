document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetch('/data/products.json')
            .then(response => response.json())
            .then(data => {
                const product = data.products.find(p => p.id === parseInt(productId));
                if (product) {
                    displayProductDetail(product);
                    displayRelatedProducts(data.products, product.id);
                    updateBreadcrumb(product.name);
                }
            });
    }
});

function displayProductDetail(product) {
    const productDetail = document.getElementById('productDetail');
    productDetail.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="product-info">
            <h1 class="product-title">${product.name}</h1>
            <div class="product-rating">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <span class="rating-count">4.1</span>
                <span class="rating-divider">|</span>
                <span class="reviews-count">6,645 ratings</span>
            </div>
            <div class="price-block">
                <div class="discount">-60%</div>
                <div class="price-info">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="original-price">M.R.P.: $${(product.price * 2.5).toFixed(2)}</span>
                </div>
                <div class="tax-info">Inclusive of all taxes</div>
            </div>
            <div class="purchase-section">
                <div class="quantity-selector">
                    <button onclick="updateQuantity(-1)">−</button>
                    <input type="number" id="quantity" value="1" min="1" max="10">
                    <button onclick="updateQuantity(1)">+</button>
                </div>
                <button onclick="addToCartAndRedirect(${product.id})" class="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Set tab contents with better formatting
    document.getElementById('description').innerHTML = `
        <div class="tab-section">
            <p>${product.description}</p>
            <p>Our premium cutting boards are crafted with attention to detail and designed for durability. Perfect for both professional chefs and home cooking enthusiasts.</p>
            <p>Each board undergoes rigorous quality testing to ensure it meets our high standards for kitchen use.</p>
        </div>
    `;

    document.getElementById('features').innerHTML = `
        <div class="tab-section">
            <ul class="feature-list">
                <li><i class="fas fa-check-circle"></i> Premium Quality Materials</li>
                <li><i class="fas fa-check-circle"></i> Dishwasher Safe</li>
                <li><i class="fas fa-check-circle"></i> Non-slip Design</li>
                <li><i class="fas fa-check-circle"></i> Easy to Clean</li>
                <li><i class="fas fa-check-circle"></i> Heat Resistant</li>
                <li><i class="fas fa-check-circle"></i> Knife-friendly Surface</li>
            </ul>
        </div>
    `;

    initTabs();
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function displayRelatedProducts(products, currentId) {
    // Show all products except the current one
    const otherProducts = products.filter(p => p.id !== currentId);

    const container = document.getElementById('relatedProducts');
    
    otherProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <a href="/pages/product-detail.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-info">
                    <h3>${product.name}</h3>
                    <div class="product-card-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                        <span>4.1</span>
                    </div>
                    <div class="product-card-price">
                        <span class="discount">-60%</span>
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">M.R.P.: $${(product.price * 2.5).toFixed(2)}</span>
                    </div>
                </div>
            </a>
            <button onclick="addToCartAndRedirect(${product.id})" class="add-to-cart-btn">Add to Cart</button>
        `;
        
        container.appendChild(productCard);
    });
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    if (newValue >= 1 && newValue <= 10) {
        quantityInput.value = newValue;
    }
}

function addToCartAndRedirect(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Create and show thank you overlay
    const overlay = document.createElement('div');
    overlay.className = 'thank-you-overlay';
    overlay.innerHTML = `
        <div class="thank-you-modal">
            <i class="fas fa-check-circle"></i>
            <h2>Thank You!</h2>
            <p>Item successfully added to cart</p>
            <div class="order-details">
                <p>Quantity: ${quantity}</p>
                <p>Order Number: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <button onclick="window.location.href='/index.html'" class="continue-shopping-btn">
                Continue Shopping
            </button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Add to cart logic
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
        productId,
        quantity
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(quantity);
}

function updateBreadcrumb(productName) {
    const breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = `
        <a href="/index.html">Home</a>
        <i class="fas fa-chevron-right separator"></i>
        <a href="/pages/products.html">Products</a>
        <i class="fas fa-chevron-right separator"></i>
        <span>${productName}</span>
    `;
} 