# Carty
Simple shopping cart for website



# modules&#x2F;cart

* * *

## Class: Cart
Cart constructor

### modules&#x2F;cart.Cart.addToCart(id, name, price) 

Add new item to cart or increase amout of existing one

**Parameters**

**id**: `String`, ID

**name**: `String`, Item name

**price**: `Number`, Item price


### modules&#x2F;cart.Cart.removeFromCart(id) 

Remove item from cart

**Parameters**

**id**: `Number`, Item id


### modules&#x2F;cart.Cart.decreaseItemAmount(id) 

Decrease amout of item in cart
or completely delete it

**Parameters**

**id**: `Number`, Item id


### modules&#x2F;cart.Cart.getItems() 

Get Cart items

**Returns**: `Array`, Cart items

### modules&#x2F;cart.Cart.getItemsCount() 

Calculate total cost of cart's items

**Returns**: `String`, Generated template

### modules&#x2F;cart.Cart.showWindow() 

Show Cart modal

### modules&#x2F;cart.Cart.init() 

Cart initialization

### modules&#x2F;cart.Cart.Cart() 

Cart constructor

* * *
