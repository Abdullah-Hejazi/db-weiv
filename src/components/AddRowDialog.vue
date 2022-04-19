<script>

export default {
    name: 'AddRowDialog',

    props: [
        'finish',
        'tableStructure'
    ],

    data () {
        return {
            loading: false,
            data: [],
            types: [
                [
                    "TINYTEXT",
                    "TEXT",
                    "MEDIUMTEXT",
                    "LONGTEXT",
                    "BLOB",
                    "MEDIUMBLOB",
                    "LONGBLOB",
                    "TINYBLOB"
                ],
                [
                    "BIT",
                    "TINYINT",
                    "SMALLINT",
                    "MEDIUMINT",
                    "INT",
                    "INTEGER",
                    "BIGINT"
                ],
                [
                    "DATE",
                    "DATETIME",
                    "TIMESTAMP",
                    "TIME"
                ]
            ],
        }
    },

    mounted () {
        console.log('varchar(255)'.match(/^(.*)(?=\()/))
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
        }
    }
}
</script>

<template>
    <div>
        <div v-for="(row, index) in tableStructure" class="row">
            <div v-if="TypeExists(types[0], row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Textarea v-model="data[index]" :rows="2" class="w-full" />
            </div>

            <div v-else-if="TypeExists(types[1], row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <InputNumber v-model="data[index]" class="w-full" :format="false" />
            </div>

            <div v-else-if="TypeExists(types[2], row.Type)">
                <p class="mb-1">{{ row.Field }}</p>
                <Calendar v-model="data[index]" class="w-full" :showTime="true"/>
            </div>

            <div v-else>
                <p class="mb-1">{{ row.Field }}</p>
                <InputText v-model="data[index]" class="w-full" />
            </div>
        </div>
    </div>
</template>

<style>
.column-dialog {
    width: 500px;
    max-width: 95vw;
}
</style>