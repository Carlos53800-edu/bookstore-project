let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const savedCart = sessionStorage.getItem('bookstoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    const cartViewButton = document.getElementById('view-cart');
    if (cartViewButton) {
        cartViewButton.addEventListener('click', showCart);
    }
});

function handleAddToCart(event) {
    const bookCard = event.target.closest('.book-card');
    const title = bookCard.querySelector('p:first-of-type').textContent;
    const priceText = bookCard.querySelector('p:nth-of-type(2)').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const image = bookCard.querySelector('img').src;

    const cartItem = {
        id: Date.now(),
        title,
        price,
        image,
        quantity: 1
    };

    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    sessionStorage.setItem('bookstoreCart', JSON.stringify(cart));
    updateCartDisplay();
    showAddToCartConfirmation(title);
}

function updateCartDisplay() {
    const cartLink = document.getElementById('view-cart');
    if (cartLink) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.textContent = `View Shopping Cart (${itemCount})`;
    }
}

function showAddToCartConfirmation(title) {
    const existingConfirmation = document.querySelector('.cart-confirmation');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }

    const confirmation = document.createElement('div');
    confirmation.className = 'cart-confirmation';
    confirmation.innerHTML = `
        <p>"${title}" has been added to your cart!</p>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(confirmation);

    setTimeout(() => {
        if (confirmation.parentElement) {
            confirmation.remove();
        }
    }, 3000);
}

function showCart(event) {
    event.preventDefault();
    
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    
    let cartContent = '<div class="cart-content">';
    cartContent += '<h2>Shopping Cart</h2>';
    cartContent += '<button class="close-cart" onclick="this.closest(\'.cart-modal\').remove()">✕</button>';
    
    if (cart.length === 0) {
        cartContent += '<p>Your cart is empty</p>';
    } else {
        cartContent += '<div class="cart-items">';
        cart.forEach(item => {
            cartContent += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" width="50">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">Remove</button>
                </div>
            `;
        });
        cartContent += '</div>';
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartContent += `
            <div class="cart-total">
                <h3>Total: $${total.toFixed(2)}</h3>
                <div class="cart-buttons">
                    <button onclick="clearCart()" class="clear-cart-button">Clear Cart</button>
                    <button onclick="checkout()" class="checkout-button">Process Order</button>
                </div>
            </div>
        `;
    }
    
    cartContent += '</div>';
    modal.innerHTML = cartContent;
    document.body.appendChild(modal);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    sessionStorage.setItem('bookstoreCart', JSON.stringify(cart));
    updateCartDisplay();
    
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.remove();
        showCart(new Event('click'));
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        sessionStorage.removeItem('bookstoreCart');
        updateCartDisplay();
        
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            cartModal.remove();
        }
        
        const confirmation = document.createElement('div');
        confirmation.className = 'cart-confirmation';
        confirmation.innerHTML = `
            <p>Your cart has been cleared!</p>
            <button onclick="this.parentElement.remove()">✕</button>
        `;
        document.body.appendChild(confirmation);

        setTimeout(() => {
            if (confirmation.parentElement) {
                confirmation.remove();
            }
        }, 3000);
    }
}

function checkout() {
    console.log('SessionStorage (before processing order):');
    console.log(JSON.parse(sessionStorage.getItem('bookstoreCart') || '[]'));

    const order = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    cart = [];
    sessionStorage.removeItem('bookstoreCart');
    updateCartDisplay();

    console.log('SessionStorage (after processing order):');
    console.log(JSON.parse(sessionStorage.getItem('bookstoreCart') || '[]'));

    alert('Thank you for your order!');

    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.remove();
    }
}