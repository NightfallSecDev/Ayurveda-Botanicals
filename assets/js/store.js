// Premium Ayurveda Botanicals State & Catalog Management

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/storefront/') || path.includes('/admin/') || path.includes('/legal/')) {
        return '../';
    }
    return './';
}

const INITIAL_PRODUCTS = [
    {
        id: "prod_01",
        name: "Bhringraj & Amla Intensive Hair Oil",
        category: "Herbal Hair Oils",
        categorySlug: "herbal-hair-oils",
        price: 1299,
        oldPrice: 1699,
        rating: 4.9,
        reviews: 184,
        image: "hero.png",
        description: "An authentic Ayurvedic herbal infusion crafted with pure Bhringraj, Amla, and Brahmi in cold-pressed sesame oil to deeply nourish hair follicles, stop hair fall, and stimulate lush, healthy growth.",
        benefits: ["Stops hair fall & thinning", "Stimulates dormant hair follicles", "Prevents premature greying", "100% pure botanical actives"],
        ingredients: "Organic Bhringraj (Eclipta Alba), Indian Gooseberry (Amla), Brahmi (Centella Asiatica), Licorice (Mulethi), Cold-Pressed Black Sesame Oil, Hibiscus Flowers.",
        usage: "Gently massage warm oil into the scalp and along the length of your hair. Leave on for at least 2 hours or overnight before washing with a mild herbal shampoo."
    },
    {
        id: "prod_02",
        name: "Soundarya Radiance Traditional Ubtan",
        category: "Traditional Ubtans",
        categorySlug: "traditional-ubtans",
        price: 999,
        oldPrice: 1299,
        rating: 4.8,
        reviews: 142,
        image: "ubtan.png",
        description: "A traditional golden facial cleanser powder hand-blended with sun-dried turmeric, fresh sandalwood shavings, chickpea flour, and wild rose petals for supreme gentle exfoliation and divine skin radiance.",
        benefits: ["Gently exfoliates dead skin cells", "Imparts an instant golden glow", "Fades blemishes and pigmentation", "Restores natural skin pH balance"],
        ingredients: "Sun-Dried Kasturi Turmeric, Pure Sandalwood Powder (Chandan), Organic Chickpea Flour (Besan), Fresh Pink Rose Petals, Saffron Threads, Orange Peel Powder.",
        usage: "Mix 1-2 teaspoons of ubtan powder with pure rose water or raw milk to form a smooth paste. Apply to damp face and neck, leave for 10 minutes, and rinse with lukewarm water."
    },
    {
        id: "prod_03",
        name: "Kumkumadi Night Revitalizing Elixir",
        category: "Natural Wellness",
        categorySlug: "natural-wellness",
        price: 1899,
        oldPrice: 2499,
        rating: 5.0,
        reviews: 210,
        image: "elixir.png",
        description: "A legendary Ayurvedic beauty elixir formulated with pure Kashmiri saffron, manjistha, and rare botanical actives to repair cellular damage, smooth fine lines, and impart an unparalleled golden morning glow.",
        benefits: ["Intensive nocturnal cellular repair", "Visibly smooths fine lines & wrinkles", "Illuminates dull, uneven skin tone", "Rich in pure antioxidant saffron"],
        ingredients: "Pure Kashmiri Saffron (Kumkuma), Manjistha (Rubia Cordifolia), Sandalwood Extract, Vetiver (Khus), Lotus Flower Extract, Cold-Pressed Almond & Sesame Base.",
        usage: "Take 3-4 drops of the elixir on your fingertips and gently press into cleansed face and neck every night before bed. Allow it to absorb fully overnight."
    },
    {
        id: "prod_04",
        name: "Neem & Tea Tree Scalp Clarifying Serum",
        category: "Herbal Hair Oils",
        categorySlug: "herbal-hair-oils",
        price: 899,
        oldPrice: 1199,
        rating: 4.7,
        reviews: 98,
        image: "hero.png",
        description: "A potent clarifying treatment infused with organic neem extracts and Australian tea tree to soothe itchy scalp, eliminate flakiness, and balance sebum production naturally.",
        benefits: ["Eliminates dandruff and flakiness", "Soothes irritated, inflamed scalp", "Unclogs congested hair follicles", "Non-greasy, fast-absorbing herbal formula"],
        ingredients: "Organic Neem Extract (Azadirachta Indica), Australian Tea Tree Oil, Willow Bark Extract, Aloe Vera Juice, Rosemary Essential Oil.",
        usage: "Apply directly to the scalp using the dropper, focusing on problem areas. Massage gently with fingertips. Can be used as a pre-wash treatment or overnight."
    },
    {
        id: "prod_05",
        name: "Ashwagandha & Almond Deep Tissue Butter",
        category: "Natural Wellness",
        categorySlug: "natural-wellness",
        price: 1499,
        oldPrice: 1899,
        rating: 4.9,
        reviews: 156,
        image: "ubtan.png",
        description: "An ultra-rich, velvety body butter combining the adaptogenic strength of Ashwagandha with sweet almond milk and kokum butter for profound 48-hour deep tissue moisture.",
        benefits: ["Delivers 48-hour profound deep tissue moisture", "Calms environmental skin stress", "Improves skin elasticity & suppleness", "Sensuous, grounding botanical aroma"],
        ingredients: "Ashwagandha Root Extract (Withania Somnifera), Sweet Almond Milk, Kokum Butter, Shea Butter, Cold-Pressed Coconut Oil, Vanilla Bean Extract.",
        usage: "Massage generously onto clean, dry skin after a bath or shower. Give extra attention to rough areas like elbows, knees, and heels."
    },
    {
        id: "prod_06",
        name: "Brahmi & Jatamansi Calming Hair Elixir",
        category: "Herbal Hair Oils",
        categorySlug: "herbal-hair-oils",
        price: 1399,
        oldPrice: 1799,
        rating: 4.8,
        reviews: 112,
        image: "elixir.png",
        description: "A therapeutic herbal oil blend designed to relax the nervous system, promote deep restful sleep, and strengthen hair roots with ancient Ayurvedic botanical wisdom.",
        benefits: ["Relaxes the nervous system & relieves stress", "Promotes deep, restorative sleep", "Strengthens weak hair roots", "Cooling effect on the scalp"],
        ingredients: "Brahmi Extract (Bacopa Monnieri), Jatamansi (Spikenard), Lavender Essential Oil, Peppermint Extract, Pure Coconut Base Oil.",
        usage: "Gently massage onto the crown of the head and temples before bedtime for a deeply calming, therapeutic night's sleep."
    }
];

