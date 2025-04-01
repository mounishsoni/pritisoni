<!-- <script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script> -->

<template>
	<main>
		<!-- <TheWelcome /> -->
		<!-- <PDFViewer
			:source="`https://rmecigapcpjpvuoiwocg.supabase.co/storage/v1/object/sign/application/saundarya-lehri.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcHBsaWNhdGlvbi9zYXVuZGFyeWEtbGVocmkucGRmIiwiaWF0IjoxNzQzMzA1NjI0LCJleHAiOjE3NDM5MTA0MjR9.sJzHV-SG7Wa9eXMSONEt2fJatlsS8J68JCMTWBmeNfI`"
			style="height: 50vh; width: 50vw" @download="handleDownload" settings="{defaultZoom: 65}"
			rendering-text="Please wait" /> -->
		<div style="margin: auto 20px">
			<br />
			<Toolbar>
				<template #start>
					<h2 class="mx-2">Collections</h2>
					<!-- <Button icon="pi pi-plus" class="mr-2" severity="secondary" /> -->
					<Button
						icon="pi pi-refresh"
						@click="fetchData"
						class="mr-2"
						severity="secondary"
						v-tooltip.top="'Refresh'"
					/>
				</template>

				<template #end>
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

				<!-- <template #center>
					<SplitButton label="Save" :model="items"></SplitButton>
				</template> -->
			</Toolbar>
			<br />
			<div class="grid">
				<div
					class="col-12 md:col-6 lg:col-4"
					v-for="item in filteredCollectionData"
					:key="item.id"
				>
					<Card class="card-style shadow-2">
						<template #header>
							<!-- <img alt="user header" src="/images/usercard.png" /> -->
						</template>
						<template #title>{{ item.title }}</template>
						<template #subtitle>
							<Chip
								class="text-xs px-2 py-1"
								:label="`${item.sub_title}`"
								v-if="item.sub_title"
							/>
						</template>
						<template #content>
							{{ item.description }}
						</template>
						<template #footer>
							<div class="flex gap-4 mt-1">
								<Button
									label="Learn more"
									severity="secondary"
									outlined
									class="w-full"
									@click="goToLink(item.url)"
									v-if="item.url"
								/>
								<Button
									label="Explore"
									class="w-full"
									@click="goToNextPage(item.id)"
								/>
							</div>
						</template>
					</Card>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped>
.card-style:hover {
	box-shadow: 0 7px 30px rgba(0, 0, 0, 0.08),
		0 22px 30px 2px rgba(0, 0, 0, 0.15), 0 8px 10px rgba(0, 0, 0, 0.15) !important;
}
</style>

<script>
import { supabase } from "@/config/supabaseClient";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { filterStore } from "@/stores/filter";
import { mapActions, mapState } from "pinia";
// import PDFViewer from 'pdf-viewer-vue'

export default {
	// components: { PDFViewer },
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
				.select("*")
				.order("title", { ascending: true });

			if (error) {
				console.error("Error fetching data:", error);
			} else {
				this.data = data;
			}
		},
		goToLink(url) {
			window.open(url, "_blank");
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