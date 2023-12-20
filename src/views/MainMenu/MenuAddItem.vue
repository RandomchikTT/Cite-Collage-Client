<template>
    <div style="z-index: 1000; position: relative;">
        <div class="show">
            <div class="popup-fade"></div>
            <div class="popup-padding">
                <div class="popup-inner">
                    <i class="svg-icon">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84606 12.4986L0.552631 3.20519C-0.1806 2.47196 -0.1806 1.28315 0.552631 0.549923C1.28586 -0.183308 2.47466 -0.183308 3.20789 0.549923L12.5013 9.84335L21.792 0.552631C22.5253 -0.1806 23.7141 -0.1806 24.4473 0.552631C25.1805 1.28586 25.1805 2.47466 24.4473 3.20789L15.1566 12.4986L24.45 21.792C25.1832 22.5253 25.1832 23.7141 24.45 24.4473C23.7168 25.1805 22.528 25.1805 21.7947 24.4473L12.5013 15.1539L3.20519 24.45C2.47196 25.1832 1.28315 25.1832 0.549923 24.45C-0.183308 23.7168 -0.183308 22.528 0.549923 21.7947L9.84606 12.4986Z" fill="white"></path>
                        </svg>
                    </i>
                    <section class="item__section">
                        <picture class="picture__item">
                            <source src="">
                        </picture>
                        <main class="data__item">
                            <div class="info">
                                <button class="info__button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20a8 8 0 100-16 8 8 0 000 16zm0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#000"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 11a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1z" fill="#000"></path><path d="M13.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="#000"></path></svg>
                                </button>
                            </div>
                            <h1 class="title">Додстер</h1>
                            <span class="size">299 руб.</span>
                            <span class="description">
                                Легендарная горячая закуска с цыплёнком, томатами, моцареллой, соусом ранч в тонкой пшеничной лепешке
                            </span>
                        </main>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: [ 'selectedItem' ]
}
</script>

<style lang="scss" scoped>
.item__section {
    display: flex;
    .picture__item {
        width: 292px;
        margin: 48px;
        align-self: flex-start;
        width: 100%;
        position: relative;
        display: flex;
        user-select: none;
        image-rendering: auto;
        flex-flow: column;
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
        width: 324px;
        margin: 32px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 14px;
        line-height: 20px;
        display: flex;
        flex-flow: column;
    }
    .info {
        position: absolute;
        top: 32px;
        right: 32px;
        position: relative;
        width: 24px;
        height: 24px;
        z-index: 3;
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
    padding: 24px;
    display: flex;
    flex-flow: column;
    min-height: 100%;
    content: " ";
    display: block;
    width: 100%;
    flex: 1 1 auto;
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
    opacity: 0.7;
    position: fixed;
    inset: 0px;
    background: rgb(0, 0, 0);
    opacity: 0;
    transition: opacity 150ms ease 0s;
}
</style>