<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>取消邮件</strong></h3>
            </div>
        </div>
        
        <el-card class="box-card">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文标题 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="searchData.EnMailTitle" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="searchData.EnMailContent"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">邮件ID : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="searchData.ID"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">用户ID : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="searchData.UserId"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">类型(0用户,1系统) : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="searchData.MailType" placeholder="0用户,1系统"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">搜索</el-button>
            </el-row>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <el-table :data="tableData" style="100%" border>
                <el-table-column width="100" align="center" prop="ID" label="邮件ID"></el-table-column>
                <el-table-column width="200" align="center" prop="UserId" label="用户ID"></el-table-column>
                <el-table-column width="200" align="center" prop="CreateTime" label="创建时间"></el-table-column>
                <el-table-column width="400" align="center" prop="EnMailTitle" label="英文标题"></el-table-column>
                <el-table-column align="center" prop="EnMailContent" label="英文内容"></el-table-column>
                <el-table-column width="100" align="center" prop="TeenPattiGold" label="附件金币"></el-table-column>
                <el-table-column width="100" align="center" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="onUndo(scope.$index)" type="danger" icon="el-icon-refresh-left" size="small">取消</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style scoped>
    .el-col {
        text-align: left;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .h-textarea {
        height: 40px;
        min-height: 40px;
        line-height: 40px;
    }
</style>

<script>
export default {
    data () {
        return {
            searchData: {
                ID: 0,
                UserId: 0,
                EnMailTitle: '',
                EnMailContent: '',
                MailType: 0,
            },
            tableData: [],
        }
    },
    methods: {
        onSearch() {
            this.gt.httpPost('/search_mail', this.searchData).then((response) => {
                if (response.data.status === 200) {
                    const msg = response.data.msg;
                    const data = response.data.result.data;
                    this.$message({ message: `搜索${msg}` });
                    this.tableData = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        this.tableData.push(item);
                    }
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        onUndo(index) {
            const data = this.tableData[index];
            if (!data) {
                this.$message({ message: `数据异常${index}` });
                return false;
            }
            let senddata = { MailId: data.ID, MailType: 1 };
            if (this.searchData.MailType === 0) { // 用户
                senddata.UserId = data.UserId;
                senddata.MailType = 0;
            }
            this.gt.httpPost('/cancel_mail', senddata).then((response) => {
                if (response.data.status === 200) {
                    const msg = response.data.msg;
                    this.$message({ message: `取消${msg}` });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>