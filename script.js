// E-Commerce Demo - Complete JavaScript Implementation
// This is a client-side only implementation with notes for backend integration

// Sample product data
const products = [
    {
        id: 1,
        title: "Headphones",
        price: 16599,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        title: "Smart Watch",
        price: 24899,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
        description: "Advanced smartwatch with health monitoring features"
    },
    {
        id: 3,
        title: "Keyboard",
        price: 12449,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
        description: "gaming keyboard with RGB lighting"
    },
    {
        id: 4,
        title: "Speaker",
        price: 7469,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop",
        description: "Portable Bluetooth speaker with 360-degree sound"
    },
    {
        id: 5,
        title: "USB-C Hub",
        price: 6637,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=200&fit=crop",
        description: "Multi-port USB-C hub for laptops and tablets"
    },
    {
        id: 6,
        title: "Mouse",
        price: 4979,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&h=200&fit=crop",
        description: "wireless mouse with precision tracking"
    }
];

// Shopping cart state
let cart = [];
let cartTotal = 0;
let taxRate = 0.085; // 8.5% tax rate

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutForm = document.getElementById('checkoutForm');
const invoiceModal = document.getElementById('invoiceModal');
const invoiceOverlay = document.getElementById('invoiceOverlay');
const invoiceBody = document.getElementById('invoiceBody');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    
    // Add event listeners
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target === checkoutOverlay) {
            closeCheckout();
        }
        if (e.target === invoiceOverlay) {
            closeInvoice();
        }
    });
});

// Render products grid
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${product.title} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Item removed from cart');
}

// Update product quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toLocaleString('en-IN');
    
    // Enable/disable checkout button
    checkoutBtn.disabled = cart.length === 0;
    
    // Render cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

