<script>

const { ipcRenderer } = require('electron')

import DatabaseService from '@/services/databaseservice'

export default {
    name: 'ExportDialog',

    props: [
        'visible',
        'database'
    ],

    data () {
        return {
            active: false,
            sqlFile: 'C:/Users/amahe/Desktop/test.sql'
        }
    },

    mounted () {
        this.active = this.visible
    },

    methods: {
        SelectFile () {
            let file = ipcRenderer.sendSync('save-file')

            if (file) {
                this.sqlFile = file
            } else {
                return;
            }
        },

        ExportFile () {
            let databaseService = new DatabaseService(this.database)
            databaseService.exportTable({
                file: this.sqlFile,
                table: 'users',
                clear: true
            })
        }
    },

    watch: {
        active (value) {
            this.$emit('visibilityChange', value)
        },

        visible (value) {
            this.active = value
        }
    }
}
</script>

<template>
    <Dialog class="dialog-width" v-model:visible="active" :header="$t('export.export_database')" :modal="true">
        <div class="border-dashed border-gray-600 text-center" @click="ExportFile">
            <div class="text-3xl text-gray-600 p-5" v-if="! sqlFile">
                {{ $t('export.select_file') }}
                <i class="pi pi-download text-3xl"></i>
            </div>

            <div class="text-xl text-gray-600 p-5 export-text" v-if="sqlFile" v-tooltip.bottom="sqlFile">
                {{ sqlFile }}
            </div>
        </div>

        <div class="text-center" v-if="sqlFile">
            <Button :label="$t('export.export')" @click="ExportFile" class="mt-3 w-full" />
        </div>
    </Dialog>
</template>

<style>
.dialog-width {
    width: 400px;
    max-width: 90vw;
}

.export-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
