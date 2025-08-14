import { FormProps, ModalFormProps } from '@ant-design/pro-components'
import { useForm } from 'antd/lib/form/Form'
import { useEffect, useMemo, useState } from 'react'

// P extends ModalFormProps<DataType> | DrawerFormProps<DataType> | StepsFormProps<DataType> = ModalFormProps<DataType>

export interface IUseProTableFormOption<DataType> {
  title?: (data?: DataType) => string

  modalProps?: Partial<ModalFormProps>
}

export default function useProTableForm<DataType = Record<string, any>>(option: IUseProTableFormOption<DataType> = {}) {
  const { title = (data) => (data ? '编辑' : '新增') } = option

  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<DataType>()
  const [form] = useForm()

  const modalProps = useMemo(() => {
    return {
      layout: 'horizontal',
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      ...option.modalProps,
      title: title(editData),
      open,
      form,
      onVisibleChange: (value) => setOpen(value)
    } as Omit<FormProps, 'onFinish' | 'title'>
  }, [editData, open, form, title, option.modalProps])

  // 弹窗关闭清除数据
  useEffect(() => {
    if (!open) {
      setEditData(undefined)
      // FIXED: 设置延时清空。防止弹窗里面存在request组件导致发出请求
      setTimeout(() => {
        form.resetFields()
      }, 300)
    }
  }, [open])

  /**
   * 设置显示弹窗并设置数据
   */
  function setShowModal(editData?: DataType) {
    if (editData) {
      setEditData(editData)
      form.setFieldsValue(editData)
    }
    setOpen(true)
  }

  return {
    // 组合props。 该props适合antd pro Form
    modalProps,
    editData,
    setEditData,
    setOpen,
    setShowModal
  }
}
