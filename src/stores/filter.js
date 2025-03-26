import { defineStore } from 'pinia'

export const filterStore = defineStore('filter', {
    state: () => ({ searchFilter: '' }),
    actions: {
        setSearchFilter(value) {
            this.searchFilter = value;
        }
    },
})