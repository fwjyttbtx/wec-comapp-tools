<template>
    <div>
        <el-table :data="tableData" border ref="systemPropsTable">
            <el-table-column prop="propKey" label="配置键" width="180"></el-table-column>
            <el-table-column prop="propValue" label="配置值" width="280">
                <template scope="scope">
                    <span v-if="!scope.row.editable">{{scope.row.propValue}}</span>
                    <el-input v-else="scope.row.editable" :value="scope.row.propValue"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="propDesc" label="配置描述" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="schoolName" label="学校名" width="180"></el-table-column>
            <el-table-column prop="schoolId" label="学校租户ID" width="180"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">更新</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from '../conf/api'

    export default {
        data() {
            return {
                tableData: [
                    {propKey: "1", propValue: "2", propDesc: "3", schoolName: "4", schoolId: "5", editable: true}
                ]
            }
        },
        created() {
            this.$http.get(api.properties).then((resp) => {
                if(resp.status === 200 && resp.data.code === '0') {
                    this.tableData = resp.data.properties
                }
            });
        },
        methods: {
            handleClick(row) {
                console.log(row)
            }
        }
    }
</script>