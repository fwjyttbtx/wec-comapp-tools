<template>
    <div id="cacheContainer">
        <el-row class="mv-24 mh-8">
            <el-col :span="10">
                <el-select multiple filterable v-model="cacheSchools" placeholder="选择学校进行操作">
                    <el-option
                            v-for="school in schools"
                            :key="school.schoolId"
                            :label="school.schoolName"
                            :value="school.schoolId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="8" class="mh-4">
                <el-button v-if="!cacheSchools || cacheSchools.length === 0" disabled @click="clearSchoolCache">清理缓存</el-button>
                <el-button v-else="cacheSchools" @click="clearSchoolCache">清理缓存</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import api from '../conf/api'

    export default {
        data() {
            return {
                cacheSchools: [],
                initSchools: [],
                schools: []
            }
        },
        created() {
            this.$http.get(api.properties).then((resp) => {
                if(resp.status === 200 && resp.data.code === '0') {
                    this.tableData = resp.data.properties
                }
            });
            this.$http.get(api.schools).then((resp) => {
                let data = resp.data;
                this.schools = data.schools;
            });
        },
        methods: {
            clearSchoolCache() {
                let _this = this;
                this.$http.delete(api.schoolRedisCache, {
                    params: {schoolIds: _this.cacheSchools.join(",")}
                }).then((resp) => {
                    if(resp.status === 200 && resp.data.code === '0') {
                        _this.$message.success('缓存清理成功');
                    } else {
                        _this.$message.fail(resp.message);
                    }
                });
            }
        }
    }
</script>
<style scoped>
    #cacheContainer .el-select {
        width: 100%;
    }
</style>