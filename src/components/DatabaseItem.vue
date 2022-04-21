<script>
export default {
    name: 'DatabaseItem',

    data () {
        return {
            items: [
                {
                    label: this.$t('home.drop_database'),
                    icon: 'pi pi-fw pi-trash',
                    command: this.DeleteDatabaseDialog
                }
            ],
            deleteDatabaseDialog: false,
            hovered: false
        }
    },

    props: [
        'index',
        'database',
        'delete'
    ],

    methods: {
        GetColor(shift=0) {
            let total = 0
            for (let i = 0; i < this.database.SCHEMA_NAME.length; i++) {
                total += this.database.SCHEMA_NAME[i].charCodeAt()
            }

            total += shift

            let b = this.hovered ? 72 : 67;

            let color = this.CalculateColor(total % 360, 62, b)

            return `rgb(${color.r}, ${color.g}, ${color.b})`
        },

        CalculateColor(h, s, b) {
            s /= 100;
            b /= 100;
            const k = (n) => (n + h / 60) % 6;
            const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
            return {
                r: 255 * f(5),
                g: 255 * f(3),
                b: 255 * f(1)
            }
        },

        ToggleDatabaseSettings(event) {
            this.$refs.menu.toggle(event)
        },

        DeleteDatabaseDialog() {
            this.deleteDatabaseDialog = true
        },

        DeleteDatabaseDoubleCheck() {
            this.deleteDatabaseDialog = false
            this.$confirm.require({
                header: this.$t('home.drop_database_ask'),
                message: this.$t('home.drop_database_ask_message', { database: this.database.SCHEMA_NAME }),
                icon: 'pi pi-exclamation-triangle',
                acceptClass: 'p-button-danger',
                rejectClass: 'p-button-plain p-button-text',
                autofocus: false,
                acceptLabel: this.$t('general.delete'),
                rejectLabel: this.$t('general.cancel'),
                accept: () => {
                    this.delete(this.database)
                }
            });
        },

        SelectDatabase() {
            this.$router.push('/databases/' + this.database.SCHEMA_NAME)
        }
    }
}
</script>

<template>
    <div class="db-item border-round surface-overlay shadow-2 mb-4">

        <div @mouseover="hovered = true" @mouseleave="hovered = false" @click="SelectDatabase" class="px-3 border-round shadow-3 py-4 cursor-pointer opacity-100" :style="{ backgroundImage: 'linear-gradient(to right, ' + GetColor() + ', ' + GetColor(30) }">
            <div class="flex flex-wrap align-items-center">
                <div class="mr-3">
                    <img src="@/assets/db.png" height="80">
                </div>

                <div class="text-lg text-white db-title text-overflow-ellipsis mx-auto">{{ database.SCHEMA_NAME }}</div>
            </div>
        </div>

        <div class="px-3 py-3 text-400 flex justify-content-between align-items-center">
            <small>{{ database.DEFAULT_COLLATION_NAME }}</small>
            <Button icon="pi pi-cog" class="p-button-rounded p-button-secondary p-button-text" @click="ToggleDatabaseSettings" />
            <Menu id="menu" :model="items" ref="menu" :popup="true" />
        </div>

        <Dialog :draggable="false" :modal="true" :header="$t('home.drop_database_confirm')" class="db-dialog" v-model:visible="deleteDatabaseDialog" >
            <InlineMessage severity="error" class="mb-3 w-full">
                {{ $t('home.drop_database_confirm_message', {database: database.SCHEMA_NAME}) }}
            </InlineMessage>

            <template #footer>
                <Button :label="$t('general.cancel')" @click="deleteDatabaseDialog = false" class="p-button-text p-button-plain" />
                <Button :label="$t('general.delete')" @click="DeleteDatabaseDoubleCheck" class="p-button-danger" />
            </template>
        </Dialog>

    </div>
</template>

<style>
.db-item {
    width: 300px;
    max-width: 90vw;
}

.db-title {
    text-shadow: 1px 1px #464646;
    max-width: 90%;
}

.db-dialog {
    width: 600px;
    max-width: 90vw;
}
</style>