/**
 * 验证整数，不可以小数
 * @param  val 当前值字符串
 * @return string
 */
export function verifyNumberInteger(val) {
    // 匹配空格
    let v = val.replace(/(^\s*)|(\s*$)/g, '');
    // 只能是数字，不能是其他输入
    v = v.replace(/[^\d]/g, '');
    // 不能以0开始
    v = v.replace(/^0/g, '');
    // 返回结果
    return v;
}

/**
 * 验证百分比，不可以小数
 * @param  val 当前值字符串
 * @return string
 */
export function verifyNumberPercentage(val) {
    // 匹配空格
    let v = val.replace(/(^\s*)|(\s*$)/g, '');
    // 只能是数字，不能是其他输入
    v = v.replace(/[^\d]/g, '');
    // 不能以0开始
    v = v.replace(/^0/g, '');
    // 数字超过100，赋值成最大值100
    v = v.replace(/^[1-9]\d\d{1,3}$/, '100');
    // 返回结果
    return v;
}

/**
 * 小数或整数(不可以负数)
 * @param   val 当前值字符串
 * @returns string
 */
export function verifyNumberIntegerAndFloat(val) {
    // 匹配空格
    let v = val.replace(/(^\s*)|(\s*$)/g, '');
    // 只能是数字和小数点，不能是其他输入
    v = v.replace(/[^\d.]/g, '');
    // 以0开始只能输入一个
    v = v.replace(/^0{2}$/g, '0');
    // 保证第一位只能是数字，不能是点
    v = v.replace(/^\./g, '');
    // 小数只能出现1位
    v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 小数点后面保留2位
    v = v.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    // 返回结果
    return v;
}