<style>
    .el-divider--horizontal {
        margin: 15px;
    }
    .el-row {
        margin: 0px;
    }
    .el-input {
        width: 80%;
    }
    .el-col {
        text-align: center;
    }
    .rm-span {
        float: right;
        line-height: 40px;
    }
    .cm-span {
        float: center;
        line-height: 40px;
    }
    .h-40 {
        height: 40px;
    }
</style>

<script>
    import { getToken } from '@/utils/Cookies.js'
    export default {
        data () {
            return {
                // 上传文件url
                baseUploadURL: `${process.env.VUE_APP_REQUEST_URL}`,
                uploadURL: '/upload_file_base',
                // 获取数据url
                getURL: '',
                // 保存数据url
                saveURL: '',
                // 历史模板选择下标
                indexTemplate: 0,
                // 模板数据
                TemplateData: [],
                // 历史模板列表
                options: [],
                // 上传文件附带消息头
                myHeaders: '',
                // 上传数据附带数据, jsontype必须改为对应类型, 详见服务器代码GData.js内UploadFileType类型定义
                uploadData: { jsontype: 0 },
                // 是否有分页
                isPaging: false,
                // 当前页(isPaging = true时生效)
                curPage: 0,
                // 分页数据
                curTemplateData: [],
                // 默认标签页(isPaging = true时生效)
                gearActiveName: 'first',
                // 标签页(isPaging = true时生效)
                pageData: [
                    { Label: '0', Name: 'first' },
                    { Label: '1', Name: 'second'},
                    { Label: '2', Name: 'third' },
                    { Label: '3', Name: 'fourth'},
                    { Label: '4', Name: 'fifth' },
                ],
            };
        },
        created() {
            this.myHeaders = { Authorization: getToken() };
        },
        mounted() {
            this.index();
        },
        methods: {
            onChangeTemplate(value) {
                console.log('base upload value : ', value);
                console.log('base upload change template label : ', this.options[value].label);
                this.indexTemplate = value;
                this.index();
            },
            onSave(isAll) {
                const curOption = this.options[this.indexTemplate];
                const createtime = curOption.createtime;
                const filename = curOption.filename;
                const jsontype = this.uploadData.jsontype;
                const index = this.indexTemplate;
                let data = { createtime, filename, jsontype, index };
                if (this.isPaging) {
                    data.isAll = isAll;
                    data.page = this.curPage;
                }
                this.gt.httpPost(this.saveURL, data).then((response) => {
                    const data = response.data;
                    console.log('base upload save response: ', JSON.stringify(data));
                    if (data.status === 200) {
                        this.$message({ message: '提交服务器成功' });
                        // const result = data.result;
                        // this.updateTemplateList(result.TemplateFiles, result.TemplateIndex);
                        this.index();
                    } else {
                        this.$message({ message: `提交服务器失败(${data.msg})` });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onUploadSuccess(response) {
                if (response.code === 500) {
                    this.$message({ message: `上传失败(${response.msg})` });
                    return;
                }
                const result = response.result;
                this.updateTemplateData(result);
            },
            index() {
                this.gt.httpPost(this.getURL, { jsontype: this.uploadData.jsontype, index: this.indexTemplate, serverType: this.uploadData.serverType }).then((response) => {
                    const result = response.data.result;
                    console.log('base upload get response : ', result);
                    this.updateTemplateData(result);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            updateTemplateData(result) {
                this.TemplateData = [];
                for (let i = 0; i < result.TemplateData.length; i++) {
                    this.TemplateData.push(result.TemplateData[i]);
                }
                this.updateTemplateList(result.TemplateFiles, result.TemplateIndex);
                if (this.isPaging) {
                    this.updateCurrentPageData();
                }
            },
            updateTemplateList(templateFiles, templateIndex) {
                this.options = [];
                for (let i = 0; i < templateFiles.length; i++) {
                    const data = templateFiles[i];
                    const item = { value: i, label: data.filename, filename: data.filename, createtime: data.createtime };
                    if (data.createtime) {
                        item.label += ` ( ${data.createtime} ) `;
                    }
                    item.label += data.iswork === 0 ? ' [ 未生效 ]' : ' [ 已生效 ]';
                    this.options.push(item);
                }
                this.indexTemplate = this.options[templateIndex].value;
            },
            handleClick(tab, event) {
                console.log('base upload handleClick : ', tab.index, event);
                this.curPage = tab.index - 1;
                this.updateCurrentPageData();
            },
            updateCurrentPageData() {
                console.log('base upload updateCurrentPageData');
                if (this.TemplateData[this.curPage]) {
                    for (const key in this.TemplateData[this.curPage]) {
                        if (Object.hasOwnProperty.call(this.TemplateData[this.curPage], key)) {
                            const value = this.TemplateData[this.curPage][key];
                            this.$set(this.curTemplateData, key, value);
                        }
                    }
                } else {
                    console.log(`base upload update current page ${this.curPage} no data`);
                }
            }
        }
    };
</script>