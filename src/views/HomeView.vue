<!-- <script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script> -->

<template>
	<main>
		<!-- <TheWelcome /> -->
		<div>
			<br />
			<Toolbar>
				<template #start>
					<Button
						icon="pi pi-plus"
						class="mr-2"
						severity="secondary"
					/>
					<Button
						icon="pi pi-refresh"
						@click="fetchData"
						class="mr-2"
						severity="secondary"
					/>
				</template>

				<template #center>
					<IconField>
						<InputIcon>
							<i class="pi pi-search" />
						</InputIcon>
						<InputText
							placeholder="Search"
							:value="collectionSF"
							@value-change="setCollectionSF"
						/>
					</IconField>
				</template>

				<template #end>
					<SplitButton label="Save" :model="items"></SplitButton
				></template>
			</Toolbar>
			<br />
			<div v-for="item in filteredCollectionData" :key="item.id">
				<Card style="width: 25rem; overflow: hidden">
					<template #header>
						<!-- <img alt="user header" src="/images/usercard.png" /> -->
					</template>
					<template #title>{{ item.title }}</template>
					<template #subtitle>{{ item.description }}</template>
					<template #content>
						<p class="m-0">
							Explore all Shiv Yog Forum Episodes. Click Learn
							more to learn about what is Shiv Yog?
						</p>
					</template>
					<template #footer>
						<div class="flex gap-4 mt-1">
							<Button
								label="Learn more"
								severity="secondary"
								outlined
								class="w-full"
								@click="goToLink()"
							/>
							<Button
								label="Episodes"
								class="w-full"
								@click="goToNextPage(item.id)"
							/>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</main>
</template>

    <script>
import { supabase } from "@/config/supabaseClient";
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { filterStore } from "@/stores/filter";
import { mapActions, mapState } from "pinia";

watchEffect(async () => {
	const { collectionData, error } = await supabase
		.from("collection")
		.select("*");

	if (error) {
		console.error("Error fetching data:", error);
	} else {
		this.data = collectionData;
	}
});
export default {
	data() {
		return {
			data: [],
			router: useRouter(),
			items: ref([
				{
					label: "Update",
					icon: "pi pi-refresh",
				},
				{
					label: "Delete",
					icon: "pi pi-times",
				},
			]),
		};
	},
	methods: {
		...mapActions(filterStore, ["setCollectionSF"]),
		async fetchData() {
			const { data, error } = await supabase
				.from("collection")
				.select("*");

			if (error) {
				console.error("Error fetching data:", error);
			} else {
				this.data = data;
			}
		},
		goToLink() {
			window.open("https://shivyog.com/what-is-shivyog/", "_blank");
		},
		goToNextPage(collectionId) {
			this.router.push({ path: "/about", query: { q: collectionId } });
		},
	},
	computed: {
		...mapState(filterStore, ["collectionSF"]),
		filteredCollectionData: function () {
			return this.data.filter((collection) => {
				return collection.title
					.toLowerCase()
					.match(this.collectionSF.toLowerCase());
			});
		},
	},
    mounted() {
        this.fetchData();
    },
};
</script>