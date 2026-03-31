# 表格数据加载失败问题分析与修复

## 🔴 **问题现象**
点击查询按钮后，表格无法加载数据，显示空白。

---

## 🔍 **根本原因分析**

### **问题代码位置**
`webapp/delegate/JSONTableDelegate.js` 第 28-36 行：

```javascript
const _createColumn = (sId, oPropertyInfo) => {
    return new Column(sId, {
        propertyKey: oPropertyInfo.key,
        header: oPropertyInfo.label,
        template: new Text({
            text: {
                path: "Stocks>" + oPropertyInfo.path,
                type: oPropertyInfo.dataType  // ❌ 问题：传递字符串而非类型实例
            }
        })
    });
};
```

### **错误原因**

1. **类型绑定错误**: `type` 属性需要的是 **类型实例** 或 **类型构造函数**
2. **传递了字符串**: `oPropertyInfo.dataType` 的值是字符串（如 `"sap.ui.model.type.String"`）
3. **UI5 无法识别**: 当传递字符串时，UI5 无法正确解析类型，导致绑定失败

### **错误示例**
```javascript
// ❌ 错误：传递字符串
type: "sap.ui.model.type.String"

// ✅ 正确：传递类型实例
type: new sap.ui.model.type.String()

// ✅ 或者：不指定类型，让 UI5 自动处理
// 不设置 type 属性
```

---

## ✅ **解决方案**

### **方案 1: 移除类型绑定（推荐 - 最简单）**

**原理**: 
- 对于 JSONModel，UI5 可以自动推断数据类型
- 字符串显示为文本，数字显示为数字
- Excel 导出通过 `exportSettings` 控制格式

**修改内容**:

#### 1. 修改 `JSONPropertyInfo.js`
移除所有 `dataType` 属性，只保留 `exportSettings`：

```javascript
{
    key: "LABST",
    label: "LABST",
    path: "LABST",
    // ✅ 移除 dataType
    exportSettings: {
        label: "Unrestricted Stock",
        property: "LABST",
        type: "Number",    // Excel 导出格式
        scale: 3,          // 小数位数
        delimiter: true,   // 千位分隔符
        width: 15
    }
}
```

#### 2. 修改 `JSONTableDelegate.js`
移除 `type` 绑定：

```javascript
const _createColumn = (sId, oPropertyInfo) => {
    return new Column(sId, {
        propertyKey: oPropertyInfo.key,
        header: oPropertyInfo.label,
        template: new Text({
            text: {
                path: "Stocks>" + oPropertyInfo.path
                // ✅ 移除 type 属性
            }
        })
    });
};
```

---

### **方案 2: 动态实例化类型（复杂但精确）**

如果需要精确控制类型格式（如强制显示3位小数），可以动态加载类型：

```javascript
const _createColumn = (sId, oPropertyInfo) => {
    const oBindingInfo = {
        path: "Stocks>" + oPropertyInfo.path
    };
    
    // 如果定义了 dataType，动态加载并实例化
    if (oPropertyInfo.dataType) {
        return new Promise((resolve) => {
            sap.ui.require([oPropertyInfo.dataType.replace(/\./g, "/")], (TypeClass) => {
                oBindingInfo.type = new TypeClass(
                    oPropertyInfo.formatOptions,
                    oPropertyInfo.constraints
                );
                resolve(new Column(sId, {
                    propertyKey: oPropertyInfo.key,
                    header: oPropertyInfo.label,
                    template: new Text({ text: oBindingInfo })
                }));
            });
        });
    }
    
    return new Column(sId, {
        propertyKey: oPropertyInfo.key,
        header: oPropertyInfo.label,
        template: new Text({ text: oBindingInfo })
    });
};
```

**注意**: 这种方式需要修改 `addItem` 方法以支持异步返回。

---

## 📊 **Excel 导出格式控制**

### **关键配置: exportSettings**

Excel 导出格式完全由 `exportSettings` 控制，与 `dataType` 无关：

```javascript
exportSettings: {
    label: "Unrestricted Stock",  // Excel 列标题
    property: "LABST",             // 数据字段
    type: "Number",                // Excel 单元格格式
    scale: 3,                      // 小数位数
    delimiter: true,               // 千位分隔符
    width: 15                      // 列宽
}
```

### **支持的 type 值**
- `"String"`: 文本格式
- `"Number"`: 数值格式
- `"DateTime"`: 日期时间格式
- `"Date"`: 日期格式
- `"Time"`: 时间格式
- `"Boolean"`: 布尔值

---

## 🎯 **修复后的效果**

### **表格显示**
- ✅ 数据正常加载
- ✅ 字符串字段显示文本
- ✅ 数字字段显示数值
- ✅ LABST 显示小数（如 `123.456`）

### **Excel 导出**
- ✅ LABST 列导出为数值格式
- ✅ 显示3位小数
- ✅ 包含千位分隔符
- ✅ 可以直接进行 SUM/AVERAGE 计算

---

## 🧪 **测试验证**

### 1. **表格数据加载测试**
```javascript
// 在控制器的 onAdvancedSearch 方法末尾添加
console.log("表格数据:", this.getView().getModel("Stocks").getData());
console.log("表格行数:", oTable.getRows().length);
```

### 2. **Excel 导出测试**
1. 点击表格导出按钮
2. 打开 Excel 文件
3. 检查 LABST 列：
   - 单元格格式应为"数值"
   - 显示3位小数
   - 有千位分隔符

### 3. **浏览器控制台检查**
确认没有以下错误：
```
❌ Type 'sap.ui.model.type.String' could not be loaded
❌ Binding error: ...
❌ TypeError: ... is not a constructor
```

---

## 📝 **关键要点总结**

### ✅ **正确做法**
1. **PropertyInfo**: 只定义 `key`, `label`, `path`, `exportSettings`
2. **Delegate**: 简单绑定，不指定 `type`
3. **Excel 格式**: 通过 `exportSettings.type` 控制

### ❌ **错误做法**
1. 在 PropertyInfo 中定义 `dataType: "sap.ui.model.type.String"`
2. 在 Delegate 中使用 `type: oPropertyInfo.dataType`
3. 混淆 UI5 类型系统和 Excel 导出格式

### 💡 **核心原则**
- **数据绑定**: 让 UI5 自动推断类型（JSONModel）
- **Excel 导出**: 通过 `exportSettings` 显式控制格式
- **特殊格式**: 在视图 XML 中单独配置（如 LABST 列的 Decimal 绑定）

---

## 🔗 **相关文件**

- `webapp/model/metadata/JSONPropertyInfo.js` - 字段元数据定义
- `webapp/delegate/JSONTableDelegate.js` - 表格委托
- `webapp/ext/main/Main.view.xml` - LABST 列的特殊绑定
- `webapp/ext/main/Main.controller.js` - 数据查询逻辑

---

## 📚 **参考文档**

- [UI5 Type System](https://ui5.sap.com/#/topic/ac56d92162ed47ff858fdf1ce26c18c4)
- [MDC Table Export](https://ui5.sap.com/#/api/sap.ui.mdc.Table%23methods/exportData)
- [PropertyInfo Configuration](https://ui5.sap.com/#/api/sap.ui.mdc.util.PropertyInfo)
