# 如何查看测试数据 - 多种方法

## 方法一：Supabase Table Editor（图形界面，最简单）⭐ 推荐

### 优点：
- 无需写 SQL
- 可视化界面，直观易用
- 支持筛选、排序、搜索
- 可以直接看到所有数据

### 步骤：
1. 登录 Supabase Dashboard
2. 在左侧边栏点击 **"Table Editor"**（表编辑器）
3. 选择 `test_results` 表
4. 即可看到所有测试记录

### 功能：
- **查看数据**：直接看到所有字段和记录
- **筛选**：点击列标题可以筛选数据
  - 例如：筛选 `completed_at IS NOT NULL` 查看已完成的测试
- **排序**：点击列标题可以排序
- **搜索**：在搜索框中输入关键词
- **统计**：表格底部会显示总记录数

### 快速查看完成数：
1. 在 Table Editor 中打开 `test_results` 表
2. 查看表格底部的记录数（例如："Showing 1-50 of 123"）
3. 或者使用筛选功能：
   - 点击 `completed_at` 列
   - 选择 "is not null"
   - 查看筛选后的记录数

---

## 方法二：Supabase SQL Editor（灵活强大）

### 优点：
- 可以执行复杂查询
- 可以计算统计指标
- 可以保存常用查询

### 步骤：
1. 登录 Supabase Dashboard
2. 点击 **"SQL Editor"**
3. 复制粘贴 SQL 查询
4. 点击 "Run" 执行

### 适用场景：
- 需要计算完成率、平均值等统计指标
- 需要按时间、类型等维度分组统计
- 需要复杂的多表关联查询

---

## 方法三：通过代码查询（程序化访问）

### 优点：
- 可以集成到自己的应用或脚本中
- 可以自动化定期查询
- 可以构建自定义仪表板

### 示例代码：

#### JavaScript/TypeScript（在浏览器或 Node.js 中）

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// 查询总测试数
async function getTotalTests() {
  const { count, error } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
  
  console.log('总测试数:', count)
  return count
}

// 查询已完成测试数
async function getCompletedTests() {
  const { count, error } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
    .not('completed_at', 'is', null)
  
  console.log('已完成测试数:', count)
  return count
}

// 查询最近10条记录
async function getRecentTests() {
  const { data, error } = await supabase
    .from('test_results')
    .select('id, created_at, completed_at, animal, ls_type, at_type')
    .order('created_at', { ascending: false })
    .limit(10)
  
  console.log('最近10条记录:', data)
  return data
}
```

#### Python

```python
from supabase import create_client, Client

url: str = "YOUR_SUPABASE_URL"
key: str = "YOUR_SUPABASE_ANON_KEY"
supabase: Client = create_client(url, key)

# 查询总测试数
response = supabase.table('test_results').select('*', count='exact').execute()
print(f"总测试数: {response.count}")

# 查询已完成测试数
response = supabase.table('test_results').select('*', count='exact').not_('completed_at', 'is', None).execute()
print(f"已完成测试数: {response.count}")

# 查询最近10条记录
response = supabase.table('test_results').select('id, created_at, completed_at, animal').order('created_at', desc=True).limit(10).execute()
print(f"最近10条记录: {response.data}")
```

---

## 方法四：Supabase Dashboard 的 Reports（如果有）

某些 Supabase 项目可能提供内置的分析报告功能，可以在 Dashboard 中直接查看。

---

## 推荐使用场景

### 日常快速查看：
👉 **使用 Table Editor**（方法一）
- 最简单，无需写代码
- 适合快速查看数据概览

### 需要统计计算：
👉 **使用 SQL Editor**（方法二）
- 执行 `ANALYTICS_QUERIES.sql` 中的查询
- 适合查看完成率、分布等统计

### 需要集成到应用：
👉 **使用代码查询**（方法三）
- 在自己的应用或脚本中调用
- 适合构建自定义仪表板或自动化报告

---

## 快速开始

### 最简单的查看方式（推荐新手）：

1. 打开 Supabase Dashboard
2. 点击左侧 **"Table Editor"**
3. 选择 `test_results` 表
4. 查看表格底部的记录数，就是总测试数
5. 在 `completed_at` 列筛选 "is not null"，查看已完成数

### 需要详细统计时：

1. 打开 Supabase Dashboard
2. 点击左侧 **"SQL Editor"**
3. 复制 `ANALYTICS_QUERIES.sql` 中的查询
4. 粘贴并执行

---

## 总结

| 方法 | 难度 | 适用场景 | 推荐度 |
|------|------|----------|--------|
| Table Editor | ⭐ 简单 | 日常查看、浏览数据 | ⭐⭐⭐⭐⭐ |
| SQL Editor | ⭐⭐ 中等 | 统计计算、复杂查询 | ⭐⭐⭐⭐ |
| 代码查询 | ⭐⭐⭐ 较难 | 集成应用、自动化 | ⭐⭐⭐ |

**建议：日常使用 Table Editor，需要统计时用 SQL Editor。**
