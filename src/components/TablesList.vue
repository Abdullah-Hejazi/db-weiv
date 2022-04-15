<script>

import CreateTableDialog from '@/components/CreateTableDialog'

export default {
    name: 'TablesList',

    components: {
        CreateTableDialog
    },

    data () {
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
                            label: 'Export',
                            icon: 'pi pi-download'
                        },
                        {
                            label: 'Import',
                            icon: 'pi pi-upload'
                        }
                    ]
                }
            ],

            createTableDialog: true
        }
    },

    props: [
        'database',
        'data',
        'refresh',
        'create',
        'sql',
        'export',
        'import'
    ],

    methods: {
        toggle () {
            this.$refs.menu.toggle(event);
        },

        closeCreateTableDialog() {
            this.createTableDialog = false
        }
    }
}
</script>

<template>
    <div>
        <Panel :header="database">
            <template #icons>
                <Button class="p-panel-header-icon p-link mr-2" @click="toggle">
                    <span class="pi pi-cog"></span>
                </Button>
                <Menu id="config_menu" ref="menu" :model="items" :popup="true"></Menu>
            </template>

            <ScrollPanel class="w-full scroll-menu" v-if="data.length > 0">
                <Menu :model="data" class="w-full" />
            </ScrollPanel>

            <div v-if="data.length == 0" class="text-center">
                <span class="pi pi-exclamation-circle"></span>
                No tables or views found.
            </div>
        </Panel>

        <Dialog class="create-table-modal" header="Create Table" v-model:visible="createTableDialog" :modal="true">
            <CreateTableDialog :finish="closeCreateTableDialog" />
        </Dialog>
    </div>
</template>

<style>
.scroll-menu {
    height: calc(100vh - 280px);
}

.create-table-modal {
    width: 650px;
    max-width: 95vw;
}
</style>