<script>

import ColumnDialog from '@/components/ColumnDialog'

export default {
    name: 'CreateTableDialog',

    components: {
        ColumnDialog
    },

    props: [
        'finish'
    ],

    data () {
        return {
            table: {
                name: ''
            },

            tableColumns: [
                {
                    field: 'name',
                    header: 'Name'
                },
                {
                    field: 'type',
                    header: 'Type'
                },
                {
                    field: 'index',
                    header: 'Index'
                }
            ],

            columns: [],

            columnDialog: {
                active: false,
                header: 'New Column',
                button: 'Add Column',
                column: null,
                func: null,
                id: -1
            },

            loading: false
        }
    },

    methods: {
        AddColumnDialog () {
            this.columnDialog.id = -1
            this.columnDialog.header = 'New Column'
            this.columnDialog.button = 'Add Column'
            this.columnDialog.column = null
            this.columnDialog.func = this.AddColumn
            this.columnDialog.active = true

        },

        EditColumnDialog (index) {
            this.columnDialog.id = index
            this.columnDialog.header = 'Edit Column'
            this.columnDialog.button = 'Edit Column'
            this.columnDialog.column = this.columns[index]
            this.columnDialog.func = this.EditColumn
            this.columnDialog.active = true
        },

        RemoveColumn (index) {
            this.columns.splice(index, 1)
        },

        AddColumn (column) {
            this.columns.push(column)
            this.columnDialog.active = false
        },

        EditColumn (column, id) {
            this.columns[id] = column
            this.columnDialog.active = false
        },

        onRowReorder (e) {
            let temp = this.columns[e.dragIndex]

            this.columns[e.dragIndex] = this.columns[e.dropIndex]
            this.columns[e.dropIndex] = temp
        },

        async CreateTable () {
            this.loading = true
            console.log('here')
            // this.finish()
        }
    }
}
</script>

<template>
    <div>
        <Divider class="mt-0" />

        <InputText placeholder="Table Name" class="w-full mt-1" v-model="table.name" />

        <div class="flex justify-content-between align-items-center mt-3">
            <h3>Columns</h3>
            <div>
                <Button
                    class="p-button-outlined"
                    icon="pi pi-plus"
                    label="Add Column"
                    @click="AddColumnDialog"
                />
            </div>
        </div>

        <DataTable :value="columns" @rowReorder="onRowReorder" responsiveLayout="scroll" :rowHover="true">
            <Column :rowReorder="true" headerStyle="width: 3rem" :reorderableColumn="false" />

            <Column v-for="col of tableColumns" :field="col.field" :header="col.header" :key="col.field"></Column>

            <Column field="isNull" header="Null">
                <template #body="{data}">
                    <span class="pi pi-check text-primary" v-if="data.isNull"></span>
                    <span class="pi pi-times text-500" v-else></span>
                </template>
            </Column>

            <Column field="autoIncrement" header="A.I">
                <template #body="{data}">
                    <span class="pi pi-check text-primary" v-if="data.autoIncrement"></span>
                    <span class="pi pi-times text-500" v-else></span>
                </template>
            </Column>

            <Column header="Edit Column">
                <template #body="{index}">
                    <Button class="p-button-text p-button-rounded" icon="pi pi-pencil" @click="EditColumnDialog(index)" />
                    <Button class="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" @click="RemoveColumn(index)" />
                </template>
            </Column>

            <template #empty>
                <div class="text-center">
                    <h4 class="m-0">
                        No columns found
                        <span class="text-primary cursor-pointer" @click="AddColumnDialog"> Add Column </span>
                    </h4>
                </div>
            </template>
        </DataTable>

        <div class="text-center mt-4">
            <Button :loading="loading" @click="CreateTable" label="Create Table" style="width: 300px; max-width: 100%;" />
        </div>

        <Dialog class="column-dialog" :modal="true" v-model:visible="columnDialog.active" :header="columnDialog.header">
            <ColumnDialog :id="columnDialog.id" :column="columnDialog.column" :finish="columnDialog.func" :label="columnDialog.button" />
        </Dialog>
    </div>
</template>

<style>
.column-dialog {
    width: 500px;
    max-width: 95vw;
}
</style>