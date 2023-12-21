<template>
    <div style="z-index: 9999999; position: relative;">
        <div class="show">
            <div class="popup-fade" style="opacity: 0.7;"></div>
            <div class="popup-padding">
                <div class="popup-inner">
                    <i class="svg-icon" @click="closeMenu">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84606 12.4986L0.552631 3.20519C-0.1806 2.47196 -0.1806 1.28315 0.552631 0.549923C1.28586 -0.183308 2.47466 -0.183308 3.20789 0.549923L12.5013 9.84335L21.792 0.552631C22.5253 -0.1806 23.7141 -0.1806 24.4473 0.552631C25.1805 1.28586 25.1805 2.47466 24.4473 3.20789L15.1566 12.4986L24.45 21.792C25.1832 22.5253 25.1832 23.7141 24.45 24.4473C23.7168 25.1805 22.528 25.1805 21.7947 24.4473L12.5013 15.1539L3.20519 24.45C2.47196 25.1832 1.28315 25.1832 0.549923 24.45C-0.183308 23.7168 -0.183308 22.528 0.549923 21.7947L9.84606 12.4986Z" fill="white"></path>
                        </svg>
                    </i>
                    <section class="item__section">
                        <picture class="picture__item">
                            <img :src="`./assets/images/${selectedItem.Cattegory}/${selectedItem.Image}.png`">
                        </picture>
                        <main class="data__item">
                            <div class="info__item" style="position: absolute;">
                                <button class="info__button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20a8 8 0 100-16 8 8 0 000 16zm0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#000"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 11a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z" fill="#000"></path><path d="M13.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="#000"></path></svg>
                                </button>
                            </div>
                            <h1 class="title">{{ selectedItem.Name }}</h1>
                            <span class="size">{{ $methods.getItemPrice(selectedItem) }}</span>
                            <span class="description">
                                {{ selectedItem.Description }}
                            </span>
                            <div class="selector-all" v-if="selectedItem.Cattegory == 'Pizza'">
                                <div class="selector" v-for="(item, key) in pizzaData" :key="key">
                                    <template v-for="(itemI, keyI) in item" :key="keyI">
                                        <input type="radio" class="input__radio__selector" :id="`select_pizza_size_${keyI}`">
                                        <label class="label__selector"
                                            :class="{ 'active': itemI.State }"
                                            :for="`select_pizza_size_${keyI}`"
                                            @click="selectCattegoryParam(key, keyI)">
                                            {{ itemI.Name }}
                                        </label>
                                    </template>
                                </div>
                            </div>
                            <button class="button_add_in_cart" @click="addItemInCart">
                                Добавить в корзину за
                                <span class="money__value">
                                    {{ getPrice }}
                                </span>
                                <span class="money__currency money__currency_on-the-right">
                                    руб.
                                </span>
                            </button>
                        </main>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const sizePizzaWithOutThinTest = [25];4
import host from '../../AxiosMethods/index.js'
export default {
    data() {
        return {
            pizzaData: {
                selectPizzaSize: {
                    25: {
                        Name: "Маленькая",
                        State: true
                    },
                    30: {
                        Name: "Средняя",
                        State: false
                    },
                    35: {
                        Name: "Большая",
                        State: false
                    }
                },
                selectPizzaTypeTesto: {
                    "Thin": {
                        Name: "Тонкое",
                        State: false,
                    },
                    "Default": {
                        Name: "Традиционное",
                        State: true,
                    },
                }
            }
        }
    },
    computed: {
        getDataPizza() {
            const pizzaDataSelected = {
                selectPizzaSize: null,
                selectPizzaTypeTesto: null,
            }
            for (let key in this.pizzaData) {  
                for (let keyI in this.pizzaData[key]) {
                    if (this.pizzaData[key][keyI].State) {
                        pizzaDataSelected[key] = keyI;
                    }
                }
            }
            return pizzaDataSelected;
        },
        getPrice() {
            if (this.selectedItem.Cattegory == "Pizza") {
                const pizzaDataSelected = this.getDataPizza;
                const priceData = this.selectedItem.Price.find(_ => _.Size == pizzaDataSelected.selectPizzaSize);
                const price = priceData.TypeDough[pizzaDataSelected.selectPizzaTypeTesto].Price;
                return price;
            }
            return this.selectedItem.Price;
        }
    },
    props: [ 'selectedItem', 'closeMenu' ],
    methods: {
        selectCattegoryParam(key, name) {
            if (key == "selectPizzaTypeTesto" && sizePizzaWithOutThinTest.indexOf(Number(this.getDataPizza.selectPizzaSize)) !== -1) {
                return;
            }
            for (let nameParams in this.pizzaData[key]) {
                if (key == "selectPizzaSize" && sizePizzaWithOutThinTest.indexOf(name) === -1) {
                    for (let keyV in this.pizzaData.selectPizzaTypeTesto) {
                        this.pizzaData.selectPizzaTypeTesto[keyV].State = keyV == "Default"
                    }
                }
                this.pizzaData[key][nameParams].State = nameParams == name;
            }
        },
        async addItemInCart() {
			const cattegoryType = this.selectedItem.Cattegory;
			const uuidItem = this.selectedItem.UUID;
			if (!this.$store.state.loggedUser) {
				this.emitter.emit("Notify:Push", {
					Title: "Ошибка",
					Message: "Вы не вошли в аккаунт !",
					Time: 2500
				});
				return;
			}
			switch (cattegoryType) {
				case "Pizza":
                    const result = await host.get("AddItemInCart", {
				        params: {
                            CattegoryType: cattegoryType,
                            ItemUUID: uuidItem,
                            Login: this.$store.state.loggedUser.Login,
                            PhoneNumber: this.$store.state.loggedUser.PhoneNumber,
                            ItemData: {
                                Size: Number(this.getDataPizza.selectPizzaSize),
                                TypeDough: String(this.getDataPizza.selectPizzaTypeTesto)
                            }
                        }
                    });
                    if (result && result.data) {
                        const response = result.data;
                        switch (response.Result) {
                            case "Success":
                                this.$store.commit("setLoggedUserCartItems", response.CartList);
                                break;
                        }
                        this.emitter.emit("Notify:Push", {
                            Title: response.Result == "Error" ? "Ошибка" : "Успешно",
                            Message: response.Notify,
                            Time: 2500
                        });
                    }
                    this.closeMenu();
					return;
				case "Snack":
				case "Drink":
				case "Coctail":
				case "Coffee":
				case "Dessert":
				case "Souse":
					break;
			}
			const result = await host.get("AddItemInCart", {
				params: {
					CattegoryType: cattegoryType,
					ItemUUID: uuidItem,
					Login: this.$store.state.loggedUser.Login,
					PhoneNumber: this.$store.state.loggedUser.PhoneNumber,
				}
			});
			if (result && result.data) {
				const response = result.data;
				switch (response.Result) {
					case "Success":
						this.$store.commit("setLoggedUserCartItems", response.CartList);
						break;
				}
				this.emitter.emit("Notify:Push", {
					Title: response.Result == "Error" ? "Ошибка" : "Успешно",
					Message: response.Notify,
					Time: 2500
				});
			}
            this.closeMenu();
		},
    }
}
</script>

