<script>

export default {
    name: 'TableData',

    data() {
        return {
            items: [
                {
                    label: 'Table',
                    icon: 'pi pi-table',
                },
                {
                    label: 'Structure',
                    icon: 'pi pi-database',
                }
            ]
        }
    },

    props: [
        'table',
    ],

    methods: {
    }
}
</script>

<template>
    <div>
        <Panel>
            <template #header>
                <Menubar :model="items" />
            </template>

            <template #icons>
                <Button class="p-panel-header-icon p-link mr-2">
                    <span class="pi pi-cog"></span>
                </Button>
            </template>

            <ScrollPanel class="w-full scroll-menu" v-if="table">
                
            </ScrollPanel>
        </Panel>
    </div>
</template>
