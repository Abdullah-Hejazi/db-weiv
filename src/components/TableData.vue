<script>import M from "minimatch"


export default {
    name: 'TableData',

    data() {
        return {
            items: [
                {
                    label: 'Table',
                    icon: 'pi pi-table',
                    command: this.LoadTable
                },
                {
                    label: 'Structure',
                    icon: 'pi pi-database',
                    command: this.LoadStructure
                }
            ],

            activeIndex: 0
        }
    },

    props: [
        'table',
    ],

    mounted () {
        this.LoadTable()
    },

    methods : {
        LoadTable() {
            this.activeIndex = 0
            this.$router.push('/databases/' + this.$route.params.database + '/' + this.table)
        },

        LoadStructure() {
            this.activeIndex = 1
            this.$router.push('/databases/' + this.$route.params.database + '/' + this.table + '/structure')
        }
    },

    // watch table change
    watch: {
        table: function() {
            this.LoadTable()
        }
    }
}
</script>

<template>
    <div>
        <Panel>
            <template #header>
                <TabMenu :model="items" :activeIndex="activeIndex" />
            </template>

            <template #icons>
                <Button class="p-panel-header-icon p-link mr-2">
                    <span class="pi pi-cog"></span>
                </Button>
            </template>

            <ScrollPanel class="w-full scroll-menu2">
                <router-view />
            </ScrollPanel>
        </Panel>
    </div>
</template>