<template>
	<div class="about">
		<!-- <h1>This is an about page test</h1> -->
		<Toolbar>
			<template #start>
				<h2 class="mx-2">Favorites</h2>
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
						:value="searchFilter"
						@value-change="setSearchFilter"
					/>
				</IconField>
			</template>

			<!-- <template #center>
                <SplitButton label="Save" :model="items"></SplitButton>
            </template> -->
		</Toolbar>
		<br />
		<div class="col" v-for="item in filteredVideoInfo" :key="`${item.id}`">
			<Card class="card-style shadow-2">
				<template #title>
					<div class="grid">
						<div class="col">
							<a
								class="text-lg"
								@click="
									openVideoDialog(
										item.videoId,
										item.title,
										item.document_folder,
										item.document_name,
										item.is_document
									)
								"
							>
								{{ item.title }}
							</a>
							<br />
							<Chip
								class="text-xs px-2 py-1"
								:label="`${item.desc}`"
								v-if="item.desc"
							/>
						</div>
						<div class="col text-right">
							<!-- <SpeedDial :model="items" direction="left" style="
										position: absolute;
										top: calc(50% - 2rem);
										right: 0;
									" /> -->
							<i
								class="pi pi-heart-fill"
								style="font-size: 1.5rem"
								v-if="item.is_favorite"
								@click="
									item.is_favorite = !item.is_favorite;
									changeFavorite(item);
								"
							></i>
							<i
								class="pi pi-heart"
								style="font-size: 1.5rem"
								v-if="!item.is_favorite"
								@click="
									item.is_favorite = !item.is_favorite;
									changeFavorite(item);
								"
							></i>
						</div>
					</div>
				</template>
				<!-- <template #content>
                        <iframe width="590" height="300" :src="`https://www.youtube.com/embed/${item.videoId}`"
                            frameborder="0" allowfullscreen allow="picture-in-picture">
                        </iframe>
                    </template> -->
			</Card>
		</div>

		<Dialog
			v-model:visible="visible"
			maximizable
			modal
			:header="`${videoTitle}`"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
		>
			<div v-if="!this.isDocument">
				<iframe
					width=" 590"
					height="300"
					:src="`https://www.youtube.com/embed/${videoId}`"
					frameborder="0"
					allowfullscreen
					allow="picture-in-picture"
				>
				</iframe>
			</div>

			<div v-if="this.isDocument">
				<PDFViewer
					:source="documentURL"
					style="height: 75vh; width: 40vw"
					@download="handleDownload"
					settings="{defaultZoom: 65}"
					rendering-text="Please wait"
				/>
			</div>
		</Dialog>
	</div>
</template>

<style scoped>
.about {
	margin-top: 20px;
}

.card-style:hover {
	box-shadow: 0 7px 30px rgba(0, 0, 0, 0.08),
		0 22px 30px 2px rgba(0, 0, 0, 0.15), 0 8px 10px rgba(0, 0, 0, 0.15) !important;
}
</style>

<script>
import { defineComponent } from "vue";
// import { data1 } from '@/data.js'
import { mapActions, mapState } from "pinia";
import { filterStore } from "@/stores/filter";
import SpeedDial from "primevue/speeddial";
import { ref } from "vue";
import { supabase } from "@/config/supabaseClient";
import PDFViewer from "pdf-viewer-vue";

export default defineComponent({
	components: {
		SpeedDial,
		PDFViewer,
	},
	data() {
		return {
			visible: ref(false),
			videoId: "",
			videoTitle: "",
			documentFolder: "",
			documentName: "",
			isDocument: "",
			videoInfo: [],
			documentInfo: [],
			documentURL: "",
			// items: [
			//     {
			//         label: "Add",
			//         icon: "pi pi-pencil",
			//         command: () => {
			//             toast.add({
			//                 severity: "info",
			//                 summary: "Add",
			//                 detail: "Data Added",
			//                 life: 3000,
			//             });
			//         },
			//     },
			//     {
			//         label: "Update",
			//         icon: "pi pi-refresh",
			//         command: () => {
			//             toast.add({
			//                 severity: "success",
			//                 summary: "Update",
			//                 detail: "Data Updated",
			//                 life: 3000,
			//             });
			//         },
			//     },
			//     {
			//         label: "Delete",
			//         icon: "pi pi-trash",
			//         command: () => {
			//             toast.add({
			//                 severity: "error",
			//                 summary: "Delete",
			//                 detail: "Data Deleted",
			//                 life: 3000,
			//             });
			//         },
			//     },
			//     {
			//         label: "Upload",
			//         icon: "pi pi-upload",
			//         command: () => {
			//             router.push("/fileupload");
			//         },
			//     },
			//     {
			//         label: "Vue Website",
			//         icon: "pi pi-external-link",
			//         command: () => {
			//             window.location.href = "https://vuejs.org/";
			//         },
			//     },
			// ],
		};
	},
	methods: {
		...mapActions(filterStore, ["setSearchFilter"]),
		handleClick(id) {
			alert(id);
		},
		openVideoDialog(
			videoId,
			videoTitle,
			documentFolder,
			documentName,
			isDocument
		) {
			this.visible = true;
			this.videoId = videoId;
			this.videoTitle = videoTitle;
			if (isDocument) {
				this.documentFolder = documentFolder;
				this.documentName = documentName;
				this.isDocument = isDocument;

				const { data, error } = supabase.storage
					.from("application")
					.getPublicUrl(documentFolder + "/" + documentName);

				if (!error) {
					this.documentURL = data.publicUrl;
				} else {
					console.error("Error while fetching document URL", error);
				}
			}
		},
		async fetchData() {
			const { data, error } = await supabase
				.from("playlist")
				.select("*")
				.eq("is_favorite", true)
				.order("created_dttm", { ascending: false });
			if (error) {
				console.error("Error fetching data:", error);
			} else {
				this.videoInfo = data;
			}
		},
		async changeFavorite(item) {
			if (confirm("Are you sure want to remove from Favorite?")) {
				const { data, error } = await supabase
					.from("playlist")
					.update({
						is_favorite: !!item.is_favorite,
						updated_dttm: new Date(),
					})
					.eq("id", item.id);

				if (error) {
					console.error("Error fetching data:", error);
				} else {
					this.fetchData();
				}
			}
		},
	},
	computed: {
		...mapState(filterStore, ["searchFilter"]),
		filteredVideoInfo: function () {
			return this.videoInfo.length !== 0
				? this.videoInfo.filter((video) => {
						return video.title
							.toLowerCase()
							.match(this.searchFilter.toLowerCase());
				  })
				: null;
		},
	},
	mounted() {
		this.fetchData();
	},
});
</script>