// Open checkout modal
function openCheckout() {
    if (cart.length === 0) return;
    
    // Update checkout totals
    updateCheckoutTotals();
    
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckout() {
    checkoutModal.classList.remove('active');
    checkoutOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Update checkout totals
function updateCheckoutTotals() {
    const subtotal = cartTotal;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    document.getElementById('checkoutSubtotal').textContent = subtotal.toLocaleString('en-IN');
    document.getElementById('checkoutTax').textContent = tax.toLocaleString('en-IN');
    document.getElementById('checkoutTotal').textContent = total.toLocaleString('en-IN');
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(checkoutForm);
    const customerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        zipCode: formData.get('zipCode'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    
    setTimeout(() => {
        // Simulate successful payment
        showNotification('Payment successful!', 'success');
        closeCheckout();
        generateInvoice(customerData);
    }, 2000);
}

// Generate invoice
function generateInvoice(customerData) {
    const subtotal = cartTotal;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    const invoiceNumber = 'INV-' + Date.now();
    const invoiceDate = new Date().toLocaleDateString();
    const paymentMethod = customerData.paymentMethod;
    
    const invoiceHTML = `
        <div class="invoice-company">
            <h2>ShopDemo</h2>
        </div>
        
        <div class="invoice-details">
            <div class="invoice-info">
                <h4>Invoice Details</h4>
                <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Payment Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
            </div>
            
            <div class="customer-info">
                <h4>Bill To</h4>
                <p><strong>${customerData.firstName} ${customerData.lastName}</strong></p>
                <p>${customerData.email}</p>
                <p>${customerData.phone}</p>
                <p>${customerData.address}</p>
                <p>${customerData.city}, ${customerData.zipCode}</p>
            </div>
        </div>
        
        <div class="invoice-items">
            <h4>Items</h4>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td>${item.title}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price.toLocaleString('en-IN')}</td>
                            <td>₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="invoice-totals">
            <div class="total-line">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-line">
                <span>Tax (${(taxRate * 100).toFixed(1)}%):</span>
                <span>₹${tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-line total-final">
                <span>Total:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
        </div>
        
        <div class="payment-info">
            <h4>Payment Confirmation</h4>
            <p><strong>Transaction ID:</strong> TXN-${Date.now()}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">PAID</span></p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.9rem;">
            <p>Thank you for your business!</p>
            <p>This is a demo invoice. In a real application, this would be generated server-side.</p>
        </div>
    `;
    
    invoiceBody.innerHTML = invoiceHTML;
    invoiceModal.classList.add('active');
    invoiceOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Store cart data for PDF generation before clearing
    window.invoiceCartData = [...cart];
    window.invoiceCartTotal = cartTotal;
    
    // Clear cart after successful purchase
    cart = [];
    updateCartUI();
    toggleCart(); // Close cart if open
}

// Close invoice modal
function closeInvoice() {
    invoiceModal.classList.remove('active');
    invoiceOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Download invoice as PDF
function downloadInvoice() {
    try {
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get invoice data - use stored cart data or current cart
        const invoiceCart = window.invoiceCartData || cart || [];
        const subtotal = window.invoiceCartTotal || cartTotal || 0;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const invoiceNumber = 'INV-' + Date.now();
        const invoiceDate = new Date().toLocaleDateString();
        
        // Get customer data from form (if available)
        const firstName = document.getElementById('firstName')?.value || 'Customer';
        const lastName = document.getElementById('lastName')?.value || 'Name';
        const email = document.getElementById('email')?.value || 'customer@email.com';
        const phone = document.getElementById('phone')?.value || 'N/A';
        const address = document.getElementById('address')?.value || 'N/A';
        const city = document.getElementById('city')?.value || 'N/A';
        const zipCode = document.getElementById('zipCode')?.value || 'N/A';
        const paymentMethod = document.getElementById('paymentMethod')?.value || 'N/A';
        
        // Helper function to format currency with Rs. at the end
        const formatCurrency = (amount) => {
            const formatted = amount.toLocaleString('en-IN');
            return `${formatted} Rs.`;
        };
        
        // Helper function to format currency for totals (same format)
        const formatCurrencyShort = (amount) => {
            const formatted = amount.toLocaleString('en-IN');
            return `${formatted} Rs.`;
        };
        
        // Set font
        doc.setFont("helvetica");
        
        // Company header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("E-Shop", 20, 30);
        
        // Invoice details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 150, 30);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Invoice #: ${invoiceNumber}`, 150, 40);
        doc.text(`Date: ${invoiceDate}`, 150, 45);
        doc.text(`Payment Method: ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`, 150, 50);
        
        // Customer info
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To:", 20, 50);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${firstName} ${lastName}`, 20, 60);
        doc.text(email, 20, 65);
        doc.text(phone, 20, 70);
        doc.text(address, 20, 75);
        doc.text(`${city}, ${zipCode}`, 20, 80);
        
        // Items table header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Items", 20, 100);
        
        // Table headers with better spacing
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Item", 20, 110);
        doc.text("Qty", 100, 110);
        doc.text("Price", 130, 110);
        doc.text("Total", 170, 110);
        
        // Draw line under headers
        doc.line(20, 115, 190, 115);
        
        // Items
        let yPosition = 125;
        
        // Check if cart has items
        if (invoiceCart && invoiceCart.length > 0) {
            invoiceCart.forEach(item => {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                
                // Item name (with word wrapping if too long)
                const itemName = item.title.length > 15 ? item.title.substring(0, 15) + "..." : item.title;
                doc.text(itemName, 20, yPosition);
                
                // Quantity
                doc.text(item.quantity.toString(), 100, yPosition);
                
                // Price
                doc.text(formatCurrency(item.price), 130, yPosition);
                
                // Total
                doc.text(formatCurrency(item.price * item.quantity), 170, yPosition);
                
                yPosition += 12; // Increased spacing between rows
            });
        } else {
            // Show message if no items
            doc.setFont("helvetica", "italic");
            doc.text("No items in cart", 20, yPosition);
            yPosition += 12;
        }
        
        // Totals section with better spacing
        yPosition += 10;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Subtotal:`, 130, yPosition);
        doc.text(formatCurrencyShort(subtotal), 170, yPosition);
        yPosition += 12;
        
        doc.text(`Tax (${(taxRate * 100).toFixed(1)}%):`, 130, yPosition);
        doc.text(formatCurrencyShort(tax), 170, yPosition);
        yPosition += 12;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(`Total:`, 130, yPosition);
        doc.text(formatCurrencyShort(total), 170, yPosition);
        
        // Payment confirmation
        yPosition += 20;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Confirmation", 20, yPosition);
        
        yPosition += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Transaction ID: TXN-${Date.now()}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Payment Method: ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`, 20, yPosition);
        yPosition += 8;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 0);
        doc.text("Status: PAID", 20, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, yPosition);
        
        // Footer
        yPosition += 20;
        doc.setFontSize(8);
        doc.text("Thank you for your business!", 20, yPosition);
        yPosition += 5;
        doc.text("This is a demo invoice generated client-side.", 20, yPosition);
        
        // Save the PDF
        doc.save(`invoice-${invoiceNumber}.pdf`);
        
        showNotification('Invoice downloaded as PDF!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

// Print invoice
function printInvoice() {
    window.print();
    showNotification('Print dialog opened');
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'info' ? '#17a2b8' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Integration Notes for Real Payment Systems
/*
INTEGRATION NOTES FOR REAL PAYMENT SYSTEMS:

1. STRIPE INTEGRATION:
   - Replace the simulated payment with Stripe Checkout or Elements
   - Add Stripe.js script: <script src="https://js.stripe.com/v3/"></script>
   - Initialize Stripe with your publishable key
   - Create payment intent on your backend
   - Handle payment confirmation and webhooks

   Example Stripe integration:
   ```javascript
   const stripe = Stripe('pk_test_your_publishable_key');
   
   async function handleCheckout(e) {
       e.preventDefault();
       
       // Send cart data to your backend
       const response = await fetch('/create-payment-intent', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
               cart: cart, 
               customerData: customerData 
           })
       });
       
       const { clientSecret } = await response.json();
       
       // Confirm payment with Stripe
       const { error } = await stripe.confirmPayment({
           clientSecret,
           confirmParams: {
               return_url: window.location.origin + '/success'
           }
       });
   }
   ```

2. PAYPAL INTEGRATION:
   - Add PayPal SDK: <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
   - Create PayPal buttons for payment
   - Handle payment approval and capture

3. BACKEND REQUIREMENTS:
   - User authentication and session management
   - Product database with inventory tracking
   - Order management system
   - Payment processing endpoints
   - Email notifications
   - Invoice generation (server-side PDF creation)
   - Security measures (CSRF protection, input validation)

4. SECURITY CONSIDERATIONS:
   - Never store payment information on the client
   - Use HTTPS for all transactions
   - Validate all inputs on both client and server
   - Implement rate limiting
   - Use secure session management
   - Regular security audits

5. ADDITIONAL FEATURES TO IMPLEMENT:
   - User accounts and order history
   - Product search and filtering
   - Wishlist functionality
   - Product reviews and ratings
   - Inventory management
   - Admin dashboard
   - Analytics and reporting
   - Mobile app integration
   - Multi-language support
   - Currency conversion
   - Shipping calculations
   - Return and refund system

This demo provides a solid foundation for a real e-commerce application.
All the UI components and basic functionality are implemented and ready for backend integration.
*/
