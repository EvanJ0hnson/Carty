# Carty
Simple shopping cart for a website

*(v0.1, Work in progress)*

# modules/cart

## Class: Cart
Cart constructor

### modules/cart.Cart.addToCart(id, name, price) 
Add new item to cart or increase amout of existing one

**Parameters**

**id**: `String`, ID

**name**: `String`, Item name

**price**: `Number`, Item price

### modules/cart.Cart.removeFromCart(id) 
Remove item from cart

**Parameters**

**id**: `Number`, Item id

### modules/cart.Cart.decreaseItemAmount(id) 
Decrease amout of item in cart or completely delete it

**Parameters**

**id**: `Number`, Item id

### modules/cart.Cart.getItems() 
Get Cart items

**Returns**: `Array`, Cart items

### modules/cart.Cart.getItemsCount() 
Calculate total cost of cart's items

**Returns**: `String`, Generated template

### modules/cart.Cart.showWindow() 
Show Cart modal

### modules/cart.Cart.init() 
Cart initialization

### modules/cart.Cart.Cart() 
Cart constructor
