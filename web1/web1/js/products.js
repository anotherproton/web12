document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeFilters();
    const filterToggle = document.getElementById('filterToggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');

    if (filterToggle && filtersSidebar) {
        filterToggle.addEventListener('click', function() {
            filtersSidebar.classList.toggle('active');
        });

        // Close filters when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = filtersSidebar.contains(event.target) || filterToggle.contains(event.target);
            if (!isClickInside && filtersSidebar.classList.contains('active')) {
                filtersSidebar.classList.remove('active');
            }
        });
    }
});

async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = ''; // Clear existing products

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
        
        productsGrid.appendChild(productCard);
    });
}

function initializeFilters() {
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', async () => {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        let products = [...data.products];

        switch(sortFilter.value) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // If you have a date field, you can sort by that
                // For now, we'll just reverse the array
                products.reverse();
                break;
            default:
                // 'featured' - use original order
                break;
        }

        displayProducts(products);
    });

    // Material filters
    const materialFilters = document.querySelectorAll('.material-filters input');
    materialFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            const response = await fetch('/data/products.json');
            const data = await response.json();
            let products = [...data.products];

            const selectedMaterials = Array.from(materialFilters)
                .filter(f => f.checked)
                .map(f => f.value);

            if (selectedMaterials.length > 0) {
                products = products.filter(product => 
                    selectedMaterials.some(material => 
                        product.name.toLowerCase().includes(material.toLowerCase())
                    )
                );
            }

            displayProducts(products);
        });
    });

    // Price range filters
    const priceFilters = document.querySelectorAll('.price-ranges input');
    priceFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            const response = await fetch('/data/products.json');
            const data = await response.json();
            let products = [...data.products];

            const selectedRanges = Array.from(priceFilters)
                .filter(f => f.checked)
                .map(f => f.value);

            if (selectedRanges.length > 0) {
                products = products.filter(product => {
                    return selectedRanges.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        if (max) {
                            return product.price >= min && product.price <= max;
                        } else {
                            return product.price >= min;
                        }
                    });
                });
            }

            displayProducts(products);
        });
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