<style lang="scss">
.show {
    position: fixed;
    inset: 0px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    z-index: 1000;
    overflow: auto;
}
.selector-all {
    position: relative;
    .selector {
        border-radius: 9999px;
        background-color: rgb(243, 243, 247);
        height: 32px;
        display: flex;
        position: relative;
        overflow: hidden;
        margin: 8px 0px;
        transform: translateZ(0px);
        .input__radio__selector {
            position: absolute;
            display: none;
        }
        .label__selector {
            display: block;
            flex: 1 1 0%;
            position: relative;
            cursor: pointer;
            user-select: none;
            border-radius: 9999px;
            color: rgb(0, 0, 0);
            font-size: 12px;
            line-height: 32px;
            font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: normal;
            text-align: center;
            height: 32px;
            transition: color 150ms ease 0s;
            &.active {
                background-color: white;
            }
        }
    }
}
.info__item {
    top: 32px;
    right: 32px;
    position: relative;
    width: 24px;
    height: 24px;
    z-index: 3;
}
.item__section {
    display: flex;
    height: 25vw;
    .picture__item {
        width: 20vw;
        margin: 48px;
        align-self: flex-start;
        position: relative;
        display: flex;
        user-select: none;
        image-rendering: auto;
        flex-flow: column;
        &img {
            width: 100%;
            object-fit: contain;
        }
    }
    .money__currency_on-the-right {
        margin-left: -2px;
    }
    .money__currency {
        font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 500;
    }
    .money__value {
        font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 500;
    }
    .button_add_in_cart {
        height: 3vw;
        padding: 12px 24px;
        font-size: 16px;
        line-height: 24px;
        background-color: rgb(255, 105, 0);
        color: rgb(255, 255, 255);
        flex: 0 0 auto;
        width: 100%;
        outline: none;
        border: none;
        border-radius: 9999px;
        text-align: center;
        font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 500;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        transition-property: background-color, color;
        transition-duration: 200ms;
        transition-timing-function: ease-out;
    }
    .description {
        color: rgb(0, 0, 0);
        margin-bottom: 32px;
        flex: 1 1 auto;
    }
    .title {
        font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 24px;
        line-height: 28px;
        font-weight: 500;
        color: rgb(0, 0, 0);
        margin: 0px;
        flex: 0 0 auto;
        padding-right: 32px;
    }
    .fPnQAA .size {
        margin: 4px 0px;
        color: rgb(92, 99, 112);
        flex: 0 0 auto;
    }
    .data__item {
        width: 20vw;
        margin: 32px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 14px;
        line-height: 20px;
        display: flex;
        flex-flow: column;
    }
    .info__button {
        margin: 0px;
        padding: 0px;
        background: none;
        border: none;
        font: inherit;
        cursor: pointer;
        outline: none;
    }
}
.popup-padding {
    content: " ";
    display: block;
    width: 100%;
    flex: 1 1 auto;
    padding: 24px;
    display: flex;
    margin-top: 25vmin;
    margin-left: 50vh;
}
.svg-icon {
    position: absolute;
    top: 13px;
    right: -38px;
    cursor: pointer;
    transition: transform 0.1s ease-in-out 0s;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    font-size: 0px;
    line-height: 0;
    font-style: normal;
}
.popup-inner {
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 30px 60px;
    box-sizing: border-box;
    opacity: 0;
    transform: scale(0.96);
    background: rgb(255, 255, 255);
    border-radius: 20px;
    transition: opacity 150ms ease 0s, transform;
    flex: 0 0 auto;
    opacity: 1;
    transform: scale(1);
}
.popup-fade {
    position: fixed;
    inset: 0px;
    background: rgb(0, 0, 0);
    opacity: 0;
    transition: opacity 150ms ease 0s;
}
</style>