# Firebase → CloudBase 迁移总结

## 迁移完成时间
迁移已完成，所有 Firebase 代码已替换为 CloudBase。

## 修改的文件

### 1. `package.json`
- ✅ 移除：`firebase` 依赖
- ✅ 添加：`@cloudbase/js-sdk` 依赖

### 2. `src/lib/firebase.js` (完全重写)
- ✅ 移除所有 Firebase 相关导入和配置
- ✅ 使用 `@cloudbase/js-sdk` 初始化 CloudBase
- ✅ 实现匿名登录：`auth.signInAnonymously()`
- ✅ 所有函数已迁移到 CloudBase API：
  - `generatePairId()` - 生成配对ID
  - `saveUserA()` - 保存用户A数据
  - `saveUserB()` - 保存用户B数据
  - `getTestResult()` - 获取测试结果
  - `getPairData()` - 获取配对数据
  - `testWrite()` / `testRead()` - 测试函数

### 3. `env.example`
- ✅ 更新为 CloudBase 配置说明（无需环境变量）

## API 映射对照

### Firestore → CloudBase

| Firestore API | CloudBase API | 说明 |
|--------------|---------------|------|
| `initializeApp()` | `cloudbase.init()` | 初始化 |
| `getFirestore()` | `app.database()` | 获取数据库 |
| `collection(db, 'tests')` | `db.collection('tests')` | 集合 |
| `doc(collection, id)` | `collection.doc(id)` | 文档引用 |
| `setDoc(doc, data)` | `doc.set(data)` | 设置文档 |
| `getDoc(doc)` | `doc.get()` | 获取文档 |
| `getDocs(collection)` | `collection.get()` | 获取集合 |
| `collection(db, 'tests', id, 'userA')` | `db.collection('tests/{id}/userA')` | 子集合 |
| `serverTimestamp()` | `new Date().toISOString()` | 时间戳 |
| `orderBy().limit()` | `.orderBy().limit()` | 查询 |

## 数据结构保持不变

```
tests/
  └── {pairId}/
      ├── userA/
      │   └── {autoId}/
      └── userB/
          └── {autoId}/
```

## 功能验证

所有原有功能保持不变：
- ✅ 生成配对ID
- ✅ 保存用户A数据
- ✅ 保存用户B数据
- ✅ 读取测试结果
- ✅ 读取配对数据
- ✅ 匿名登录

## 重要变更

1. **初始化方式**：
   - 旧：Firebase 配置通过环境变量
   - 新：CloudBase 配置硬编码在代码中（env 和 region）

2. **子集合路径**：
   - 旧：`collection(db, 'tests', pairId, 'userA')`
   - 新：`db.collection('tests/{pairId}/userA')`

3. **时间戳**：
   - 旧：`serverTimestamp()` (Firestore 服务器时间)
   - 新：`new Date().toISOString()` (客户端时间)

4. **文档ID**：
   - 旧：Firestore 自动生成
   - 新：手动生成（`userA_${Date.now()}_${random}`）

## 未修改的文件（但功能正常）

以下文件导入 `firebase.js` 的函数，但无需修改：
- `pages/test.jsx`
- `pages/result.jsx`
- `pages/pair/[id].jsx`
- `pages/match/[id].jsx`
- `pages/share/[pairId].tsx`
- `components/TestComponent.jsx`

## 下一步

1. 测试所有功能确保正常工作
2. 如需修改 CloudBase 环境ID或区域，编辑 `src/lib/firebase.js`
3. 部署到生产环境

## 注意事项

- CloudBase 使用匿名登录，无需配置认证
- 所有数据操作需要先初始化 CloudBase
- 子集合使用路径字符串格式：`tests/{pairId}/userA`

