class Order {
    constructor(address, cartItems, uuidUser, price, typePay) {
        this.Address = address;
        this.CartItems = cartItems;
        this.UserUUID = uuidUser;
        this.Price = price;
        this.TypePay = typePay;
    }
}