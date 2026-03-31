# LABST 字段 Excel 导出小数问题修复

## 问题描述
LABST 字段在 ABAP OData V4 中定义为 `Edm.Decimal(13,3)` 类型（3位小数），但使用 MDC Table 自带的 Excel 导出功能后，数据显示为文本而非小数。

## 根本原因

### 1. 后端定义（正确）
```xml
<Property Name="LABST" Type="Edm.Decimal" Nullable="false" Precision="13" Scale="3"/>
```

### 2. 前端定义（错误）
**修复前** - `JSONPropertyInfo.js`:
```javascript
{
    name: "LABST",
    label: "LABST",
    path: "LABST",
    type: "sap.ui.model.type.Integer"  // ❌ 错误：定义为整数
}
```

**问题**:
- 类型不匹配：后端 Decimal(13,3) vs 前端 Integer
- MDC Table 导出时根据 PropertyInfo 的类型格式化数据
- Integer 类型导致 Excel 将数据识别为文本或整数，丢失小数位

## 修复方案

### 1. 修改 `JSONPropertyInfo.js` - 按照 Fiori 标准格式

**关键改进**:
- ✅ 移除 `name` 属性，只保留 `key`
- ✅ 使用 `sap.ui.model.type.Float` 而非 `odata.type.Decimal`（因为数据源是 JSONModel）
- ✅ 移除 `formatOptions` 和 `constraints`（这些在视图绑定时处理）
- ✅ 添加 `exportSettings` 配置 Excel 导出格式

```javascript
{
    key: "LABST",
    label: "LABST",
    path: "LABST",
    dataType: "sap.ui.model.type.Float",  // ✅ 使用 Float 类型（适用于 JSONModel）
    exportSettings: {
        label: "Unrestricted Stock",
        property: "LABST",
        type: "Number",               // Excel 导出为数值类型
        scale: 3,                     // 3位小数
        delimiter: true,              // 千位分隔符
        width: 15
    }
}
```

### 2. 修改 `Main.view.xml`

**修复前**:
```xml
<mdct:Column id="_IDGenColumn17" propertyKey="LABST" header="{i18n>Table.Column.Header.Project}">
    <Text text="{Stocks>LABST}"/>
</mdct:Column>
```

**修复后**:
```xml
<mdct:Column id="_IDGenColumn17" propertyKey="LABST" header="{i18n>Table.Column.Header.LABST}">
    <Text id="_IDGenText17" text="{
        path: 'Stocks>LABST',
        type: 'sap.ui.model.odata.type.Decimal',
        formatOptions: {
            minFractionDigits: 3,      // 最少显示3位小数
            maxFractionDigits: 3       // 最多显示3位小数
        },
        constraints: {
            precision: 13,
            scale: 3
        }
    }"/>
</mdct:Column>
```

### 3. 添加国际化文本 `i18n.properties`

```properties
Table.Column.Header.LABST=Unrestricted Stock
```

## 关键改进点

### ✅ 统一字段定义（参考 Fiori 标准）
所有 PropertyInfo 字段现在使用统一格式：
- 使用 `key` 属性（移除 `name`）
- 使用 `dataType` 而非 `type`
- 使用完整的 UI5 类型路径（如 `sap.ui.model.type.String`）
- 添加 `exportSettings` 配置 Excel 导出

### ✅ 正确的数值类型配置（JSONModel）
```javascript
dataType: "sap.ui.model.type.Float"  // 使用 Float 而非 OData Decimal
exportSettings: {
    type: "Number",     // Excel 导出为数值
    scale: 3,           // 小数位数
    delimiter: true     // 千位分隔符
}
```

**重要**: 因为数据源是 **JSONModel** 而非 ODataModel，所以使用 `sap.ui.model.type.Float` 而不是 `sap.ui.model.odata.type.Decimal`

### ✅ 视图中的类型绑定
```javascript
formatOptions: {
    minFractionDigits: 3,  // 强制显示3位小数（如 123.000）
    maxFractionDigits: 3   // 最多3位小数
}
```

## Excel 导出行为

### 修复前
- Excel 单元格格式：文本
- 显示值：`123` 或 `"123.456"`（带引号）
- 无法进行数值计算

### 修复后
- Excel 单元格格式：数值（3位小数）
- 显示值：`123.456`
- 可以直接进行 SUM、AVERAGE 等计算

## 其他数字字段建议

如果项目中还有其他数字字段（如 QUANTITY），也建议检查类型定义：

```javascript
// QUANTITY 当前定义为 String（根据后端 metadata）
{
    key: "QUANTITY",
    name: "QUANTITY",
    label: "Quantity",
    path: "QUANTITY",
    dataType: "sap.ui.model.type.String"  // 后端定义为 Edm.String
}

// 如果后端改为 Decimal，应修改为：
{
    key: "QUANTITY",
    name: "QUANTITY",
    label: "Quantity",
    path: "QUANTITY",
    dataType: "sap.ui.model.odata.type.Decimal",
    formatOptions: {
        precision: 20,
        scale: 3,
        parseAsString: false
    }
}
```

## 测试验证

1. **界面显示测试**
   - 启动应用
   - 执行查询
   - 检查 LABST 列是否正确显示3位小数（如 `123.456`）

2. **Excel 导出测试**
   - 点击表格的导出按钮
   - 打开导出的 Excel 文件
   - 验证 LABST 列：
     - 单元格格式应为"数值"
     - 显示3位小数
     - 可以进行数值计算（如 SUM）

3. **边界值测试**
   - 测试 0 值：应显示 `0.000`
   - 测试大数值：如 `9999999999.999`
   - 测试负数：如 `-123.456`

## 相关 UI5 文档

- [sap.ui.model.odata.type.Decimal](https://ui5.sap.com/#/api/sap.ui.model.odata.type.Decimal)
- [MDC Table Export](https://ui5.sap.com/#/api/sap.ui.mdc.Table%23methods/exportData)
- [PropertyInfo Configuration](https://ui5.sap.com/#/api/sap.ui.mdc.util.PropertyInfo)
