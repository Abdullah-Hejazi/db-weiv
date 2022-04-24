<script>

import CreateTableDialog from '@/components/CreateTableDialog'
import ImportDialog from '@/components/ImportDialog.vue'

export default {
    name: 'TablesList',

    components: {
    CreateTableDialog,
    ImportDialog
},

    data() {
        return {
            items: [
                {
                    label: 'General',
                    items: [
                        {
                            label: 'Refresh Tables',
                            icon: 'pi pi-refresh',
                            command: this.refresh
                        }
                    ]
                },
                {
                    label: 'Control',
                    items: [
                        {
                            label: 'Create Table',
                            icon: 'pi pi-plus',
                            command: () => {
                                this.createTableDialog = true
                            }
                        },
                        {
                            label: 'SQL Editor',
                            icon: 'pi pi-hashtag'
                        },
                        {
                            label: 'Import',
                            icon: 'pi pi-upload',
                            command: () => this.importDialog = true
                        },
                        {
                            label: 'Export',
                            icon: 'pi pi-download'
                        },
                        {
                            label: 'Settings',
                            icon: 'pi pi-cog'
                        }
                    ]
                }
            ],

            createTableDialog: false,
            importDialog: false
        }
    },

    props: [
        'database',
        'data',
        'refresh',
        'create',
        'sql',
        'export',
        'import',
        'engines',
        'load'
    ],

    methods: {
        ToggleMenu() {
            this.$refs.menu.toggle(event);
        },

        FinishTableCreation() {
            this.refresh()
            this.createTableDialog = false
        },

        LoadTable(table) {
            for(let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data[i].items?.length; j++) {
                    this.data[i].items[j].selected = false
                }
            }

            table.selected = true

            this.load(table.label)
        },

        async ImportData() {
            
        }
    }
}
</script>

<template>
    <div>
        <Panel :header="database">
            <template #icons>
                <Button class="p-panel-header-icon p-link mr-2" @click="ToggleMenu">
                    <span class="pi pi-cog"></span>
                </Button>
                <Menu id="config_menu" ref="menu" :model="items" :popup="true"></Menu>
            </template>

            <ScrollPanel class="w-full scroll-menu" v-if="data.length > 0">
                <Menu :model="data" class="w-full">
                    <template #item="{ item }">
                        <div :class="'p-menuitem-link pl-4 ' + (item.selected ? 'text-primary' : 'text-700')" v-if="! item.items" @click="LoadTable(item)">
                            <span class="pi pi-angle-right mt-1 mr-2" />
                            {{ item.label }}
                        </div>
                    </template>
                </Menu>
            </ScrollPanel>

            <div v-if="data.length == 0" class="text-center py-5">
                <span class="pi pi-exclamation-circle"></span>
                No tables or views found.
            </div>
        </Panel>

        <Dialog class="create-table-modal" header="Create Table" v-model:visible="createTableDialog" :modal="true">
            <CreateTableDialog :finish="FinishTableCreation" :engines="engines" />
        </Dialog>

        <ImportDialog :visible="importDialog" @visibilityChange="val => importDialog = val" />
    </div>
</template>

<style>
.create-table-modal {
    width: 650px;
    max-width: 95vw;
}
</style>