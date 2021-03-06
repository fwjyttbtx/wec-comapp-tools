<template>
    <div>
        <el-button class="mv-24 mh-8" @click="addNewDialog">添加一条新配置</el-button>
        <div class="mh-8">
            <el-table
                    :data="tableData"
                    border
                    ref="systemPropsTable"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
            >
                <el-table-column prop="key" label="配置键" width="200" align="center"></el-table-column>
                <el-table-column prop="value" label="配置值" width="280"></el-table-column>
                <el-table-column prop="description" label="配置描述" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="schoolName" label="学校名" width="220" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.schoolName">{{scope.row.schoolName}}</span>
                        <span v-if="!scope.row.schoolName">默认租户配置</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteProperty(scope.row.wid)" v-if="!scope.row.editable">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    class="text-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNumber"
                    :page-sizes="[10, 50, 150]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total.sync="totalSize">
            </el-pagination>
        </div>

        <el-dialog title="添加属性" :visible.sync="dialogFormVisible" id="propertyForm" :close-on-click-modal="false">
            <el-form ref="dialogForm" :rules="rules" :model="property" label-width="80px">
                <el-form-item label="配置键名" prop="key">
                    <el-input v-model="property.key" :disabled="property.edit"></el-input>
                </el-form-item>
                <el-form-item label="配置值" prop="value">
                    <el-input v-model="property.value"></el-input>
                </el-form-item>
                <el-form-item label="配置描述" prop="description">
                    <el-input type="textarea" :rows="3" resize="none" v-model="property.description"></el-input>
                </el-form-item>
                <el-form-item label="租户选择" prop="schoolId">
                    <el-select
                        :disabled="property.edit"
                        v-model="property.schoolId"
                        placeholder="请选择租户 租户为空时默认为全局配置"
                        filterable
                    >
                        <el-option
                            v-for="school in schools"
                            :key="school.schoolId"
                            :label="school.schoolName"
                            :value="school.schoolId"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../conf/api'

    export default {
        data() {
            return {
                loading: true,
                tableData: [],
                pageNumber: 1,
                pageSize: 10,
                totalSize: 0,
                schools: [],
                dialogFormVisible: false,
                property: {key: "", value: "", schoolId: ""},
                rules: {
                    key: [{required: true, message: "配置键不能为空", trigger: "blur"}],
                    value: [{required: true, message: "配置值不能为空", trigger: "blur"}]
                }
            }
        },
        created() {
            this.fillTableData();
            this.$http.get(api.schools).then(resp => {
                if(resp.status === 200 && resp.data.code === '0') {
                    let schools = resp.data.schools;
                    schools.forEach((val, idx) => {
                        val.editable = false;
                    });
                    this.schools = schools;
                }
            }, fail => console && console.error(`%c${fail}`, 'font-style: italic;'))
        },
        methods: {
            submitForm() {
                let vm = this;
                vm.$refs['dialogForm'].validate((valid) => {
                    if (valid) {
                        if(vm.property.edit) {
                            vm.$http.post(api.property, vm.property).then(resp => {
                                if(resp.status === 200 && resp.data.code === '0') {
                                    vm.dialogFormVisible = false;
                                    vm.reloadTable();
                                    this.$message.success(`更新配置信息成功。`);
                                } else {
                                    this.$message.error(`更新配置信息失败${resp.data.message}`);
                                }
                            }, fail => {
                                this.$message.error(`更新配置信息失败`);
                                console.error(`%c${fail}`, 'font-style: italic;')
                            });
                        } else {
                            vm.$http.put(api.property, vm.property).then(resp => {
                                if(resp.status === 200 && resp.data.code === '0') {
                                    vm.dialogFormVisible = false;
                                    vm.reloadTable();
                                    this.$message.success(`保存配置信息成功。`);
                                } else {
                                    this.$message.error(`保存配置信息失败${resp.data.message}`);
                                }
                            }, fail => {
                                this.$message.error(`保存配置信息失败`);
                                console.error(`%c${fail}`, 'font-style: italic;')
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.fillTableData(val, this.pageNumber);
            },
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.fillTableData(this.pageSize, val);
            },
            fillTableData(pageSize, pageNumber) {
                let vm = this;
                vm.$http.get(api.properties, {params: {pageSize: pageSize, pageNumber: pageNumber}}).then((resp) => {
                    if(resp.status === 200 && resp.data.code === '0') {
                        vm.tableData = resp.data.properties;
                        vm.pageNumber = resp.data.pageNumber || 1;
                        vm.totalSize = resp.data.total || 0;
                        vm.pageSize = resp.data.pageSize || 10;
                    }
                    vm.loading = false;
                }, fail => {
                    console && console.error(`%c${fail}`, 'font-style: italic;');
                    vm.loading = false;
                });
            },
            reloadTable() {
                this.pageNumber = 1;
                this.fillTableData(this.pageSize, this.pageNumber);
            },
            addNewDialog() {
                this.property = {key: "", value: "", schoolId: ""};
                this.dialogFormVisible = true;
                if(this.$refs['dialogForm']) this.$refs['dialogForm'].resetFields();
            },
            handleClick(row) {
                // 复制一份副本 避免row内容同步做了更新
                this.property = JSON.parse(JSON.stringify(row));
                this.property.edit = true;
                this.dialogFormVisible = true;
                if(this.$refs['dialogForm']) this.$refs['dialogForm'].resetFields();
            },
            deleteProperty(wid) {
                let vm = this;
                vm.$msgbox.confirm("确定删除当前配置吗？", "警告", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.$http.delete(`${api.property}/${wid}`).then(resp => {
                        if(resp.status === 200 && resp.data.code === '0') {
                            vm.$message.success(`删除配置信息成功。`);
                            vm.reloadTable();
                        } else {
                            vm.$message.error(`删除配置信息失败${resp.data.message}`);
                        }
                    }, fail => console.error(`%c${fail}`, 'font-style: italic;'))
                }).catch(() => vm.$message.info(`取消删除。`));
            }
        }
    }
</script>
<style scoped>
    #propertyForm .el-select {
        width: 100%;
    }
</style>