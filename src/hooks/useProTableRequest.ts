import { ActionType, ProFormInstance, RequestData } from '@ant-design/pro-components'
import { SortOrder } from 'antd/lib/table/interface'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import useExport from './useExport'

type Params<U> = U & {
  pageSize?: number
  current?: number
  keyword?: string
}

type Sort = Record<string, SortOrder>

type Filter = Record<string, React.ReactText[] | null>

type Fn<U, T> = (
  params: any,
  sort: Sort,
  filter: Filter
) => Promise<{ code?: number; msg?: string; data?: { list?: T[]; total?: number } }>

export interface IUseProTableRequestOption<T, U = T> {
  /**
   * 导出接口url
   */
  exportUrl?: string

  /** 需要缓存的目标链接地址
   *  目的: 缓存列表页的请求参数，例如分页、排序、搜索等参数，方便详情回列表页时自动恢复
   *  @example [routeNames.userManagementUserListUserDetail]
   */
  cacheUrls?: string[]
  /**
   * 格式化数据
   * 你可以对返回的数据做一些处理
   */
  dataFormat?: (data: T[]) => U[]
  /**
   * 格式化参数
   *
   * 前置处理请求参数。如果你需要传递给导出时。这会很有用
   * @param params 将要传递给接口的参数
   */
  paramsFormat?(params: any): any
}

/**
 * antd pro table请求封装钩子
 * @param fn
 * @param option
 * @returns
 */
export default function useProTableRequest<T, U extends Record<string, any> = {}>(
  fn: Fn<U, T>,
  option: IUseProTableRequestOption<T> = {}
) {
  const { dataFormat, cacheUrls } = option

  // Table action 的引用，便于自定义触发
  const actionRef = useRef<ActionType>()

  const formRef = useRef<ProFormInstance>()
  // 缓存请求参数
  const requestParams = useRef<Record<string, any>>({})
  // 数据缓存参数
  const dataSourceRef = useRef<T[]>([])

  /** 缓存参数 */
  const _cacheData = useRef<any>(undefined)
  /** 缓存key */
  const cacheKey = genCacheKey()
  /** 当前是否需要缓存 */
  const needCache = !!cacheUrls?.length

  // 集成导出
  const [exportTable, exportLoading] = useExport(option.exportUrl)

  // 表格请求
  const tableRequst = useCallback(async (params: Params<U>, sort: Sort, filter: Filter) => {
    const { current, ...rest } = params as Record<string, any>
    const newParams: any = { ...rest, pageNum: current ?? params?.pageNum ?? 1 }

    // 重置数据
    let total = 0
    let data: T[] = []

    requestParams.current = option.paramsFormat ? option.paramsFormat(newParams) : newParams

    try {
      // 参数长度过长不处理
      if (JSON.stringify(requestParams.current).length < 1000) {
        const res = await fn(requestParams.current, sort, filter)
        // 如果当前列表为空并且pageNum不为1.则重新发起请求
        if (!res.data?.list?.length && requestParams.current.pageNum !== 1) {
          setTimeout(() => {
            actionRef.current?.reload(true)
          })
        }
        const { list = [] as T[] } = res.data || {}
        total = res.data?.total || 0
        data = dataFormat ? dataFormat(list) : list
        // 缓存数据
        _cacheData.current = { ...requestParams.current }

        dataSourceRef.current = data
      }
    } catch (error) {}
    // }

    return { data, success: true, total } as Partial<RequestData<T>>
  }, [])

  /** 恢复缓存 */
  const restoreCache = () => {
    if (needCache) {
      const cacheString = window.sessionStorage.getItem(cacheKey)

      if (cacheString) {
        try {
          const cacheParams = JSON.parse(cacheString)

          /** 恢复请求参数 */
          _cacheData.current = cacheParams
          /** 恢复搜索表单 */
          formRef.current?.setFieldsValue(cacheParams)
          /** 恢复分页信息 */
          actionRef.current?.setPageInfo?.({
            current: cacheParams?.current ?? cacheParams?.pageNum ?? 1,
            pageSize: cacheParams?.pageSize
          })
        } catch (error) {
        } finally {
          window.sessionStorage.removeItem(cacheKey) // 清除缓存数据
        }
      }
    }
  }
  useLayoutEffect(() => {
    restoreCache()
  }, [])
  /**
   * 表格数据缓存处理
   */
  useEffect(() => {
    return () => {
      if (!needCache) {
        return
      }

      // 组件卸载时将数据缓存至sessionStorage
      const to = pick(window.location, ['hash', 'href', 'protocol', 'port', 'search', 'pathname', 'hostname'])

      const toCache = cacheUrls?.some((url) => to?.href?.includes(url))
      if (toCache) {
        window.sessionStorage.setItem(cacheKey, JSON.stringify(_cacheData.current))
      }
    }
  }, [])

  return {
    formRef,
    actionRef,
    /**
     * 表格请求
     */
    request: tableRequst,
    /**
     * 表格query参数
     */
    params: requestParams,

    /**
     * 表格数据缓存
     */
    dataSource: dataSourceRef,

    /**
     * 导出
     * @param params
     * @returns
     */
    exportTable: (params?: Record<string, any>) => {
      return exportTable({ ...requestParams.current, ...params })
    },
    /**
     * 导出loading
     */
    exportLoading
  }
}

/**
 * 从对象中选择指定的属性
 * @param obj
 * @param keys
 * @returns
 */
function pick<T extends Object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * 生成缓存键值
 * @param key key
 * @returns
 */
function genCacheKey(key?: string | ((ok: string) => string)) {
  const hostKey = encodeURIComponent(window.location.href.replace(/http(s)?:\/\//, ''))
  if (typeof key === 'function') {
    return key(hostKey)
  }
  return key || hostKey
}
