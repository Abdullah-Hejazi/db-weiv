<script>
import QueryBuilder from '@/services/querybuilder';

export default {
    name: 'TableStructure',

    methods: {
        Test() {
            let query = new QueryBuilder('dbweiv', 'users');
            query.select('*')
        }
    }
}
</script>

<template>
    <div>
        <Button label="Hello" @click="Test" />
    </div>
</template>
