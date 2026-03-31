sap.ui.define([
], function() {
	"use strict";

	/* Property Example:
	{
	  "rank": 1,
	  "name": "Mount Everest",
	  "height": 8848,
	  "prominence": 8848,
	  "range": "Mahalangur Himalaya",
	  "coordinates": "27°59'17''N 86°55'31''E",
	  "parent_mountain": "-",
	  "first_ascent": 1953,
	  "countries": "Nepal, China"
	} */

	const aPropertyInfos =  // 表格字段元数据配置，与XML视图中的列定义一一对应
  [
        // 1. Message列
        {
            name: "message",           // 对应propertyKey
            label: "Message",          // 对应header
            path: "message",    // 数据绑定路径
            type: "string"             // 数据类型（文本）
        },
        // 2. Category列
        {
            name: "Category",
            label: "Category",
            path: "Category",
            type: "string"
        },
        // 3. zSchedule列
        {
            name: "zSchedule",
            label: "Schedule",
            path: "zSchedule",
            type: "string"
        },
        // 4. matnr列（物料编号）
        {
            name: "matnr",
            label: "Material Number",
            path: "matnr",
            type: "string"
        },
        // 5. MAKTX列（物料描述）
        {
            name: "MAKTX",
            label: "Material Description",
            path: "MAKTX",
            type: "string"
        },
        // 6. LOCATIONTYPE列（位置类型）
        {
            name: "LOCATIONTYPE",
            label: "Location Type",
            path: "LOCATIONTYPE",
            type: "string"
        },
        // 16. LOCATIONTYPE列（位置类型）
        {
            name: "LGNUM",
            label: "Warehouse Num",
            path: "LGNUM",
            type: "string"
        },
        // 17. LOCATIONTYPE列（位置类型）
        {
            name: "LGTYP",
            label: "Storage Type",
            path: "LGTYP",
            type: "string"
        },
   
        // 7. LOCATION列（位置）
        {
            name: "LOCATION",
            label: "Location",
            path: "LOCATION",
            type: "string"
        },
        // 8. QUANTITY列（数量）
        {
            name: "QUANTITY",
            label: "Quantity",
            path: "QUANTITY",
            type: "number" ,            // 数据类型（数值）
            exportSettings: {
            label: "Quantity",
            property: "QUANTITY",
            type: "Number",      // Excel 数值格式
            scale: 3,            // 3位小数
            delimiter: true,     // 千位分隔符
            width: 15
      } 
        },
        // 9. Counter列（计数器，可输入数字）
        {
            name: "Counter",
            label: "Counter",
            path: "Counter",
            type: "int"                // 数据类型（整数）
        },
        // 10. Deadline列（截止日期时间）
        {
            name: "Deadline",
            label: "Deadline",
            path: "Deadline",
            type: "datetime"           // 数据类型（日期时间）
        },
        // 11. ZCOGI列（COGI标识）
        {
            name: "ZCOGI",
            label: "COGI Indicator",
            path: "ZCOGI",
            type: "string",
            exportSettings: {
            label: "COGI Indicator",
            property: "ZCOGI",
            type: "Number",      // Excel 数值格式
            scale: 3,            // 3位小数
            delimiter: true,     // 千位分隔符
            width: 15
      }  
        },
        // 12. lifnr列（供应商编号）
        {
            name: "lifnr",
            label: "Vendor Number",
            path: "lifnr",
            type: "string"
        },
        // 13. KUNNR列（客户编号）
        {
            name: "KUNNR",
            label: "Customer Number",
            path: "KUNNR",
            type: "string"
        },
        // 14. DISPO列（MRP控制器）
        {
            name: "DISPO",
            label: "MRP Controller",
            path: "DISPO",
            type: "string"
        },
        // 15. Project列（项目）
        {
            name: "Project",
            label: "Project",
            path: "Project",
            type: "string"
        }
        // 16. zComment列（备注）
        // {
        //     name: "zComment",
        //     label: "Comment",
        //     path: "zComment",
        //     type: "string"             // 长文本类型
        // }

        
    ];

	return aPropertyInfos;
}, /* bExport= */false);