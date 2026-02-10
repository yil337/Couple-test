# Firestore 安全规则配置指南

## 当前规则（宽松版本 - 用于开发测试）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许所有操作（读取和写入）在 tests 集合及其所有子集合上
    match /tests/{document=**} {
      allow read, write: if true;
    }
    
    // 允许所有操作在 test 集合上（向后兼容）
    match /test/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 规则说明

### `{document=**}`
- 这是一个通配符，匹配所有文档和子集合
- 适用于路径：`tests/{任何路径}`
- 包括：
  - `tests/{pairId}` - 主文档
  - `tests/{pairId}/userA/{docId}` - userA 子集合文档
  - `tests/{pairId}/userB/{docId}` - userB 子集合文档
  - 以及所有更深层的嵌套路径

### `allow read, write: if true`
- `read`: 允许读取操作（get, list）
- `write`: 允许所有写入操作（create, update, delete）
- `if true`: 无条件允许（最宽松的设置）

## 如何在 Firebase 控制台更新规则

1. 访问 Firebase 控制台：https://console.firebase.google.com/
2. 选择项目：`couple-test-9d9a9`
3. 左侧菜单 → **Firestore Database**
4. 点击 **规则** 标签页
5. 复制上面的规则并粘贴
6. 点击 **发布** 按钮
7. 等待几秒钟让规则生效

## 生产环境建议（未来可以添加）

如果你想要更安全的规则，可以在生产环境中使用：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{document=**} {
      // 允许所有人读取
      allow read: if true;
      
      // 只允许创建和更新，不允许删除
      allow create, update: if true;
      allow delete: if false;
    }
  }
}
```

或者添加身份验证：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{document=**} {
      // 允许所有人读取
      allow read: if true;
      
      // 只允许已登录用户写入
      allow write: if request.auth != null;
    }
  }
}
```

## 验证规则

更新规则后，测试以下操作：
1. ✅ 创建配对ID (`generatePairId`)
2. ✅ 保存 userA 数据 (`saveUserA`)
3. ✅ 保存 userB 数据 (`saveUserB`)
4. ✅ 读取配对数据 (`getPairData`)

如果所有操作都成功，说明规则配置正确！






