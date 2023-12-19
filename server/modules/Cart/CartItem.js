class CartItem {
    constructor(UUID, type, count = 1, settings = null) {
        this.UUID = UUID;
        this.CategoryType = type;
        this.Settings = settings;
        this.Count = count;
    }
}

module.exports = CartItem;