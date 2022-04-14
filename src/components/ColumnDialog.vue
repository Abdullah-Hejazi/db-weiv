<script>
export default {
    name: 'ColumnDialog',

    data() {
        return {
            name: '',
            type: '',
            types: [
                {
                    label: 'Popular',
                    icon: 'pi-star',
                    items: [
                        {
                            label: 'INT'
                        },
                        {
                            label: 'VARCHAR'
                        },
                        {
                            label: 'TEXT'
                        },
                        {
                            label: 'TIMESTAMP'
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
                            label: "DATE"
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
            ]
        }
    },

    mounted() {
        this.type = this.types[0].items[0]
    },

    methods: {
    }
}
</script>

<template>
    <div>
        <Divider class="mt-0" />

        <div class="flex">
            <div class="px-1 col-6">
                <InputText placeholder="Column Name" class="w-full" v-model="name" />
            </div>

            <div class="px-1 col-6">
                <Dropdown v-model="type" :options="types" optionLabel="label" optionGroupLabel="label"
                    optionGroupChildren="items" placeholder="Type" class="w-full">
                    <template #optiongroup="slotProps">
                        <div class="flex align-items-center country-item pl-0">
                            <span :class="'pi mr-2 ' + slotProps.option.icon"></span>
                            <div>{{ slotProps.option.label }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
        </div>
    </div>
</template>
