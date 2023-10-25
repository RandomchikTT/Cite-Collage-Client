<template>
	<Notification/>
	<router-view/>
</template>
<script>
import Notification from './views/Notify/Notify.vue'
export default {
	components: {
		Notification
	}
}
</script>