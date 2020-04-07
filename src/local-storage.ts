export enum ValueType {
  Number = 'num',
  String = 'str',
  JSON = 'json',
}

interface Options {
  expireAt?: number
  type?: ValueType
}

const OptSuffix = '_$opt$'

class LocalStorage {
  set(key: string, value: any, options?: Options): void {
    wx.setStorageSync(key, value)
    options && wx.setStorageSync(key + OptSuffix, options)
  }

  get<T>(key: string): T | null {
    let opt = wx.getStorageSync(key + OptSuffix) || {}
    if (opt.expireAt && opt.expireAt < Date.now()) {
      wx.removeStorageSync(key)
      wx.removeStorageSync(key + OptSuffix)
      return null
    }

    let result: string | null = wx.getStorageSync(key)
    if (result === null) {
      return null
    }
    switch (opt.type) {
      case ValueType.Number:
        return (+result as unknown) as T
      case ValueType.JSON:
        return JSON.parse(result)
      case ValueType.String:
      default:
        return (result as unknown) as T
    }
  }

  remove(key: string): void {
    wx.removeStorageSync(key)
    wx.removeStorageSync(key + OptSuffix)
  }
}

export const localStorage = new LocalStorage()
export default localStorage
