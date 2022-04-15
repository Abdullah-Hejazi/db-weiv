<script>
export default {
    name: 'ColumnDialog',

    data() {
        return {
            name: '',
            type: '',
            size: null,
            index: null,
            indexName: '',
            isNull: false,
            autoIncrement: false,
            defaultValue: '',

            defaultTypes: [
                {
                    label: 'None'
                },
                {
                    label: 'As Defined'
                },
                {
                    label: 'NULL'
                },
                {
                    label: 'CURRENT_TIMESTAMP'
                },
            ],
            defaultType: {},

            types: [
                {
                    label: 'Popular',
                    icon: 'pi-star',
                    items: [
                        {
                            label: 'INT',
                            size: true
                        },
                        {
                            label: 'VARCHAR',
                            size: true
                        },
                        {
                            label: 'TEXT',
                            size: true
                        },
                        {
                            label: 'TIMESTAMP',
                            datetime: true
                        }
                    ]
                },
                {
                    label: 'Strings',
                    icon: 'pi-align-left',
                    items: [
                        {
                            label: "CHAR",
                            size: true
                        },
                        {
                            label: "VARCHAR",
                            size: true
                        },
                        {
                            label: "BINARY",
                            size: true
                        },
                        {
                            label: "VARBINARY",
                            size: true
                        },
                        {
                            label: "TINYBLOB"
                        },
                        {
                            label: "TINYTEXT"
                        },
                        {
                            label: "TEXT",
                            size: true
                        },
                        {
                            label: "BLOB",
                            size: true
                        },
                        {
                            label: "MEDIUMTEXT"
                        },
                        {
                            label: "MEDIUMBLOB"
                        },
                        {
                            label: "LONGTEXT"
                        },
                        {
                            label: "LONGBLOB"
                        },
                        {
                            label: "ENUM",
                            values: true
                        },
                        {
                            label: "SET",
                            values: true
                        }
                    ]
                },
                {
                    label: 'Numbers',
                    icon: 'pi-sort-numeric-up-alt',
                    items: [
                        {
                            label: "BIT",
                            size: true
                        },
                        {
                            label: "TINYINT",
                            size: true
                        },
                        {
                            label: "BOOL"
                        },
                        {
                            label: "BOOLEAN"
                        },
                        {
                            label: "SMALLINT",
                            size: true
                        },
                        {
                            label: "MEDIUMINT",
                            size: true
                        },
                        {
                            label: "INT",
                            size: true
                        },
                        {
                            label: "INTEGER",
                            size: true
                        },
                        {
                            label: "BIGINT",
                            size: true
                        },
                        {
                            label: "FLOAT",
                            size: true
                        },
                        {
                            label: "DOUBLE",
                            size: true,
                            percision: true
                        },
                        {
                            label: "DOUBLE PRECISION",
                            size: true,
                            percision: true
                        },
                        {
                            label: "DECIMAL",
                            size: true,
                            percision: true
                        },
                        {
                            label: "DEC",
                            size: true,
                            percision: true
                        }
                    ]
                },
                {
                    label: 'Dates & Times',
                    icon: 'pi-calendar',
                    items: [
                        {
                            label: "DATE",
                            date: true
                        },
                        {
                            label: "DATETIME",
                            datetime: true
                        },
                        {
                            label: "TIMESTAMP",
                            datetime: true
                        },
                        {
                            label: "TIME",
                            time: true
                        },
                        {
                            label: "YEAR"
                        }
                    ]
                }
            ],

            indexTypes: [
                {
                    label: 'None',
                    none: true
                },
                {
                    label: 'PRIMARY KEY'
                },
                {
                    label: 'UNIQUE'
                },
                {
                    label: 'INDEX'
                },
                {
                    label: 'FULLTEXT'
                }
            ],

            moreOptions: {
                active: false,
                label: 'More Options',
                icon: 'pi pi-angle-down'
            },

            error: ''
        }
    },

    props: [
        'finish',
        'column',
        'label',
        'id'
    ],

    mounted() {
        this.defaultType = this.defaultTypes[0]
        this.type = this.types[0].items[0]

        if (this.column) {
            this.name = this.column.name
            this.FindType(this.column.type)
            this.size = this.column.size
            this.FindIndex(this.column.index)
            this.indexName = this.column.indexName
            this.isNull = this.column.isNull
            this.autoIncrement = this.column.autoIncrement
            this.FindDefaultType(this.column.defaultType)
            this.defaultValue = this.column.defaultValue
        }
    },

    methods: {
        NullableConstraint() {
            if (this.isNull) {
                this.autoIncrement = false
            }
        },

        AutoIncrementConstraint() {
            if (this.autoIncrement) {
                this.isNull = false

                if (this.index?.label !== 'UNIQUE') {
                    this.index = this.indexTypes[1]
                }
            }
        },

        MoreOptions() {
            if (this.moreOptions.active) {
                this.moreOptions.active = false
                this.moreOptions.icon = 'pi pi-angle-down'
                this.moreOptions.label = 'More Options'
            } else {
                this.moreOptions.active = true
                this.moreOptions.icon = 'pi pi-angle-up'
                this.moreOptions.label = 'Less Options'
            }
        },

        FinishColumn () {
            if (this.name === '') {
                this.error = 'Column name is required'
                return
            }

            let defaultVal = this.defaultType.label == 'As Defined' ? this.defaultValue : this.defaultType.label;

            if (defaultVal == 'None') defaultVal = null

            let data = {
                name: this.name,
                type: this.type.label,
                size: this.size,
                length: this.type.size ? this.size : null,
                isNull: this.isNull,
                autoIncrement: this.autoIncrement,
                defaultValue: defaultVal,
                defaultType: this.defaultType.label == 'None' ? null : this.defaultType.label,
                index: this.index?.label == 'None' ? null : this.index?.label,
                indexName: this.indexName
            }

            if (this.id == -1) {
                this.finish(data)
            } else {
                this.finish(data, this.id)
            }
        },

        FindType(type) {
            let found = false

            this.types.forEach(t => {
                t.items.forEach(i => {
                    if (i.label == type) {
                        found = true
                        this.type = i
                    }
                })
            })

            if (!found) {
                this.type = this.types[0].items[0]
            }
        },

        FindIndex(index) {
            let found = false

            this.indexTypes.forEach(i => {
                if (i.label == index) {
                    found = true
                    this.index = i
                }
            })

            if (!found) {
                this.index = this.indexTypes[0]
            }
        },

        FindDefaultType(defaultType) {
            let found = false

            this.defaultTypes.forEach(d => {
                if (d.label == defaultType) {
                    found = true
                    this.defaultType = d
                }
            })

            if (!found) {
                this.defaultType = this.defaultTypes[0]
            }
        }
    }
}
</script>

