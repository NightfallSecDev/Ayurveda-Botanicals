// Main Application Logic & UI Interactions for Ayurveda Botanicals

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initCartDrawer();
    initAuthMenu();
    initFAQ();
    initBeforeAfterSlider();
    
    // Page specific initializers
    const path = window.location.pathname;
    if (path.endsWith("shop.html")) {
        initShopCatalog();
    } else if (path.endsWith("product.html")) {
        initProductDetail();
    } else if (path.endsWith("checkout.html")) {
        initCheckout();
    } else if (path.endsWith("success.html")) {
        initSuccessPage();
    } else if (path.endsWith("login.html")) {
        initLogin();
    } else if (path.endsWith("signup.html")) {
        initSignup();
    }
});

/* --- HEADER & NAVIGATION --- */
function initHeader() {
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = "var(--shadow-md)";
            header.style.background = "rgba(244, 235, 225, 0.95)";
        } else {
            header.style.boxShadow = "none";
            header.style.background = "var(--glass-bg)";
        }
    });

    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector(".nav-menu");
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener("click", () => {
            const isVis = navMenu.style.display === "flex";
            navMenu.style.display = isVis ? "none" : "flex";
            navMenu.style.flexDirection = "column";
            navMenu.style.position = "absolute";
            navMenu.style.top = "100%";
            navMenu.style.left = "0";
            navMenu.style.width = "100%";
            navMenu.style.background = "var(--paper-tan)";
            navMenu.style.padding = "2rem";
            navMenu.style.boxShadow = "var(--shadow-md)";
        });
    }
}

/* --- AUTHENTICATION MENU --- */
function initAuthMenu() {
    const authContainer = document.querySelector(".auth-menu");
    if (!authContainer) return;

    const currentUser = Store.getCurrentUser();
    const basePath = getBasePath();

    if (currentUser) {
        authContainer.innerHTML = `
            <div class="user-profile-menu">
                <span>Namaste, ${currentUser.firstName}</span>
                <span class="btn-logout" onclick="window.handleLogout()">[Logout]</span>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="${basePath}storefront/login.html" class="btn-login">Login</a>
            <a href="${basePath}storefront/signup.html" class="btn-signup">Sign Up</a>
        `;
    }
}

window.handleLogout = function() {
    Store.logoutUser();
    window.location.reload();
};

/* --- BEFORE/AFTER SLIDER INTERACTIVE COMPONENT --- */
function initBeforeAfterSlider() {
    const wrapper = document.querySelector('.ba-slider-wrapper');
    if (!wrapper) return;

    const beforeLayer = wrapper.querySelector('.ba-slider-before');
    const handle = wrapper.querySelector('.ba-slider-handle');
    const button = wrapper.querySelector('.ba-slider-button');
    let isDragging = false;

    function moveSlider(clientX) {
        const rect = wrapper.getBoundingClientRect();
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        let percentage = (x / rect.width) * 100;
        
        beforeLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        beforeLayer.style.webkitClipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        handle.style.left = `${percentage}%`;
        button.style.left = `${percentage}%`;
    }

    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch listeners for mobile devices
    wrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* --- CART DRAWER --- */
function initCartDrawer() {
    const cartOverlay = document.querySelector(".cart-overlay");
    const cartDrawer = document.querySelector(".cart-drawer");
    const cartBtns = document.querySelectorAll(".cart-toggle-btn");
    const closeBtn = document.querySelector(".btn-close-cart");

    window.openCartDrawer = function() {
        if (cartOverlay && cartDrawer) {
            cartOverlay.classList.add("active");
            cartDrawer.classList.add("active");
            window.renderCartDrawer();
        }
    };

    window.closeCartDrawer = function() {
        if (cartOverlay && cartDrawer) {
            cartOverlay.classList.remove("active");
            cartDrawer.classList.remove("active");
        }
    };

    cartBtns.forEach(btn => btn.addEventListener("click", window.openCartDrawer));
    if (closeBtn) closeBtn.addEventListener("click", window.closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener("click", window.closeCartDrawer);

    window.renderCartDrawer();
}

window.renderCartDrawer = function() {
    const cartBody = document.querySelector(".cart-body");
    const cartTotalEl = document.querySelector(".cart-total-price");
    const badge = document.querySelector(".cart-badge");
    const basePath = getBasePath();

    const count = Store.getCartCount();
    if (badge) badge.textContent = count;

    if (!cartBody) return;

    const cart = Store.getCart();
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <h3>Your Ayurvedic Basket is Empty</h3>
                <p>Explore our herbal hair oils and traditional ubtans to begin your natural wellness journey.</p>
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = "₹0";
        return;
    }

    let html = "";
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${basePath}assets/images/${item.image}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-qty-ctrl">
                        <button class="qty-btn" onclick="Store.updateCartQty('${item.id}', ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="Store.updateCartQty('${item.id}', ${item.qty + 1})">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    cartBody.innerHTML = html;
    if (cartTotalEl) cartTotalEl.textContent = `₹${Store.getCartTotal()}`;
};

/* --- FAQ ACCORDION --- */
function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => {
                    i.classList.remove("active");
                    i.querySelector(".faq-answer").style.maxHeight = null;
                });
                if (!isActive) {
                    item.classList.add("active");
                    const answer = item.querySelector(".faq-answer");
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        }
    });

    // Detail page accordions
    const accBtns = document.querySelectorAll(".accordion-btn");
    accBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const isOpen = content.style.maxHeight;
            document.querySelectorAll(".accordion-content").forEach(c => c.style.maxHeight = null);
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

