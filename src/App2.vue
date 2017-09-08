<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="缓存相关">
        <el-select multiple filterable v-model="cacheSchools" placeholder="选择学校进行操作">
          <el-option
                  v-for="school in schools"
                  :key="school.schoolId"
                  :label="school.schoolName"
                  :value="school.schoolId">
          </el-option>
        </el-select>
        <el-button v-if="!cacheSchools || cacheSchools.length === 0" disabled @click="clearSchoolCache">清理缓存</el-button>
        <el-button v-else="cacheSchools" @click="clearSchoolCache">清理缓存</el-button>
      </el-tab-pane>
      <el-tab-pane label="表相关">
        <el-select multiple filterable v-model="initSchools" placeholder="选择学校进行操作">
          <el-option
                  v-for="school in schools"
                  :key="school.schoolId"
                  :label="school.schoolName"
                  :value="school.schoolId">
          </el-option>
        </el-select>
        <el-button v-if="!initSchools || initSchools.length === 0" disabled @click="clearSchoolCache">初始化表</el-button>
        <el-button v-else="initSchools" @click="initSchoolTables">初始化表</el-button>
      </el-tab-pane>
      <el-tab-pane label="系统配置">
        <el-table :data="tableData" border ref="systemPropsTable" @row-click="rowSelected">
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
          <el-table-column label="操作" width="180">
            <template scope="scope">
              <el-button @click="handleClick" type="text" size="small">更新</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      -->
    </el-tabs>
  </div>
</template>

<script>
    import api from './conf/api'

    export default {
        data() {
            return {
                tableData: [
                    {propKey: "1", propValue: "2", propDesc: "3", schoolName: "4", schoolId: "5", editable: true}
                ],
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
            },
            initSchoolTables() {
                this.$msgbox.confirm("此操作将先删除数据库选择的租户相关的表（如果存在的话），重新创建选择的租户的表，确定此操作吗（操作无法撤回、表不备份）？", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(api.schoolRedisCache).then((resp) => {
                        if(resp.code === '0') {
                            this.$message.success('缓存清理成功');
                        } else {
                            this.$message.fail(resp.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');
                });

            },
            rowSelected(row, event, column) {
                console.log(row)
            }
        }
    }
</script>

<style>
  body {
    font-family: Helvetica, sans-serif;
  }
</style>