<template>
    <div>
        <Divider class="mt-0" />

        <div v-if="error" class="my-2">
            <InlineMessage severity="error" class="w-full scalein select-text">
                {{ error }}
            </InlineMessage>
        </div>

        <div>
            <p class="m-0 mb-2 pl-1">Column Name</p>
            <InputText placeholder="Column Name" class="w-full" v-model="name" />
        </div>

        <div>
            <p class="m-0 my-2">Column Type</p>
            <Dropdown v-model="type" :options="types" option-label="label" :filter="true" placeholder="Type"
                optionGroupLabel="label" optionGroupChildren="items" class="w-full">
                <template #optiongroup="slotProps">
                    <div class="flex align-items-center country-item pl-0">
                        <span :class="'pi mr-2 ' + slotProps.option.icon"></span>
                        <div>{{ slotProps.option.label }}</div>
                    </div>
                </template>
            </Dropdown>
        </div>

        <div class="mt-3 flex justify-content-between">
            <div class="field-checkbox">
                <Checkbox v-model="isNull" :binary="true" @change="NullableConstraint" />
                <label>Nullable</label>
            </div>

            <div class="field-checkbox">
                <Checkbox v-model="autoIncrement" :binary="true" @change="AutoIncrementConstraint" />
                <label>Auto Increment</label>
            </div>
        </div>

        <Divider />

        <div v-if="moreOptions.active">
            <div v-if="type.size">
                <div class="p-0 my-2">
                    <p class="m-0 mb-2">Column Type Size</p>
                    <InputNumber :use-grouping="false" placeholder="Size" class="w-full" v-model="size" />
                </div>
            </div>

            <div>
                <div class="p-0 my-2">
                    <p class="m-0 mb-2">Index</p>
                    <Dropdown v-model="index" :options="indexTypes" option-label="label" placeholder="Type" class="w-full" />
                </div>
            </div>

            <div v-if="! index?.none">
                <div class="p-0 my-2">
                    <p class="m-0 mb-2">Index Name</p>
                    <InputText placeholder="Index Name" class="w-full" v-model="indexName" />
                </div>
            </div>

            <div>
                <p class="mb-2 pl-1">Default Value</p>
                <Dropdown v-model="defaultType" :options="defaultTypes" optionLabel="label" placeholder="Type"
                    class="w-full" />

                <div class="mt-2 w-full" v-if="defaultType.label == 'As Defined'">
                    <InputText placeholder="Default value" class="w-full" v-model="defaultValue" />
                </div>
            </div>
        </div>

        <div class="mt-3 flex justify-content-between">
            <Button class="p-button-text p-button-plain" :icon="moreOptions.icon" label="More Options" @click="MoreOptions" />

            <Button :label="label" @click="FinishColumn" />
        </div>

    </div>
</template>
