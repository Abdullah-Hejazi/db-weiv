<script>
    export default {
        name: 'MainForm',

        props : [
            'title',
            
        ]
    }
</script>

<template>
    <div class="greetings">
        <Card class="mt-3">
            <template #title>
                {{ title }}
            </template>
            <template #content>
                <slot na />
            </template>
            <template #footer>
                <Button icon="pi pi-check" label="Save" @click="login" />
                <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
            </template>
        </Card>
    </div>
</template>
