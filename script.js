const foods = [
    { id: 1, name: "Veg Burger", category: "Snacks", price: 99 },
    { id: 2, name: "French Fries", category: "Snacks", price: 79 },
    { id: 3, name: "Veg Biryani", category: "Meals", price: 179 },
    { id: 4, name: "Masala Dosa", category: "Meals", price: 99 },
    { id: 5, name: "Cold Coffee", category: "Drinks", price: 89 },
    { id: 6, name: "Fresh Lime Soda", category: "Drinks", price: 49 }
];

let cart = {};
let currentCategory = "All";

const money = amount => "₹" + amount.toFixed(2);

function displayMenu() {
    const search = document.getElementById("search")
        .value.toLowerCase();

    const filteredFoods = foods.filter(food =>
        (currentCategory === "All" ||
         food.category === currentCategory) &&
        food.name.toLowerCase().includes(search)
    );

    document.getElementById("menu").innerHTML =
        filteredFoods.map(food => `
            <div class="food-card">
                <h3>${food.name}</h3>
                <p>Category: ${food.category}</p>
                <p class="price">${money(food.price)}</p>
                <button class="add-btn"
                    onclick="addToCart(${food.id})">
                    Add to Cart
                </button>
            </div>
        `).join("") || "<p>No food items found.</p>";
}

function filterMenu(category) {
    currentCategory = category;
    displayMenu();
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    displayCart();
}

function changeQuantity(id, amount) {
    cart[id] = (cart[id] || 0) + amount;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    displayCart();
}

function calculateBill() {
    const subtotal = foods.reduce(
        (sum, food) =>
            sum + food.price * (cart[food.id] || 0),
        0
    );

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return { subtotal, tax, total };
}

function displayCart() {
    const selectedFoods = foods.filter(food => cart[food.id]);

    document.getElementById("cartItems").innerHTML =
        selectedFoods.length
            ? selectedFoods.map(food => `
                <div class="cart-item">
                    <div>
                        <strong>${food.name}</strong>
                        <div class="qty-controls">
                            <button onclick="changeQuantity(${food.id}, -1)">−</button>
                            <span>${cart[food.id]}</span>
                            <button onclick="changeQuantity(${food.id}, 1)">+</button>
                        </div>
                    </div>
                    <strong>${money(food.price * cart[food.id])}</strong>
                </div>
            `).join("")
            : "Your cart is empty.";

    const bill = calculateBill();

    document.getElementById("subtotal").textContent =
        money(bill.subtotal);

    document.getElementById("tax").textContent =
        money(bill.tax);

    document.getElementById("total").textContent =
        money(bill.total);
}

function clearCart() {
    cart = {};
    displayCart();
}

function placeOrder() {
    const selectedFoods = foods.filter(food => cart[food.id]);

    if (selectedFoods.length === 0) {
        alert("Please add food items first!");
        return;
    }

    const bill = calculateBill();
    const table = document.getElementById("table").value;
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    const date = new Date().toLocaleString();

    document.getElementById("billContent").innerHTML = `
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Table Number:</strong> ${table}</p>
        <p><strong>Date:</strong> ${date}</p>
        <hr>
        ${selectedFoods.map(food => `
            <div class="bill-row">
                <span>${food.name} × ${cart[food.id]}</span>
                <span>${money(food.price * cart[food.id])}</span>
            </div>
        `).join("")}
        <div class="bill-row">
            <span>Subtotal</span>
            <span>${money(bill.subtotal)}</span>
        </div>
        <div class="bill-row">
            <span>GST (5%)</span>
            <span>${money(bill.tax)}</span>
        </div>
        <div class="bill-row">
            <strong>Total Amount</strong>
            <strong>${money(bill.total)}</strong>
        </div>
        <p style="text-align:center">Thank you! Visit again.</p>
    `;

    document.getElementById("billSection").hidden = false;
    document.getElementById("billSection").scrollIntoView({
        behavior: "smooth"
    });

    alert("Order placed successfully! Order ID: " + orderId);
}

function newOrder() {
    cart = {};
    displayCart();

    document.getElementById("billSection").hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("search").addEventListener(
    "input", displayMenu
);

displayMenu();
displayCart();
