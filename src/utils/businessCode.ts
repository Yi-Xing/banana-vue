/** 文件系统业务编码格式。 */
export const BUSINESS_CODE_PATTERN = /^[a-z0-9_-]{0,254}$/

/** 文件系统业务编码最大长度。 */
export const BUSINESS_CODE_MAX_LENGTH = 254

/** 文件系统业务编码格式错误提示。 */
export const BUSINESS_CODE_MESSAGE = '仅支持小写字母、数字、下划线和中划线，长度不能超过254个字符'
