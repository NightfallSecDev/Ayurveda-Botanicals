// Admin Back-Office Logic for Ayurveda Botanicals

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    if (path.includes("dashboard.html")) {
        initAdminDashboard();
    } else if (path.includes("products.html")) {
        initAdminProducts();
    } else if (path.includes("orders.html")) {
        initAdminOrders();
    }
});

function initAdminDashboard() {
    const totalRevEl = document.querySelector(".metric-total-revenue");
    const totalOrdersEl = document.querySelector(".metric-total-orders");
    const totalProductsEl = document.querySelector(".metric-total-products");
    const recentOrdersTable = document.querySelector(".recent-orders-tbody");

    const orders = Store.getOrders();
    const products = Store.getProducts();

    const totalRev = orders.reduce((sum, o) => sum + o.total, 0) + 245800; // Simulated baseline revenue
    const totalOrdersCount = orders.length + 148; // Simulated baseline orders

    if (totalRevEl) totalRevEl.textContent = `₹${totalRev.toLocaleString()}`;
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrdersCount;
    if (totalProductsEl) totalProductsEl.textContent = products.length;

    if (recentOrdersTable) {
        let allOrders = [...orders];
        if (allOrders.length === 0) {
            // Seed some mock orders if empty
            allOrders = [
                { id: "ORD_849201", customerName: "Ananya Sharma", date: "18/05/2026", total: 1299, status: "Delivered" },
                { id: "ORD_758293", customerName: "Vikram Malhotra", date: "17/05/2026", total: 2898, status: "Processing" },
                { id: "ORD_647281", customerName: "Priya Patel", date: "16/05/2026", total: 999, status: "Shipped" },
                { id: "ORD_536271", customerName: "Rohan Verma", date: "15/05/2026", total: 1899, status: "Delivered" }
            ];
        }

        let html = "";
        allOrders.slice(0, 5).forEach(o => {
            html += `
                <tr>
                    <td style="font-weight:700; color:var(--deep-green);">${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>${o.date}</td>
                    <td style="font-weight:600; color:var(--mustard-yellow);">₹${o.total}</td>
                    <td><span class="status-badge ${o.status.toLowerCase()}">${o.status}</span></td>
                </tr>
            `;
        });
        recentOrdersTable.innerHTML = html;
    }
}

function initAdminProducts() {
    const tbody = document.querySelector(".admin-products-tbody");
    const products = Store.getProducts();
    const basePath = getBasePath();

    if (!tbody) return;

    let html = "";
    products.forEach(p => {
        html += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <img src="${basePath}assets/images/${p.image}" style="width:50px; height:50px; border-radius:12px; object-fit:cover;">
                        <span style="font-weight:700; color:var(--deep-green);">${p.name}</span>
                    </div>
                </td>
                <td><span style="background:var(--paper-tan); padding:0.3rem 0.8rem; border-radius:12px; font-weight:600; font-size:0.85rem; color:var(--deep-green);">${p.category}</span></td>
                <td style="font-weight:700; color:var(--deep-green);">₹${p.price}</td>
                <td style="color:var(--text-muted); text-decoration:line-through;">₹${p.oldPrice}</td>
                <td><span style="color:var(--gold-accent); font-weight:600;">★ ${p.rating}</span> (${p.reviews})</td>
                <td>
                    <button style="background:var(--paper-tan); color:var(--deep-green); padding:0.5rem 1rem; border-radius:12px; font-weight:600; cursor:pointer;" onclick="alert('Edit product modal simulation')">Edit</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function initAdminOrders() {
    const tbody = document.querySelector(".admin-orders-tbody");
    let orders = Store.getOrders();

    if (!tbody) return;

    if (orders.length === 0) {
        orders = [
            { id: "ORD_849201", customerName: "Ananya Sharma", date: "18/05/2026", total: 1299, status: "Delivered" },
            { id: "ORD_758293", customerName: "Vikram Malhotra", date: "17/05/2026", total: 2898, status: "Processing" },
            { id: "ORD_647281", customerName: "Priya Patel", date: "16/05/2026", total: 999, status: "Shipped" },
            { id: "ORD_536271", customerName: "Rohan Verma", date: "15/05/2026", total: 1899, status: "Delivered" }
        ];
    }

    window.updateStatus = function(id, selectEl) {
        Store.updateOrderStatus(id, selectEl.value);
        alert(`Order ${id} status updated to ${selectEl.value}`);
    };

    let html = "";
    orders.forEach(o => {
        html += `
            <tr>
                <td style="font-weight:700; color:var(--deep-green);">${o.id}</td>
                <td>${o.customerName}</td>
                <td>${o.date}</td>
                <td style="font-weight:600; color:var(--mustard-yellow);">₹${o.total}</td>
                <td>
                    <select style="padding:0.5rem 1rem; border-radius:12px; border:1px solid var(--glass-border); background:var(--alabaster); font-weight:600; color:var(--deep-green); cursor:pointer;" onchange="window.updateStatus('${o.id}', this)">
                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}