/* --- SHOP CATALOG PAGE --- */
function initShopCatalog() {
    const grid = document.querySelector(".product-grid");
    const searchInput = document.querySelector(".search-bar input");
    const filterCategory = document.querySelector(".filter-category");
    const sortPrice = document.querySelector(".sort-price");
    const basePath = getBasePath();

    if (!grid) return;

    function renderProducts() {
        const products = Store.getProducts();
        let filtered = [...products];

        const query = searchInput ? searchInput.value.toLowerCase() : "";
        if (query) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        const cat = filterCategory ? filterCategory.value : "all";
        if (cat !== "all") {
            filtered = filtered.filter(p => p.categorySlug === cat);
        }

        const sort = sortPrice ? sortPrice.value : "default";
        if (sort === "low-high") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === "high-low") {
            filtered.sort((a, b) => b.price - a.price);
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="cart-empty" style="grid-column: 1/-1;"><h3>No Ayurvedic botanical products match your criteria.</h3></div>`;
            return;
        }

        let html = "";
        filtered.forEach(p => {
            html += `
                <div class="product-card">
                    <a href="${basePath}storefront/product.html?id=${p.id}" class="product-img-wrap">
                        <img src="${basePath}assets/images/${p.image}" class="product-img" alt="${p.name}">
                        <div class="badge-discount">Save ${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%</div>
                    </a>
                    <div class="product-info">
                        <div class="product-category">${p.category}</div>
                        <a href="${basePath}storefront/product.html?id=${p.id}">
                            <h3 class="product-title">${p.name}</h3>
                        </a>
                        <div class="product-rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-count">${p.rating} (${p.reviews} reviews)</span>
                        </div>
                        <div class="product-price-group">
                            <span class="price-active">₹${p.price}</span>
                            <span class="price-old">₹${p.oldPrice}</span>
                        </div>
                        <button class="btn-add-cart" onclick="Store.addToCart('${p.id}')">Add to Basket</button>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }

    if (searchInput) searchInput.addEventListener("input", renderProducts);
    if (filterCategory) filterCategory.addEventListener("change", renderProducts);
    if (sortPrice) sortPrice.addEventListener("change", renderProducts);

    renderProducts();
}

/* --- PRODUCT DETAIL PAGE --- */
function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "prod_01";
    const product = Store.getProductById(id);
    const basePath = getBasePath();

    if (!product) {
        window.location.href = basePath + "storefront/shop.html";
        return;
    }

    document.title = `${product.name} | Ayurveda Botanicals`;

    const mainImg = document.querySelector(".main-img-wrap img");
    const title = document.querySelector(".detail-title");
    const ratingCount = document.querySelector(".detail-rating-count");
    const priceActive = document.querySelector(".detail-price-active");
    const priceOld = document.querySelector(".detail-price-old");
    const desc = document.querySelector(".detail-desc");
    const benefitsList = document.querySelector(".benefits-list");
    const ingredientsText = document.querySelector(".ingredients-text");
    const usageText = document.querySelector(".usage-text");
    const addBtn = document.querySelector(".detail-add-btn");

    if (mainImg) mainImg.src = `${basePath}assets/images/${product.image}`;
    if (title) title.textContent = product.name;
    if (ratingCount) ratingCount.textContent = `${product.rating} (${product.reviews} verified reviews)`;
    if (priceActive) priceActive.textContent = `₹${product.price}`;
    if (priceOld) priceOld.textContent = `₹${product.oldPrice}`;
    if (desc) desc.textContent = product.description;
    
    if (benefitsList && product.benefits) {
        benefitsList.innerHTML = product.benefits.map(b => `<li>🌿 ${b}</li>`).join("");
    }
    if (ingredientsText) ingredientsText.textContent = product.ingredients;
    if (usageText) usageText.textContent = product.usage;

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            Store.addToCart(product.id);
        });
    }

    // VIP Countdown Timer Simulation
    const timerDisplay = document.querySelector(".timer-display");
    if (timerDisplay) {
        let timeLeft = 3600 + Math.floor(Math.random() * 1800); // 1 to 1.5 hours
        setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) timeLeft = 3600;
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            timerDisplay.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

