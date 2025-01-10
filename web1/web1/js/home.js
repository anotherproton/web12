document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    initializeCategoryFilter();
});

async function loadFeaturedProducts() {
    try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        displayFeaturedProducts(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function initializeCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-filter button');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Filter products based on category
            const category = button.textContent.toLowerCase();
            filterProductsByCategory(category);
        });
    });
}

function filterProductsByCategory(category) {
    fetch('/data/products.json')
        .then(response => response.json())
        .then(data => {
            let filteredProducts = data.products;
            
            if (category !== 'all') {
                filteredProducts = data.products.filter(product => 
                    product.category.toLowerCase() === category
                );
            }
            
            displayFeaturedProducts(filteredProducts);
        })
        .catch(error => console.error('Error:', error));
}

function displayFeaturedProducts(products) {
    const productsContainer = document.getElementById('featuredProducts');
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>No products found in this category</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
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
        
        productsContainer.appendChild(productCard);
    });
}

// Add to cart function
function addToCartAndRedirect(productId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
        productId,
        quantity: 1
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Create and show thank you overlay
    const overlay = document.createElement('div');
    overlay.className = 'thank-you-overlay';
    overlay.innerHTML = `
        <div class="thank-you-modal">
            <i class="fas fa-check-circle"></i>
            <h2>Thank You!</h2>
            <p>Item successfully added to cart</p>
            <div class="order-details">
                <p>Quantity: 1</p>
                <p>Order Number: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <button onclick="window.location.href='/index.html'" class="continue-shopping-btn">
                Continue Shopping
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
} 