#Redux 使用规范

1. 同名策略
reducers 必须与 store 中属性是保持名称一致的。
2. 不要在 reducer 中有 API 调用
reducer 中只做数据的更新操作
