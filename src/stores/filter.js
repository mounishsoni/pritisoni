import { defineStore } from 'pinia'

export const filterStore = defineStore('filter', {
    state: () => ({ searchFilter: '', collectionSF: '' }),
    actions: {
        setSearchFilter(value) {
            this.searchFilter = value;
        },
        setCollectionSF(value) {
            this.collectionSF = value;
        }
    },
})