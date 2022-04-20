<script>

export default {
    name: 'RowDialog',

    props: [
        'finish',
        'tableStructure',
        'error',
        'row'
    ],

    data () {
        return {
            loading: false,
            data: {},
            original: {},
            types: {
                texts: [
                    "TINYTEXT",
                    "TEXT",
                    "MEDIUMTEXT",
                    "LONGTEXT",
                    "BLOB",
                    "MEDIUMBLOB",
                    "LONGBLOB",
                    "TINYBLOB"
                ],
                numbers: [
                    "BIT",
                    "TINYINT",
                    "SMALLINT",
                    "MEDIUMINT",
                    "INT",
                    "INTEGER",
                    "BIGINT",
                    "YEAR"
                ],
                datetimes: [
                    "DATETIME",
                    "TIMESTAMP"
                ],
                dates: ["DATE"],
                times: ["TIME"],
                enums: ['ENUM', 'SET']
            },
            button: 'Add Row'
        }
    },

    mounted () {
        if (this.row) {
            this.button = 'Update Row'
            this.original = JSON.parse(JSON.stringify(this.row))
            this.data = JSON.parse(JSON.stringify(this.row))
        }
    },

    methods: {
        TypeExists(haystack, needle) {
            needle = needle.toUpperCase();
    
            if (haystack.includes(needle)) {
                return true;
            }

            if (haystack.includes(needle.replace(/\(.*\)/, ''))) {
                return true;
            }

            return false;
        },

        GetEnumValues(type) {
            let matches = type.match(/\((.*)\)/);

            let result = matches[1].split(',').map(item => {
                let val = item.trim();

                return val.substring(1, val.length - 1);
            });
            return result;
        },

        FinishRow() {
            this.finish(this.data, this.original)
        }
    }
}
</script>

<template>
    <div>
        <div v-if="error" class="my-2">
            <InlineMessage severity="error" class="w-full scalein select-text">
                {{ error }}
            </InlineMessage>
        </div>

        <div v-for="(row, index) in tableStructure" class="row">
            <div v-if="TypeExists(types.texts, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Textarea :placeholder="row.Field" v-model="data[row.Field]" :rows="2" class="w-full" />
            </div>

            <div v-else-if="TypeExists(types.numbers, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <InputNumber :placeholder="row.Field" v-model="data[row.Field]" class="w-full" :format="false" />
            </div>

            <div v-else-if="TypeExists(types.datetimes, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Calendar :placeholder="row.Field" v-model="data[row.Field]" class="w-full" :showTime="true" hourFormat="12"/>
            </div>

            <div v-else-if="TypeExists(types.dates, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Calendar :placeholder="row.Field" v-model="data[row.Field]" class="w-full" />
            </div>

            <div v-else-if="TypeExists(types.dates, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Calendar :placeholder="row.Field" v-model="data[row.Field]" class="w-full" :showTime="true" :timeOnly="true" />
            </div>

            <div v-else-if="TypeExists(types.enums, row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Dropdown :placeholder="row.Field" v-model="data[row.Field]" class="w-full" :options="GetEnumValues(row.Type)" />
            </div>

            <div v-else>
                <p class="mb-1">{{ row.Field }}</p>
                <InputText :placeholder="row.Field" v-model="data[row.Field]" class="w-full" />
            </div>
        </div>

        <div class="mt-5">
            <Button :label="button" class="w-full" @click="FinishRow" />
        </div>
    </div>
</template>

<style>
.column-dialog {
    width: 500px;
    max-width: 95vw;
}
</style>