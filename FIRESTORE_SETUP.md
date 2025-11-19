# Firestore 安全规则配置指南

## 问题说明

如果遇到 "Missing or insufficient permissions" 错误，说明 Firestore 的安全规则需要配置。

## 配置步骤

### 1. 打开 Firebase 控制台

1. 访问 https://console.firebase.google.com/
2. 选择你的项目：`couple-test-9d9a9`
3. 在左侧菜单中，点击 **Firestore Database**
4. 点击 **规则** 标签页

### 2. 复制以下规则

将以下规则复制到 Firestore 规则编辑器中：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to tests collection
    match /tests/{testId} {
      // Allow read/write to the test document itself
      allow read, write: if true;
      
      // Allow read/write to userA subcollection
      match /userA/{document=**} {
        allow read, write: if true;
      }
      
      // Allow read/write to userB subcollection
      match /userB/{document=**} {
        allow read, write: if true;
      }
    }
    
    // Allow read/write access to test collection (for backward compatibility)
    match /test/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. 发布规则

1. 点击 **发布** 按钮
2. 等待规则部署完成（通常几秒钟）

## 注意事项

⚠️ **安全提示**：当前规则允许所有人读写数据。在生产环境中，你应该：

1. 添加身份验证
2. 限制写入权限
3. 添加数据验证

示例（需要身份验证）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tests/{testId} {
      allow read: if true;  // 允许所有人读取
      allow write: if request.auth != null;  // 只允许已登录用户写入
      
      match /userA/{document=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
      
      match /userB/{document=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

## 验证配置

配置完成后，重新测试你的应用。如果还有问题，检查：

1. 规则是否正确发布
2. 浏览器控制台是否有其他错误
3. Firebase 项目是否正确连接

