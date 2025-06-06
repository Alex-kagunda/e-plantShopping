// src/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Cart State & Initialization ---
    let cart = JSON.parse(localStorage.getItem('paradiseNurseryCart')) || [];

    const saveCart = () => {
        localStorage.setItem('paradiseNurseryCart', JSON.stringify(cart));
    };

    // --- DOM Elements (Common) ---
    const cartItemCountElement = document.getElementById('cartItemCount');

    // --- Helper Functions ---
    const getProductById = (id) => plantData.find(plant => plant.id === id);

    const updateCartIconCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountElement) {
            cartItemCountElement.textContent = totalItems;
        }
    };

    // --- Page Specific Logic ---
    const currentPage = window.location.pathname.split('/').pop();

    // --- PRODUCT PAGE LOGIC ---
    if (currentPage === 'products.html' || currentPage === '') { // Assuming products.html can also be the root for now
        const productCategoriesContainer = document.getElementById('product-categories');

        const renderProducts = () => {
            if (!productCategoriesContainer) return;
            productCategoriesContainer.innerHTML = ''; // Clear existing products

            const categories = {};
            plantData.forEach(plant => {
                if (!categories[plant.category]) {
                    categories[plant.category] = [];
                }
                categories[plant.category].push(plant);
            });

            for (const categoryName in categories) {
                const categorySection = document.createElement('section');
                categorySection.className = 'category-section';

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = categoryName;
                categorySection.appendChild(categoryTitle);

                const productGrid = document.createElement('div');
                productGrid.className = 'product-grid';
                // productGrid.id = `category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`; // if needed

                categories[categoryName].forEach(plant => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <img src="${plant.image}" alt="${plant.name}">
                        <h4 class="product-name">${plant.name}</h4>
                        <p class="product-price">$${plant.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${plant.id}">Add to Cart</button>
                    `;
                    productGrid.appendChild(card);
                });
                categorySection.appendChild(productGrid);
                productCategoriesContainer.appendChild(categorySection);
            }

            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    addToCart(productId);
                });
            });
        };

        const addToCart = (productId) => {
            const existingItem = cart.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ productId, quantity: 1 });
            }
            saveCart();
            updateCartIconCount();
            // Optional: Show a small notification "Item added to cart"
            alert(`${getProductById(productId).name} added to cart!`);
        };

        if (productCategoriesContainer) renderProducts();
    }

    // --- CART PAGE LOGIC ---
    if (currentPage === 'cart.html') {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const totalCartItemsElement = document.getElementById('totalCartItems');
        const totalCartCostElement = document.getElementById('totalCartCost');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSummaryBar = document.getElementById('cart-summary');
        const cartActionsBar = document.getElementById('cart-actions');


        const renderCartItems = () => {
            if (!cartItemsContainer) return;
            cartItemsContainer.innerHTML = ''; // Clear existing items

            if (cart.length === 0) {
                if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                if (cartItemsContainer) cartItemsContainer.style.display = 'none';
                if (cartSummaryBar) cartSummaryBar.style.display = 'none';
                if (cartActionsBar) cartActionsBar.style.display = 'none';
                updateCartSummary(); // To set totals to 0
                return;
            }

            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (cartItemsContainer) cartItemsContainer.style.display = 'block'; // Make sure it's block
            if (cartSummaryBar) cartSummaryBar.style.display = 'flex'; // Or original display type
            if (cartActionsBar) cartActionsBar.style.display = 'flex'; // Or original display type


            cart.forEach(item => {
                const product = getProductById(item.productId);
                if (!product) return; // Should not happen if data is consistent

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="cart-item-thumbnail">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${product.name}</h3>
                        <p class="cart-item-price">Unit Price: $${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-qty" data-id="${product.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-qty" data-id="${product.id}">+</button>
                    </div>
                    <p class="cart-item-subtotal">Subtotal: $${(product.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-danger delete-item-btn" data-id="${product.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            addCartPageEventListeners();
            updateCartSummary();
        };

        const updateCartSummary = () => {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalCost = cart.reduce((sum, item) => {
                const product = getProductById(item.productId);
                return sum + (product ? product.price * item.quantity : 0);
            }, 0);

            if (totalCartItemsElement) totalCartItemsElement.textContent = totalItems;
            if (totalCartCostElement) totalCartCostElement.textContent = totalCost.toFixed(2);
            updateCartIconCount(); // Also update header icon
        };

        const updateQuantity = (productId, change) => {
            const item = cart.find(i => i.productId === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId); // Remove if quantity is 0 or less
                } else {
                    saveCart();
                    renderCartItems(); // Re-render to update UI (subtotals, disable buttons)
                }
            }
        };

        const removeFromCart = (productId) => {
            cart = cart.filter(item => item.productId !== productId);
            saveCart();
            renderCartItems(); // Re-render to update UI
        };

        const addCartPageEventListeners = () => {
            document.querySelectorAll('.increase-qty').forEach(button => {
                button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
            });
            document.querySelectorAll('.decrease-qty').forEach(button => {
                button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
            });
            document.querySelectorAll('.delete-item-btn').forEach(button => {
                button.addEventListener('click', (e) => removeFromCart(e.target.dataset.id));
            });
        };

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length > 0) {
                    alert(`Thank you for your order! Total: $${totalCartCostElement.textContent}\n(This is a demo, no actual checkout will occur.)`);
                    cart = []; // Empty cart after "checkout"
                    saveCart();
                    renderCartItems(); // Re-render to show empty cart
                } else {
                    alert("Your cart is empty!");
                }
            });
        }
        if (cartItemsContainer) renderCartItems();
    }

    // --- Initial Load ---
    updateCartIconCount(); // Update cart icon on every page load
});