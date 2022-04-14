<script>

import ColumnDialog from '@/components/ColumnDialog'

export default {
    name: 'CreateTableDialog',

    components: {
        ColumnDialog
    },

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
                    field: 'default',
                    header: 'Default'
                }
            ],

            columns: [],

            columnDialog: {
                active: false,
                header: 'New Column'
            }
        }
    },

    methods: {
        ModifyColumn (index) {
            console.log(index)
        },

        RemoveColumn (index) {
            this.columns.splice(index, 1)
        },

        onRowReorder (e) {
            let temp = this.columns[e.dragIndex]

            this.columns[e.dragIndex] = this.columns[e.dropIndex]
            this.columns[e.dropIndex] = temp
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
                    @click="columnDialog.active = true"
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
                    <Button class="p-button-text p-button-rounded" icon="pi pi-pencil" @click="ModifyColumn(index)" />
                    <Button class="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" @click="RemoveColumn(index)" />
                </template>
            </Column>

            <template #empty>
                <div class="text-center">
                    <h4 class="m-0">
                        No columns found
                        <span class="text-primary cursor-pointer" @click="columnDialog.active = true"> Add Column </span>
                    </h4>
                </div>
            </template>
        </DataTable>

        <Dialog class="create-table-modal" :modal="true" v-model:visible="columnDialog.active" :header="columnDialog.header">
            <ColumnDialog />
        </Dialog>
    </div>
</template>
