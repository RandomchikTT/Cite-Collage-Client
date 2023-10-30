<template>
	<Notification/>
	<router-view/>
</template>
<script>
import Notification from './views/Notification/Notification.vue'
export default {
	components: {
		Notification
	}
}
</script>