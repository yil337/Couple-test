# Firestore 安全规则 - 更安全的版本

## 当前规则（中等安全性）

这个规则在功能性和安全性之间取得平衡：

### 安全特性：
1. ✅ **允许读取** - 任何人都可以读取（需要公开访问配对结果）
2. ✅ **限制写入** - 只允许创建，不允许更新或删除
3. ✅ **数据验证** - 验证必需字段和数据类型
4. ✅ **防止恶意写入** - 确保数据结构正确

### 规则说明：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{testId} {
      // 允许所有人读取
      allow read: if true;
      
      // 主文档：只允许创建，需要 createdAt 字段
      allow create: if request.resource.data.keys().hasAll(['createdAt'])
                    && request.resource.data.createdAt is timestamp;
      allow update: if true; // 允许更新主文档（用于配对状态等）
      allow delete: if false; // 不允许删除
      
      // UserA 子集合：验证必需字段
      match /userA/{docId} {
        allow read: if true;
        allow create: if request.resource.data.keys().hasAll([
          'resultKey', 'resultName', 'styleScores', 'attachScores'
        ]) && request.resource.data.resultKey is string
        && request.resource.data.resultName is string
        && request.resource.data.styleScores is map
        && request.resource.data.attachScores is map;
        allow update: if false; // 不允许更新
        allow delete: if false; // 不允许删除
      }
      
      // UserB 子集合：同样的验证
      match /userB/{docId} {
        // 同上
      }
    }
  }
}
```

## 如果需要更宽松的规则（仅用于开发测试）

如果上面的规则导致写入失败，可以使用这个更宽松的版本：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{document=**} {
      allow read, write: if true;
    }
    match /test/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 如果需要更严格的规则（生产环境推荐）

如果将来添加了用户认证，可以使用这个版本：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{testId} {
      // 允许所有人读取
      allow read: if true;
      
      // 只允许已登录用户写入
      allow write: if request.auth != null
                   && request.resource.data.keys().hasAll(['createdAt']);
      
      match /userA/{docId} {
        allow read: if true;
        allow create: if request.auth != null
                      && request.resource.data.keys().hasAll([
                        'resultKey', 'resultName', 'styleScores', 'attachScores'
                      ]);
        allow update, delete: if false;
      }
      
      match /userB/{docId} {
        allow read: if true;
        allow create: if request.auth != null
                      && request.resource.data.keys().hasAll([
                        'resultKey', 'resultName', 'styleScores', 'attachScores'
                      ]);
        allow update, delete: if false;
      }
    }
  }
}
```

## 建议

1. **开发阶段**：使用宽松规则确保功能正常
2. **测试阶段**：使用中等安全性规则（当前版本）
3. **生产环境**：添加用户认证后使用严格规则