/* --- CHECKOUT PAGE --- */
function initCheckout() {
    const cart = Store.getCart();
    const basePath = getBasePath();
    if (cart.length === 0) {
        window.location.href = basePath + "storefront/shop.html";
        return;
    }

    const orderItemsContainer = document.querySelector(".checkout-order-items");
    const subtotalEl = document.querySelector(".checkout-subtotal");
    const totalEl = document.querySelector(".checkout-total");

    if (orderItemsContainer) {
        let html = "";
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${basePath}assets/images/${item.image}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} x ${item.qty}</div>
                    </div>
                    <div class="cart-item-total" style="font-weight:700; color:var(--deep-green);">
                        ₹${item.price * item.qty}
                    </div>
                </div>
            `;
        });
        orderItemsContainer.innerHTML = html;
    }

    const total = Store.getCartTotal();
    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;

    const form = document.querySelector(".checkout-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const order = {
                id: "ORD_" + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toLocaleDateString(),
                customerName: formData.get("firstName") + " " + formData.get("lastName"),
                email: formData.get("email"),
                address: formData.get("address") + ", " + formData.get("city"),
                items: cart,
                total: total,
                status: "Processing"
            };

            Store.addOrder(order);
            localStorage.removeItem("ayurveda_cart");
            window.location.href = basePath + "storefront/success.html?orderId=" + order.id;
        });
    }
}

/* --- SUCCESS PAGE --- */
function initSuccessPage() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const orderIdEl = document.querySelector(".success-order-id");
    if (orderIdEl && orderId) {
        orderIdEl.textContent = orderId;
    }
}

/* --- LOGIN PAGE --- */
function initLogin() {
    const form = document.querySelector(".login-form");
    const basePath = getBasePath();
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = form.querySelector("#email").value;
            const password = form.querySelector("#password").value;

            if (Store.loginUser(email, password)) {
                window.location.href = basePath + "index.html";
            } else {
                alert("Invalid email or password. For demo, try signing up first!");
            }
        });
    }
}

/* --- SIGNUP PAGE --- */
function initSignup() {
    const form = document.querySelector(".signup-form");
    const basePath = getBasePath();
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const firstName = form.querySelector("#firstName").value;
            const lastName = form.querySelector("#lastName").value;
            const email = form.querySelector("#email").value;
            const password = form.querySelector("#password").value;

            const newUser = { firstName, lastName, email, password };
            Store.addUser(newUser);
            Store.setCurrentUser(newUser);
            alert("Namaste! Welcome to Ayurveda Botanicals.");
            window.location.href = basePath + "index.html";
        });
    }
}
