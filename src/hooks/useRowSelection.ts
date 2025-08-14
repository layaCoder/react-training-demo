import { TableProps } from 'antd'
import { useState } from 'react'

export interface UseRowSelectionResult<T> {
    /** key */
    rowKey: string
    /** 选择项配置 */
    rowSelection?:
    | (TableProps<T>['rowSelection'] & {
        alwaysShowAlert?: boolean
    })
    | false
    /** 选择项选中id合集 */
    selectedRowKeys: number[]
    /** 批量选择items */
    selectedRows: T[]
    /** 选择项更新 */
    setSelectedRows: (list: T[]) => void
}

export interface UseRowSelectionParams<T> {
    /**  @name 选择项Key值 */
    rowKey?: string
    /** @name 选择项配置 */
    rowSelection?: TableProps<T>['rowSelection']
    /** 选中项更新 */
    onChange?: (list: T[], ids: number[]) => void
}
/** hooks - ProTable 选择项配置hooks */
export function useRowSelection<T>(props?: UseRowSelectionParams<T>): UseRowSelectionResult<T> {
    const rowKey = props?.rowKey ?? 'id'

    const rowSelection = props?.rowSelection

    /** 批量选择items */
    const [selectedRows, setSelectedRows] = useState<T[]>([])

    /** 选择项选中id合集 */
    const selectedRowKeys = (selectedRows || []).map((row) => row[rowKey])

    /** 选择项配置 */
    const newRowSelection = {
        ...rowSelection,
        type: rowSelection?.type ?? 'checkbox',
        selectedRowKeys,

        onSelect: (item: any, blo) => {
            if (blo) {
                if (rowSelection?.type === 'radio') {
                    setSelectedRows([{ ...item }])
                } else {
                    setSelectedRows([...selectedRows, { ...item }])
                }
            } else {
                setSelectedRows(selectedRows.filter((row) => row[rowKey] !== item?.[rowKey]))
            }
        },
        onSelectAll: (blo, rows, changeRows) => {
            if (blo) {
                setSelectedRows([...selectedRows, ...changeRows])
            } else {
                if (selectedRows?.length) {
                    const newList = selectedRows?.filter((item) => !changeRows?.find((row) => row[rowKey] === item[rowKey]))
                    setSelectedRows(newList)
                } else {
                    setSelectedRows([])
                }
            }
        },
        onChange: (selectedRowKeys, selectedRows, info) => {
            if (info?.type === 'none') {
                setSelectedRows(selectedRows)
                props?.onChange?.(selectedRowKeys, selectedRows)
            }
        }
    }

    return {
        /** key */
        rowKey,
        /** 选择项配置 */
        rowSelection: newRowSelection,
        /** 选择项选中id合集 */
        selectedRowKeys,
        /** 批量选择items */
        selectedRows,
        /** 选择项更新 */
        setSelectedRows
    }
}
