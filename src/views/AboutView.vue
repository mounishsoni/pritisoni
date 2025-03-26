<template>
    <div class="about">
        <!-- <h1>This is an about page test</h1> -->

        <div>
            <div class="col" v-for="item in filteredVideoInfo" :key="`${item.id}`">
                <Card class="card-style shadow-4">
                    <template #title>
                        <div class="grid">
                            <div class="col">
                                <a class="text-lg" @click="openVideoDialog(item.videoId);">
                                    {{ item.title }}
                                </a>
                                <br />
                                <Chip class="text-xs px-2 py-1" :label="`${item.desc}`" v-if="item.desc" />
                            </div>
                            <div class="col text-right" @click="item.favorite = !item.favorite">
                                <SpeedDial :model="items" direction="left"
                                    style="position: absolute; top: calc(50% - 2rem); right: 0" />
                                <i class="pi pi-heart-fill" style="font-size: 1.5rem" v-if="item.favorite"></i>
                                <i class="pi pi-heart" style="font-size: 1.5rem" v-if="!item.favorite"></i>
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
        </div>

        <Dialog v-model:visible="visible" maximizable modal header="Header" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <iframe width="590" height="300" :src="`https://www.youtube.com/embed/${videoId}`" frameborder="0"
                allowfullscreen allow="picture-in-picture">
            </iframe>
        </Dialog>

    </div>
</template>

<style scoped>
.about {
    margin-top: 20px;
}

.card-style:hover {
    box-shadow: 0 7px 30px rgba(0, 0, 0, .08), 0 22px 30px 2px rgba(0, 0, 0, .15), 0 8px 10px rgba(0, 0, 0, .15) !important;
}
</style>

<script>
import { defineComponent } from 'vue'
import { data1 } from '@/data.js'
import { mapState } from 'pinia';
import { filterStore } from '@/stores/filter';
import SpeedDial from 'primevue/speeddial';
import { ref } from "vue";

export default defineComponent({
    components: {
        SpeedDial
    },
    data() {
        return {
            visible: ref(false),
            videoId: "",
            videoInfo: data1,
            items: ([
                {
                    label: 'Add',
                    icon: 'pi pi-pencil',
                    command: () => {
                        toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added', life: 3000 });
                    }
                },
                {
                    label: 'Update',
                    icon: 'pi pi-refresh',
                    command: () => {
                        toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated', life: 3000 });
                    }
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    command: () => {
                        toast.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                    }
                },
                {
                    label: 'Upload',
                    icon: 'pi pi-upload',
                    command: () => {
                        router.push('/fileupload');
                    }
                },
                {
                    label: 'Vue Website',
                    icon: 'pi pi-external-link',
                    command: () => {
                        window.location.href = 'https://vuejs.org/'
                    }
                }
            ])
        }
    },
    methods: {
        handleClick(id) {
            alert(id);
        },
        openVideoDialog(videoId) {
            this.visible = true;
            this.videoId = videoId;
        }
    },
    computed: {
        ...mapState(filterStore, ['searchFilter']),
        filteredVideoInfo: function () {
            return this.videoInfo.filter((video) => {
                return video.title.toLowerCase().match(this.searchFilter.toLowerCase());
            });
        }
    },
})
</script>