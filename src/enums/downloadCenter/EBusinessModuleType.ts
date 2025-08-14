export const EBusinessModuleType = {
    /** 用户信息 */
    UserInfo: 0,
    /** 组织结构 */
    Orgnazation: 1,

}

export const MBussinessModuleType = {
    [EBusinessModuleType.UserInfo]: '用户信息',
    [EBusinessModuleType.Orgnazation]: '组织结构',

}

export const OBusinessModuleType = [
    { value: EBusinessModuleType.UserInfo, label: '用户信息' },
    { value: EBusinessModuleType.Orgnazation, label: '组织结构' },
]

export const MBusinessModuleTypeSelect = {
    [MBussinessModuleType[EBusinessModuleType.UserInfo]]: '用户信息',
    [MBussinessModuleType[EBusinessModuleType.Orgnazation]]: '组织结构',

}