class Store {
    static getProducts() {
        const stored = localStorage.getItem("ayurveda_products");
        if (!stored) {
            localStorage.setItem("ayurveda_products", JSON.stringify(INITIAL_PRODUCTS));
            return INITIAL_PRODUCTS;
        }
        return JSON.parse(stored);
    }

    static getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    static getCart() {
        const cart = localStorage.getItem("ayurveda_cart");
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem("ayurveda_cart", JSON.stringify(cart));
        if (typeof window.renderCartDrawer === 'function') {
            window.renderCartDrawer();
        }
    }

    static addToCart(productId, qty = 1) {
        const cart = this.getCart();
        const product = this.getProductById(productId);
        if (!product) return;

        const existingIndex = cart.findIndex(item => item.id === productId);
        if (existingIndex > -1) {
            cart[existingIndex].qty += qty;
        } else {
            cart.push({ ...product, qty });
        }
        this.saveCart(cart);
        if (typeof window.openCartDrawer === 'function') {
            window.openCartDrawer();
        }
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const updated = cart.filter(item => item.id !== productId);
        this.saveCart(updated);
    }

    static updateCartQty(productId, qty) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty = qty;
            if (item.qty <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart(cart);
            }
        }
    }

    static getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    static getCartCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    // User Authentication State
    static getCurrentUser() {
        const user = localStorage.getItem("ayurveda_current_user");
        return user ? JSON.parse(user) : null;
    }

    static setCurrentUser(user) {
        if (user) {
            localStorage.setItem("ayurveda_current_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("ayurveda_current_user");
        }
    }

    static getUsers() {
        const users = localStorage.getItem("ayurveda_users");
        return users ? JSON.parse(users) : [];
    }

    static addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem("ayurveda_users", JSON.stringify(users));
    }

    static loginUser(email, password) {
        const users = this.getUsers();
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
            this.setCurrentUser(found);
            return true;
        }
        return false;
    }

    static logoutUser() {
        this.setCurrentUser(null);
    }

    // Orders State
    static getOrders() {
        const orders = localStorage.getItem("ayurveda_orders");
        return orders ? JSON.parse(orders) : [];
    }

    static addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order);
        localStorage.setItem("ayurveda_orders", JSON.stringify(orders));
    }

    static updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem("ayurveda_orders", JSON.stringify(orders));
        }
    }
}
