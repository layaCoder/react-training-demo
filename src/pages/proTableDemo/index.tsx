import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import styles from './index.module.less';
import useProTableRequest from '@/hooks/useProTableRequest'
import { Button, Flex, Image, Tabs, Typography } from 'antd';
import { MReportType } from '@/enums/downloadCenter/ERepportType';
import { MBussinessModuleType } from '@/enums/downloadCenter/EBusinessModuleType';
import { DownloadOutlined, RedoOutlined, SettingOutlined } from '@ant-design/icons';
// import imges from '@/imges';
import { useRowSelection } from '@/hooks/useRowSelection';

const proTableDemo = () => {
    const { Text } = Typography;



    //  demo适配函数
    const fetchRoutesList = async (params) => {
        const mockData = [
            { id: 1, name: 'Route 1', beginTime: '2023-01-01T00:00:00Z', endTime: '2023-01-31T23:59:59Z' },
            { id: 2, name: 'Route 2', beginTime: '2023-02-01T00:00:00Z', endTime: '2023-02-28T23:59:59Z' },
            { id: 3, name: 'Route 3', beginTime: '2023-03-01T00:00:00Z', endTime: '2023-03-31T23:59:59Z' }
        ];
        return {
            code: 0, // 假设0为成功状态码
            msg: 'success', // 成功信息
            data: {
                list: mockData, // 原始返回的数组作为list
                total: mockData.length // 假设total为数组长度，这里可能需要根据实际情况修改
            }
        };
    };
    // hooks中的promise返回必须按照标准格式返回，包含code、msg、data三个字段
    const { request, actionRef, formRef, exportTable } = useProTableRequest(fetchRoutesList)

    /** ProTable 选择项配置 */
    const { rowSelection, selectedRows, setSelectedRows } = useRowSelection<any>({})

    const onRefresh = () => {
        actionRef.current?.reload()
    }

    const searchColumns: ProColumns<any>[] = [
        {
            title: '报表名称',
            dataIndex: 'reportName',
            fieldProps: { maxLength: 20, placeholder: '请输入' },
        },
        {
            title: '报表类型',
            dataIndex: 'type',
            valueEnum: MReportType,
        },
        {
            title: '业务模块',
            dataIndex: 'module',
            valueEnum: MBussinessModuleType,
            colSize: 1
        },
        {
            title: '状态',
            dataIndex: 'state',
            initialValue: '1',
            // 在表单中隐藏
            hideInSearch: true,
        }

    ]
    const tableColumns: ProColumns<any>[] = [
        { title: '序号', dataIndex: 'id', width: 200 },
        { title: '报表名称', dataIndex: 'name', width: 200 },
        { title: '业务模块', dataIndex: 'businessModule' },
        { title: '报表类型', dataIndex: 'reportType' },
        { title: '下载次数', dataIndex: 'downloadCount' },
        { title: '创建时间', dataIndex: 'createAt' },
        {
            title: '操作', dataIndex: 'action', fixed: 'right',
            render(dom, entity, index, action, schema) {
                return (
                    [
                        <Button
                            type="link"
                            onClick={() => { }}
                        >
                            下载
                        </Button>,
                        <Button danger type="link" onClick={() => { }}>
                            删除
                        </Button>
                    ]
                )
            },
        },
        // {
        //     title: '时间',
        //     valueType: 'dateTime',
        //     render: (text, record) => {
        //         return `${record.beginTime || ''} - ${record.endTime || ''}`
        //     }
        // },
    ]



    const columns: ProColumns<any>[] = [
        ...searchColumns.filter(Boolean).map((item) => ({ ...item, hideInTable: true })),
        ...tableColumns.filter(Boolean).map((item) => ({ ...item, hideInSearch: true }))
    ]

    return (
        <PageContainer>
            <ProTable
                headerTitle={<div>title</div>}
                scroll={{ x: 2000 }}
                form={{
                    optionRender(searchConfig, props, dom) {
                        return dom.reverse()
                    },
                }}
                rowSelection={rowSelection}
                formRef={formRef}
                actionRef={actionRef}
                options={{
                    densityIcon: <Button type='link' >密度按钮</Button>,
                    reloadIcon: <Button type='link' >刷新按钮</Button>,
                    setting: {
                        settingIcon: <Button>设置按钮</Button>
                    }
                }}
                columns={columns}
                request={request}
                rowKey="id"
                search={{
                    defaultCollapsed: false,
                    labelWidth: 'auto'
                }}
                toolbar={{
                    title: '测试Title',
                    subTitle: (<Flex align='center'>
                        <Text style={{ marginRight: 10 }}>测试subTitle</Text>
                        <Text style={{ marginRight: 8 }}>测试选中数量：{selectedRows.length}</Text>
                        <Button>tooBar区域</Button>
                        <Button>测试按钮</Button>
                        <Button>测试按钮</Button>
                        <Button>测试按钮</Button>
                        <Button>测试按钮</Button>
                        <Button>测试按钮</Button>
                    </Flex>),

                }}
                tableRender={(props, dom) => {
                    return (
                        <div>
                            <Tabs
                                style={{
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    background: '#fff'
                                }}
                                onChange={(key) => {
                                    formRef.current?.setFieldsValue({ state: key })
                                    // 切换tab时，重新请求数据
                                    actionRef.current?.reload()
                                }}
                                defaultActiveKey="1"
                                items={[
                                    {
                                        label: '已下载',
                                        key: '1',
                                    },
                                    {
                                        label: '未下载',
                                        key: '2',
                                    },
                                ]}
                            />
                            {dom}
                        </div>)
                }}
            />


        </PageContainer>);
}

export default proTableDemo;