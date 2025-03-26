<template>
    <Menubar :model="items" class="navigation">
        <template #start>
            <!-- <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">
                <path d="..." fill="var(--p-primary-color)" />
                <path d="..." fill="var(--p-text-color)" />
            </svg> -->
            <h2>PRITI SONI</h2>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
            <a v-ripple class="flex items-center" v-bind="props.action">
                <span>{{ item.label }}</span>
                <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                <span v-if="item.shortcut"
                    class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                    item.shortcut }}</span>
                <i v-if="hasSubmenu"
                    :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
            </a>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <InputText placeholder="Search" :value="searchFilter" @value-change="setSearchFilter" type="text"
                    class="md:w-30rem sm:w-auto" />
                <!-- <Avatar image="/images/avatar/amyelsner.png" shape="circle" /> -->
            </div>
        </template>
    </Menubar>
</template>

<script>
import { defineComponent } from 'vue'
import { filterStore } from '@/stores/filter';
import { mapActions, mapState } from 'pinia';

export default defineComponent({
    data() {
        return {
            // items: [
            //     {
            //         label: 'Home',
            //         icon: 'pi pi-home'
            //     },
            //     {
            //         label: 'Projects',
            //         icon: 'pi pi-search',
            //         badge: 3,
            //         items: [
            //             {
            //                 label: 'Core',
            //                 icon: 'pi pi-bolt',
            //                 shortcut: '⌘+S'
            //             },
            //             {
            //                 label: 'Blocks',
            //                 icon: 'pi pi-server',
            //                 shortcut: '⌘+B'
            //             },
            //             {
            //                 separator: true
            //             },
            //             {
            //                 label: 'UI Kit',
            //                 icon: 'pi pi-pencil',
            //                 shortcut: '⌘+U'
            //             }
            //         ]
            //     }
            // ]
        }
    },
    computed: {
        ...mapState(filterStore, ['searchFilter'])
    },
    methods: {
        ...mapActions(filterStore, ['setSearchFilter'])
    }
})
</script>

<style scoped>
.navigation {
    max-width: 100vw !important;
    width: 100vw !important;
}
</style>