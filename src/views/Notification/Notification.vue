<template>
    <div class="notifications">
        <div class="notification" v-for="(notify, index) in getNotifyList" :key="index" @click="deleteNotify(notify.ID)">
            <div>{{ notify.Title }}</div>
            <div>{{ notify.Message }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notifyList: []
        }
    },
    computed: {
        getNotifyList() {
            return this.notifyList;
        }
    },
    methods: {
        pushNotify(obj) {
            const { Title, Message, Time } = obj;
            if (this.notifyList.length >= 5) {
                const timeout = this.notifyList[0].TimeOut;
                if (timeout != null) {
                    clearInterval(timeout);
                }
                this.notifyList.splice(0, 1);
            }
            const uid = this.generateUID();
            let timeout = setTimeout(() => {
                const findIndex = this.notifyList.findIndex(_ => _.ID == uid);
                if (findIndex !== -1) {
                    this.notifyList.splice(findIndex, 1);
                }
                timeout = null;
            }, Time);
            this.notifyList.push({
                Message: Message,
                Title: Title,
                TimeOut: timeout,
                ID: uid
            });
        },
        deleteNotify(uid) {
            const findIndex = this.notifyList.findIndex(_ => _.ID == uid);
            if (findIndex !== -1) {
                const timeout = this.notifyList[findIndex];
                if (timeout != null) {
                    clearTimeout(timeout);
                }
                this.notifyList.splice(findIndex, 1);
            }
        },
        generateUID() {
            let id = 0;
            do {
                id++;
            }
            while (this.notifyList.findIndex(_ => _.ID == id) !== -1);
            return id;
        }
    },
    created() {
        this.emitter.on("Notify:Push", this.pushNotify);
    }
}
</script>

<style lang="scss" scoped>
.notifications {
    position: fixed;
    right: 28px;
    bottom: 15px;
    z-index: 99999999;
    .notification {
        background: rgb(55, 53, 53);
        opacity: 0.95;
        border-radius: 10px;
        padding: 15px 20px;
        color: white;
        font-family: Dodo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 10px;
        min-width: 250px;
        transition-property: opacity, transform, margin;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
    }
}
</style>