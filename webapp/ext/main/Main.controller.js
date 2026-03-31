sap.ui.define(
  [
    "sap/fe/core/PageController",
    "sap/ui/core/Messaging",
    "sap/ui/core/message/Message",
    "sap/ui/core/message/MessageType",
    "sap/ui/mdc/table/GridTableType",
    "sap/ui/mdc/table/ResponsiveTableType",
    "sap/ui/mdc/enums/TableRowCountMode",
    "sap/ui/mdc/enums/TableGrowingMode",
    "sap/m/library",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/mdc/p13n/StateUtil",
  ],
  function (
    PageController,
    Messaging,
    Message,
    MessageType,
    GridTableType,
    ResponsiveTableType,
    TableRowCountMode,
    TableGrowingMode,
    mLibrary,
    coreLibrary,
    Fragment,
    JSONModel,
    StateUtil
  ) {
    "use strict";
    const PopinLayout = mLibrary.PopinLayout;
    const Priority = coreLibrary.Priority;
    var showmessage = null;
    var iSelectedIndex1 = 0;
    var otableColumns = null;
    return PageController.extend("zwm311countreq.ext.main.Main", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       * @memberOf zwm311countingrequest.ext.main.Main
       */
      onInit: function () {
        PageController.prototype.onInit.apply(this, arguments); // needs to be called to properly initialize the page controller
        const oView = this.getView();
        // set message model
        oView.setModel(Messaging.getMessageModel(), "message");
        //     // 获取UI Model
        const oViewModel = this.getView().getModel("ui");
        // 修改模型中的属性值
        oViewModel.setProperty("/isEditable", true);
        //获取Model
        const oModel = this.getAppComponent().getModel();
        this.setdefaultvalue(oModel);
        this.setFilterFielddstatus(0);
        var btcontent = this.getView().byId("FilterBar").getContent();
        //修改filterbar Go按钮文本
        btcontent._btnSearch.mProperties.text = "Exectue";
        //隐藏filterbar Go按钮
        btcontent._btnSearch.mProperties.visible = true;
        btcontent._bSearchPressed = false;
        btcontent._bFireSearch = false;
        btcontent._btnAdapt.mProperties.visible = false;
        const oTable = this.getView().byId("table");
        oTable.setType(this.getGridTableType());

        const oViewModeltable = new JSONModel({
          respType: {
            detailsButtonSetting: [Priority.High],
            growingMode: TableGrowingMode.Basic,
            popinLayout: PopinLayout.Block,
            showDetailsButton: true,
          },
          gridType: {
            fixedColumnCount: 0,
            rowCount: 10,
            rowCountMode: TableRowCountMode.Auto,
            scrollThreshold: -1,
            selectionLimit: 0,
            showHeaderSelector: true,
          },
          enums: {
            rowCountMode: this.enumToObject(TableRowCountMode),
            growingMode: this.enumToObject(TableGrowingMode),
            popinLayout: this.enumToObject(PopinLayout),
            priority: this.enumToObject(Priority),
          },
        });

        this.getView().setModel(oViewModeltable, "view");
      },
      onExit: function () {
        //  // 清理资源
        if (this.oView) {
          const oView = this.oView;
          // 定义所有需要清理的控件 ID
          const aControlIds = [
            "FilterBarVMWithTable",
            "_IDGenDynamicPageTitle1",
            "_IDGenTitle",
            "_IDGenDynamicPageHeader1",
            "idSelectionContainer",
            "idSelectionRadioGroup",
            "idOption1Radio",
            "idOption2Radio",
            "FilterBar",
            "_IDGenVBox1",
            "_IDGenVBox2",
            "table",
            "CreateRequestdButton",
            "CreateRequestdButton1",
            "_IDGenColumn00",
            "_IDGenColumn0",
            "_IDGenColumn1",
            "_IDGenColumn2",
            "_IDGenColumn3",
            "_IDGenColumn4",
            "_IDGenColumn5",
            "_IDGenColumn6",
            "_IDGenColumn7",
            "_IDGenColumn8",
            "_IDGenColumn9",
            "_IDGenColumn10",
            "_IDGenColumn11",
            "_IDGenColumn12",
            "_IDGenColumn13",
            "_IDGenColumn14",
            "_IDGenColumn15",
            "_IDGenColumn16",
            "_IDGenCheckBox1",
            "_IDGenObjectStatus",
            "_IDGenText1",
            "_IDGenText2",
            "_IDGenText3",
            "_IDGenText4",
            "_IDGenText5",
            "_IDGenText6",
            "_IDGenText7",
            "_IDGenInput8",
            "_IDGenDateTimePicker9",
            "_IDGenText10",
            "_IDGenText11",
            "_IDGenText12",
            "_IDGenText13",
            "_IDGenText14",
            "_IDGenText15",
            "_IDGenText16",
            "_IDGenHBox",
            "_IDGenButton1",
            "idLongTextLabel",
            "idLongTextInput",
            "_IDGenOverflowToolbar1",
            "messageButtonId",
            "_IDGenToolbarSpacer",
          ];

          // 逐个销毁控件
          aControlIds.forEach(function (sId) {
            try {
              const oControl = oView.byId(sId);

              if (!oControl || oControl.bIsDestroyed) {
                return;
              }

              // 销毁控件
              oControl.destroy();
              console.log(`✓ ${sId} 已销毁`);
            } catch (e) {
              console.error(`销毁 ${sId} 失败：`, e);
            }
          });

          console.log("资源清理完成");
          //const odynPage =  this.getView().byId("FilterBarVMWithTable")
          // this.oView.destroy();
          //  odynPage.destroy();
          // this._oAppComponent.destroy();
        }
      },
      // onBatchProcess: async function (oEvent) {
      //   var ofbar = this.byId("FilterBar");
      // },
      setdefaultvalue: async function (oModel) {
        //Odata 设置
        const sPath = "/DefaultValue";
        // 1. 生成唯一组ID（业务语义+时间戳）
        const sGroupId = "get_defaultvalues" + new Date().getTime();
        var newodatabing = oModel.bindList(sPath);

          newodatabing.sGroupId = sGroupId;
        // newodatabing.sUpdateGroupId = sGroupId;
        //   this.getView().setBusy(true);
        //查询
        // await newodatabing
        //   .requestContexts(0, 1) // 获取前100条记录
        //   .then((aContexts) => {
        //     const defaultdatas = aContexts.map((oContext) => {
        //       return oContext.getObject(); // 获取每条数据
        //     });
        //     console.log("默认值:", defaultdatas);
        //     // 处理第一条数据（若存在）
        //     if (defaultdatas && defaultdatas.length > 0) {
        //       const firstData = defaultdatas[0]; // 获取第一条数据
        //       var ofbar = this.byId("FilterBar");
        //       ofbar.setFilterValues("werks", "EQ", firstData.werks);
        //       ofbar.setFilterValues("ZSite", "EQ", firstData.zsite);
        //     }
        //   })
        //   .catch((oError) => {
        //     //      this.getView().setBusy(false);
        //     console.error("读取失败:", oError);
        //     MessageBox.error("获取默认数据失败");
        //   });
        try {
          const oPromise =  newodatabing.requestContexts(0, 1);
          oModel.submitBatch(sGroupId); 
            // 3. 等待结果
          const aContexts = await oPromise;
          const defaultdatas = aContexts.map((oContext) => {
            return oContext.getObject();
          });
          console.log("默认值:", defaultdatas);

          if (defaultdatas && defaultdatas.length > 0) {
            const firstData = defaultdatas[0];
            var ofbar = this.byId("FilterBar");
            ofbar.setFilterValues("werks", "EQ", firstData.werks);
            ofbar.setFilterValues("ZSite", "EQ", firstData.zsite);
          }
        } catch (oError) {
          console.error("读取失败:", oError);
          MessageBox.error("获取默认数据失败");
        }
      },
      onAfterRendering: function () {
        const oTable = this.getView().byId("table");
        otableColumns = oTable.getColumns();
        this.SettableColumns(oTable, 0);
      },
      /** 设置table显示哪些列 */
      SettableColumns: function (oTable, selindex) {
        oTable.removeAllColumns();
        otableColumns.forEach((oColumn, oindex) => {
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn00"); //复选框选择列
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn0"); //Message
          if (selindex !== 0 && selindex !== 2) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn1"); //Category
          }
          if (selindex !== 0 ) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn2"); //Schedule
          }
          if (selindex === 1 || selindex === 3 || selindex === 4) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn3"); //MaterialNumber
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn4"); //MaterialDescription
          }
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn5"); //LocationType
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn15"); //Warehouse Num
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn16"); //Storage Type
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn6"); //Location
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn7"); //Quantity
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn8"); //Counter
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn9"); //Deadline
          this.AddTableColumn(oTable, oColumn, "_IDGenColumn10"); //COGIIndicator
          if (selindex === 0) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn11"); //VendorNumber
          }
          if (selindex === 0) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn12"); //CustomerNumber
          }
          if (selindex === 1 || selindex === 3 || selindex === 4) {
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn13"); //MRPController
            this.AddTableColumn(oTable, oColumn, "_IDGenColumn14"); //Project
          }
        });
      },
      AddTableColumn: function (oTable, oColumn, targetLocalId) {
        const oid = "zwm311countreq::StocksMain--";
        const targetFullId = oid + targetLocalId;
        if (oColumn.getId() === targetFullId) {
          oTable.addColumn(oColumn);
        }
      },
      /**
       * 获取OData V4服务的计数（$count）
       * @param {Object} oModel - OData V4模型实例
       * @param {string} sPath - 计数路径，如"/Stocks/$count"
       * @returns {Promise<number>} 成功返回count值，失败返回0
       */
      fetchcountData: async function (oModel, sPath) {
        try {
          // 创建上下文绑定（针对单一值如$count）
          const newContextBinding = oModel.bindContext(sPath);
          // 请求计数数据（OData V4通过requestObject获取单一值）
          const countValue = await newContextBinding.requestObject();

          // 转换为数字（OData $count通常返回字符串类型）
          const count = Number(countValue);

          // 验证计数有效性
          if (isNaN(count) || count < 0) {
            console.warn("获取的计数无效，返回0", countValue);
            return 0;
          }

          // 成功返回计数
          return count;
        } catch (oError) {
          // 错误处理：记录日志并返回0
          console.error("获取计数失败:", oError.message || "未知错误");
          return 0;
        }
      },
      fetchcountData1: async function (newodatabing) {
        try {
          // 创建上下文绑定（针对单一值如$count）
          // 请求当前页数据（使用currentPageSize避免无效请求）
          const aContexts = await newodatabing
            .requestContexts(0, 1)
            // .requestContexts(0, -1)
            .catch((oError) => {});
          // 请求计数数据（OData V4通过requestObject获取单一值）
          const countValue = await newodatabing.getCount();

          // 转换为数字（OData $count通常返回字符串类型）
          const count = Number(countValue);

          // 验证计数有效性
          if (isNaN(count) || count < 0) {
            console.warn("获取的计数无效，返回0", countValue);
            return 0;
          }

          // 成功返回计数
          return count;
        } catch (oError) {
          // 错误处理：记录日志并返回0
          console.error("获取计数失败:", oError.message || "未知错误");
          return 0;
        }
      },
      ClearCountingTable: async function () {
        //点击查询时先清空表数据
        // 2. 初始化基础数据结构
        const spacedata = {
          Stocks: [], // 空数组
        };
        // 2. 创建JSONModel实例，传入数据
        const spacedataModel = new JSONModel(spacedata);

        // 3. 将模型设置到视图（或组件），模型名称设为"Stocks"
        // （需与delegate中bindingPath: 'Stocks>/Stocks'的命名空间一致）
        this.getView().setModel(spacedataModel, "Stocks");
      },
      onAdvancedSearch: async function (oEvent) {
        const oTable = this.getView().byId("table");
        oTable.setBusy(true);
        var ofilter = this.byId("FilterBar");
        var oView = this.getView();
        var oModel = oView.getModel();
        const otable = this.byId("Table");
        const sPath = "/Stocks";
        //移除消息
        Messaging.removeAllMessages();
        //点击查询时先清空表数据
        await this.ClearCountingTable();

        // 1. 绑定到新实体路径（即使实体不存在）
        var selfilter = ofilter.getFilters();
        // 先判断数组是否存在且为有效数组（避免报错）
        let allaFilters = [];
        if (!Array.isArray(selfilter.filters[0].aFilters)) {
          allaFilters = [
            {
              sPath: selfilter.filters[0].sPath,
              sOperator: selfilter.filters[0].sOperator,
              oValue1: selfilter.filters[0].oValue1,
            },
          ];
        } else {
          allaFilters = selfilter.filters[0].aFilters;
        }

        // 从 allaFilters 中删除不在 this._addedFilters 中的字段
        if (this._addedFilters && Array.isArray(this._addedFilters)) {
          allaFilters = allaFilters.filter((oFilter) => {
            // 保留在 _addedFilters 中的字段
            return this._addedFilters.includes(oFilter.sPath);
          });
          console.log("过滤后的 filters:", allaFilters);
        }
        const ogroup = this.byId("idSelectionRadioGroup");
        const iSelectedIndex = ogroup.getSelectedIndex();
        const newFilterData = {
          sPath: "seltype",
          sOperator: "EQ",
          oValue1: iSelectedIndex.toString(),
        };
        allaFilters.push(newFilterData);
        //cccount 时选择的GROUP TYPE
        const newFilterData1 = {
          sPath: "selgrouptype",
          sOperator: "EQ",
          oValue1: iSelectedIndex1.toString(),
        };
        allaFilters.push(newFilterData1);

        // newodatabing.filter(selfilter.filters);
        var newodatabing = oModel.bindList(
          sPath,
          undefined,
          undefined,
          allaFilters,
          {
            $count: true,
          }
        );
        var newodatabingcount = oModel.bindList(
          sPath,
          undefined,
          undefined,
          allaFilters,
          {
            $count: true,
          }
        );
        newodatabing.aFilters = allaFilters;
        newodatabingcount.aFilters = allaFilters;

        //const total = await this.fetchcountData(this.getView().getModel(), "/Stocks/$count");
        const total = await this.fetchcountData1(newodatabingcount);

        var allreqdata = await this.fetchAllData(newodatabing, total);
        //  console.log("返回数据:", allreqdata);
        // 2. 初始化基础数据结构
        const CountingData = {
          Stocks: allreqdata, // 空数组，用于循环填充300条数据
        };

        // 2. 创建JSONModel实例，传入数据
        const CountingDataModel = new JSONModel(CountingData);

        // 3. 将模型设置到视图（或组件），模型名称设为"Stocks"
        // （需与delegate中bindingPath: 'Stocks>/Stocks'的命名空间一致）
        this.getView().setModel(CountingDataModel, "Stocks");

        // 检查数组中是否有至少一条数据的selected为true
        const bHasSelected = CountingData.Stocks.some(
          (item) => item.selected === true
        );

        // 更新按钮的可点击状态
        this.getView().byId("CreateRequestdButton").setEnabled(bHasSelected);
        oTable.setBusy(false);
        // 打印模型完整数据，检查是否有 /Stocks 路径及数组数据
        //console.log("Stocks 模型完整数据：", oMountainModel.getData());
        // 打印 /Stocks 路径下的数据，确认非空
        //console.log("Stocks>/Stocks 路径数据：", oMountainModel.getProperty("/Stocks"));

        //查询
        // var aContexts =  await   newodatabing.requestContexts(0, 10000) // 获取前100条记录
        //     .then((aContexts) => {

        //   //    otable.setModel(aContexts.getModel());
        //     const aProducts = aContexts.map((oContext) => {
        //         return oContext.getObject(); // 获取每条数据
        //     });
        //     console.log("产品列表:", aProducts);

        //     })
        //     .catch((oError) => {
        //      console.error("读取失败:");
        //     // MessageBox.error("获取数据失败");
        //     });

        // 检查上下文所属模型是否与表格模型一致
      },
      /**
       * 批量查询数据，根据传入的总条数count计算需要调用的次数
       * @param {Object} newodatabing - OData绑定对象
       * @param {number} count - 总数据条数（通过fetchcountData获取）
       * @returns {Promise<Array>} 所有查询到的数据集合
       */
      fetchAllData: async function (newodatabing, count) {
        const allData = [];
        const pageSize = 5000;
        //var oheaderContext = await newodatabing.getHeaderContext();
        //var ores = await oheaderContext.requestObject();

        //var count1 = await newodatabing.getCount();
        // 边界处理：如果总条数为0，直接返回空数组
        if (count <= 0) {
          console.log("总条数为0，无需获取数据");
          return allData;
        }

        // 计算总页数（向上取整）
        const totalPages = Math.ceil(count / pageSize);
        console.log(`共需获取 ${count} 条数据，分 ${totalPages} 次请求`);

        try {
          // 按计算出的总页数循环，精确控制请求次数
          for (let page = 0; page < totalPages; page++) {
            const skip = page * pageSize;
            // 计算当前页实际需要请求的条数（最后一页可能不足5000）
            const currentPageSize = Math.min(pageSize, count - skip);

            console.log(
              `开始获取第 ${
                page + 1
              }/${totalPages} 页，从位置 ${skip} 开始，获取 ${currentPageSize} 条`
            );

            // 请求当前页数据（使用currentPageSize避免无效请求）
            const aContexts = await newodatabing
              .requestContexts(skip, currentPageSize)
              // .requestContexts(0, -1)
              .catch((oError) => {
                console.error(`第 ${page + 1} 页读取失败:`, oError);
                throw new Error(`第 ${page + 1} 页数据获取失败`); // 抛出错误终止循环
              });

            // 处理空数据情况（避免后续map报错）
            if (!aContexts || aContexts.length === 0) {
              console.warn(`第 ${page + 1} 页未返回数据，提前终止`);
              break;
            }
            var oheaderContext = await newodatabing.getHeaderContext();
            var ores = await oheaderContext.requestObject();

            var count1 = await newodatabing.getCount();
            // 转换为数据对象
            const currentBatch = aContexts.map((oContext) =>
              oContext.getObject()
            );
            allData.push(...currentBatch);

            console.log(
              `第 ${page + 1} 页获取完成，累计获取 ${
                allData.length
              }/${count} 条`
            );

            // 额外校验：如果实际累计数已达到总条数，提前结束
            if (allData.length >= count) {
              console.log("实际数据已满足总条数，提前完成");
              break;
            }
          }

          console.log(
            `所有数据获取完成，共获取 ${allData.length} 条（预期 ${count} 条）`
          );
          return allData;
        } catch (oError) {
          console.error("批量查询过程中发生错误：", oError);
          throw oError; // 抛出错误供调用方处理
        }
      },
      // Table row selection handler
      onSelectionChange: function (oEvent) {
        const oTable = oEvent.getSource();
        const aSelectedItems = oTable?.getSelectedContexts();
        const oCreateBtn = this.byId("CreateRequestdButton");

        if (aSelectedItems.length > 0) {
          oCreateBtn.setEnabled(true);
        } else {
          oCreateBtn.setEnabled(false);
        }
      },
      oncustomSearch: function (oEvent) {
        var ofilter = this.byId("FilterBar");
        var oView = this.getView();
        // var oModel = oView.getModel();
        // const aBindings = oModel.getAllBindings();
        //   const aTargetBindings = aBindings.filter((oBinding) => {
        //   return oBinding.getPath() === "/Stocks";
        //   });
        // var otablebinding = aTargetBindings[0];
        const otable = this.byId("Table");
        var oModel = otable.getModel();
        const sPath = "/Stocks";
        // 1. 绑定到新实体路径（即使实体不存在）
        var Otablebind = oModel.createBindingContext(sPath);
        //  otable.getContent().bindContext(Otablebind);
        //   otable.refresh();
        // var newodatabing = oModel.bindList(sPath);
        //   //查询
        //   newodatabing.requestContexts(0, 10000) // 获取前100条记录
        //   .then((aContexts) => {
        //   const aProducts = aContexts.map((oContext) => {

        //       return oContext.getObject(); // 获取每条数据
        //   });
        //   console.log("产品列表:", aProducts);

        //   })
        //   .catch((oError) => {
        //   console.error("读取失败:", oError);
        //   MessageBox.error("获取数据失败");
        //   });
      },
      getFilterValueSign: function (aFilters, filtername) {
        // 提取指定字段（如"Status"）的筛选值
        const sTargetField = "Status"; // 目标字段名
        let oTargetValue = null;

        // 遍历筛选条件，找到后立即终止
        aFilters.some((oFilter) => {
          // 单选值场景：直接匹配字段路径
          if (oFilter.sPath === filtername) {
            oTargetValue = oFilter.oValue1; // 单选值固定用getValue1()
            return true; // 找到后终止遍历
          }
          return false;
        });
        return oTargetValue;
      },
      onBatchProcess: async function (oEvent) {
        const oView = this.getView();
        // oView.setBusy(true);
        // 获取按钮实例
        const oButton = oEvent.getSource();
        // 禁用按钮，防止再次点击
        oButton.setEnabled(false);
        // 可选：设置按钮忙碌状态（显示加载指示器）
        oButton.setBusy(true);
        //判断是否弹出选择框
        const ogroup = this.byId("idSelectionRadioGroup");
        //   //var iSelectedIndex1 = 0;
        const iSelectedIndex = ogroup.getSelectedIndex();
        //   if (iSelectedIndex == 1) {
        //     const oAction = await this.onShowDialog(oEvent);
        //     if (oAction.action == "Confirm") {
        //       iSelectedIndex1 =  oAction.selectedIndex;
        //    }else
        //    {
        //     oButton.setEnabled(true);
        //     oButton.setBusy(false);
        //     return;
        //    }
        //  }

        //获取Model
        const oModel = oView.getModel();
        const otable = this.byId("table");
        // 获取选中的行
        var selContexts = otable.getSelectedContexts();
        // 循环遍历每个选中的上下文
        // const seldatas = selContexts.map((oContext) => {
        //   const data = oContext.getObject();
        //   // 排除多个字段：message、field1、field2（根据实际需求替换）
        //   //  const { message, field1, field2, ...rest } = data;
        //   const {
        //     __EntityControl,
        //     SAP__Messages,
        //     "@$ui5.context.isSelected": _,
        //     ...rest
        //   } = data;
        //   return rest; // 返回不包含指定字段的新对象
        // });
        // 获取TextArea控件实例
        let zcomment_long = "";
        const oTextArea = this.getView().byId("idLongTextInput");
        if (oTextArea) {
          // 获取输入的文本
          zcomment_long = oTextArea.getValue();
          // console.log("从控件获取的长文本：", sLongText);
        }
        // 获取表格绑定的模型（假设表格数据绑定到"Stocks"模型，根据实际情况调整）
        const oStocksModel = oView.getModel("Stocks");
        const allTableData = oStocksModel.getProperty("/Stocks") || []; // 所有行数据

        // 筛选出 selected 为 true 的行，并排除不需要的字段
        const seldatas = allTableData
          // 第一步：先遍历原数组，记录每行的原始索引（关键！）
          .map((data, originalIndex) => ({
            data: data, // 原行数据
            originalIndex: originalIndex, // 记录在 allTableData 中的原始索引
          }))
          // 第二步：筛选 selected 为 true 的行（不影响原始索引）
          .filter((item) => item.data.selected === true)
          // 第三步：处理字段，将原始索引赋值给 zrowindex
          .map((item) => {
            const {
              __EntityControl,
              SAP__Messages,
              "@$ui5.context.isSelected": _,
              ...rest
            } = item.data; // 排除不需要的字段

            return {
              zrowindex: item.originalIndex, // 赋值为原数组的原始索引
              ...rest, // 合并其他有效字段
            };
          });
        //Odata 设置
        ///Stocks/
        const sPath =
          "com.sap.gateway.srvd.zr_wm311_counting_stocks.v0001.createrequest(...)";
        var ocontext = oModel.createBindingContext("/Stocks");
        var oActiveArtistContext = oModel
          .bindContext("/Stocks")
          .getBoundContext();
        // 1. 生成唯一组ID（业务语义+时间戳）
        const sGroupId = "CreateRequest" + new Date().getTime();
        // const oContextBinding = oModel.bindContext(sPath);
        // oContextBinding.invoke(sGroupId);
        const actionBinding = oModel.bindContext(sPath, oActiveArtistContext);
        actionBinding.setParameter("num", 1);
        //输入值
        var ofilter = this.byId("FilterBar");
        const selfilter = ofilter.getFilters();
        // 先判断数组是否存在且为有效数组（避免报错）
        let allaFilters = [];
        if (!Array.isArray(selfilter.filters[0].aFilters)) {
          allaFilters = [
            {
              sPath: selfilter.filters[0].sPath,
              sOperator: selfilter.filters[0].sOperator,
              oValue1: selfilter.filters[0].oValue1,
            },
          ];
        } else {
          allaFilters = selfilter.filters[0].aFilters;
        }

        var werks = "";
        werks = this.getFilterValueSign(allaFilters, "werks");
        var zsite = "";
        zsite = this.getFilterValueSign(allaFilters, "ZSite");
        actionBinding.setParameter("werks", werks);
        const sZsite = zsite == null ? "" : zsite; // == null 同时匹配 null 和 undefined
        actionBinding.setParameter("zsite", sZsite);

        actionBinding.setParameter("sel1", iSelectedIndex.toString());
        actionBinding.setParameter("sel2", iSelectedIndex1.toString());
        actionBinding.setParameter("zcomment", zcomment_long);

        actionBinding.setParameter("_Request", seldatas);

        // var oResults = await actionBinding.invoke().then(function () {
        //   // var oResults = actionBinding.getBoundContext().getObject();
        //   console.log(
        //     "Create 模型返回报文1:",
        //     actionBinding.getBoundContext().getObject()
        //   );

        //   return actionBinding.getBoundContext().getObject();
        // });
        //清除错误消息
        await Messaging.removeAllMessages();
        showmessage = false;
        var oResults = {};
        try {
          // 执行前设置busy状态
          // oBusyControl.setBusy(true);
          // Modern pattern
          // const oResult = await actionBinding.invoke();
          // 调用action并等待结果
          await actionBinding.execute(); //1.120版本没有invoke

          // 成功处理：获取返回数据
          oResults = actionBinding.getBoundContext().getObject();
          // console.log("Create 模型返回报文1:", oResults);

          //  return oResults;
        } catch (oError) {
          // 捕获异常：处理错误信息
          //    console.error("Action调用失败:", oError);
          // 可添加错误提示（如MessageBox.error）
          // MessageBox.error(`操作失败: ${oError.message || "未知错误"}`);
          // 获取消息按钮实例
          const oMessageButton = this.byId("messageButtonId");

          // 触发点击事件
          if (oMessageButton) {
            oMessageButton.firePress(); // 推荐方式（触发UI5事件）
            // 或者直接调用DOM点击
            // oMessageButton.getDomRef().click();
          }
          throw oError; // 可选：向上抛出错误供上层处理
        } finally {
          // 无论成功/失败，最终都解除busy状态
          oButton.setEnabled(true);
          oButton.setBusy(false);
        }
        // 无论成功/失败，都恢复按钮状态
        oButton.setEnabled(true);
        oButton.setBusy(false);
        //将更新结果回写到表格中
        oResults._Request.forEach((result) => {
          let spath = "/Stocks/" + result.zrowindex + "/message";
          oStocksModel.setProperty(spath, result.message);
          spath = "/Stocks/" + result.zrowindex + "/MSGTYPE";
          oStocksModel.setProperty(spath, result.MSGTYPE);
        });
        // 先判断集合是否存在，避免报错,有一条成功设置按钮不可点击
        const hasSEntry =
          oResults?._Request?.some((item) => item?.MSGTYPE === "S") ?? false;

        if (hasSEntry) {
          oButton.setEnabled(false);
        }
        // selContexts.forEach(function (oContext, index) {
        //   // 通过循环索引 index 关联 selContexts 与 _Request 数组
        //   // 安全访问 _Request 数组中对应索引的 message 字段
        //   const sMessage = oResults?._Request?.[index]?.message ?? "";
        //   // 设置到当前上下文的message属性
        //   oContext.setProperty("message", sMessage);
        //   const sMSGTYPE = oResults?._Request?.[index]?.MSGTYPE ?? "";
        //   oContext.setProperty("MSGTYPE", sMSGTYPE);
        // });

        // console.log(
        //   "Create 模型返回报文2:",
        //   actionBinding.getBoundContext().getObject()
        // );
        // await oModel.submitBatch(sGroupId)
        //   .then(() => {
        //       // OData V4中，提交后可以通过context获取最新数据
        //       // 强制从模型刷新上下文数据
        //       console.log("Create 模型返回报文2:", actionBinding.getBoundContext().getObject());
        //   })
        //   .then((oEntity) => {
        //       // 处理成功返回的实体数据
        //       // if (oEntity) {
        //       //   console.log("Create 返回报文:", oEntity);
        //       //     return ; // 可以继续传递实体数据供后续处理
        //       // } else {
        //       //     throw new Error("未获取到创建的实体数据");
        //       // }
        //   })
        //   .catch((oError) => {
        //     //  throw oError; // 可以选择继续抛出错误供上层处理
        //   })
        //   .finally(() => {

        //   });
        // }

        // 调用 Action（OData V4 必须用 callFunction）
        //   const oResult =  oModel.callFunction("/createrequest", {
        //     method: "POST", // Action 必须用 POST
        //     parameters: reqdata, // 传递参数
        //     groupId: sGroupId // 批处理组 ID
        //  //   submitMode: SubmitMode.Direct // 直接发送（不批量）
        //   });
        // console.log("返回结果：", oResult);
        //   var CreateRequestodatabing = oModel.bindList(sPath);

        //  // CreateRequestodatabing.sGroupId = sGroupId;
        //   //CreateRequestodatabing.sUpdateGroupId = sGroupId;
        //   const oContextcre = CreateRequestodatabing.create(reqdata);
        //  // var oContextcrereturn = oContextcre.invoke(sGroupId);
        //   oModel.submitBatch(sGroupId)
        //   .then(() => {
        //       // OData V4中，提交后可以通过context获取最新数据
        //       // 强制从模型刷新上下文数据
        //       console.log("Create 模型返回报文:", oContextcre.requestObject());
        //       oContextcre.destroy()
        //    //   return oContextcre.requestObject();
        //   })
        //   .then((oEntity) => {
        //       // 处理成功返回的实体数据
        //       // if (oEntity) {
        //       //   console.log("Create 返回报文:", oEntity);
        //       //     return ; // 可以继续传递实体数据供后续处理
        //       // } else {
        //       //     throw new Error("未获取到创建的实体数据");
        //       // }
        //   })
        //   .catch((oError) => {
        //     //  throw oError; // 可以选择继续抛出错误供上层处理
        //   })
        //   .finally(() => {

        //   });

        // selContexts.forEach(function(oContext) {
        // //  oContext.setProperty("message","测试");
        //   var oEntityData = oContext.getObject();
        // });
      },
      onRadioSelect: async function (oEvent) {
        //点击查询时先清空表数据
        await this.ClearCountingTable();

        const iSelectedIndex = oEvent.getParameter("selectedIndex");
        //console.error("选择索引:", iSelectedIndex);
        //判断是否弹出选择框
        //    const ogroup = this.byId("idSelectionRadioGroup");
        var currseltype = 0;

        if (iSelectedIndex == 1) {
          const oAction = await this.onShowDialog(oEvent);
          if (oAction.action == "Confirm") {
            iSelectedIndex1 = oAction.selectedIndex;
            // 假设从后端获取的状态码

            switch (iSelectedIndex1) {
              case 0:
                currseltype = 1;
                break;
              case 1:
                currseltype = 2;
                break;
              case 2:
                currseltype = 3;
                break;
              case 3:
                currseltype = 4;
                break;
              default:
                currseltype = 1;
            }
          } else {
            return;
          }
        }
        this.setFilterFielddstatus(currseltype);
        //设置表格显示的列
        const oTable = this.getView().byId("table");
        this.SettableColumns(oTable, currseltype);
      },
      zsetFilterFieldVisible: async function (oFilter, filterpath, zvisible) {
        await StateUtil.applyExternalState(oFilter.content, {
          items: [{ name: filterpath, zvisible }],
        });
      },

      setFilterFielddstatus: async function (selectedIndex) {
        var oFilter = this.byId("FilterBar");
        await oFilter.mAggregations.content.destroyFilterItems();

        // 记录添加过的 filter 列
        const addedFilters = [];

        let zvisible = true;
        let filterpath = "werks";
        await this.zsetFilterFieldVisible(oFilter, "werks", true);
        addedFilters.push("werks");

        await this.zsetFilterFieldVisible(oFilter, "ZSite", true);
        addedFilters.push("ZSite");

        if (selectedIndex === 1) {
          await this.zsetFilterFieldVisible(oFilter, "matnr", true);
          addedFilters.push("matnr");
        }
        if (selectedIndex === 0) {
          await this.zsetFilterFieldVisible(oFilter, "sobkz", true);
          addedFilters.push("sobkz");
        }
        if (selectedIndex === 0 || selectedIndex === 3) {
          await this.zsetFilterFieldVisible(oFilter, "lifnr", true);
          addedFilters.push("lifnr");
        }
        if (selectedIndex === 0 || selectedIndex === 4) {
          await this.zsetFilterFieldVisible(oFilter, "KUNNR", true);
          addedFilters.push("KUNNR");
        }
        if (selectedIndex === 0 || selectedIndex === 2 || selectedIndex === 1) {
          await this.zsetFilterFieldVisible(oFilter, "LGORT", true);
          addedFilters.push("LGORT");

          await this.zsetFilterFieldVisible(oFilter, "LGNUM", true);
          addedFilters.push("LGNUM");

          await this.zsetFilterFieldVisible(oFilter, "LGTYP", true);
          addedFilters.push("LGTYP");
        }
        if (selectedIndex === 0 || selectedIndex === 2) {
          await this.zsetFilterFieldVisible(oFilter, "LGPLA", true);
          addedFilters.push("LGPLA");
        }
        if (selectedIndex === 1) {
          await this.zsetFilterFieldVisible(oFilter, "DISPO", true);
          addedFilters.push("DISPO");

          await this.zsetFilterFieldVisible(oFilter, "Project", true);
          addedFilters.push("Project");
        }
        await this.zsetFilterFieldVisible(oFilter, "Counter", true);
        addedFilters.push("Counter");

        await this.zsetFilterFieldVisible(oFilter, "Deadline", true);
        addedFilters.push("Deadline");

        if (selectedIndex !== 0) {
          await this.zsetFilterFieldVisible(oFilter, "zSchedule", true);
          addedFilters.push("zSchedule");
        }

        // 保存添加过的 filter 列到实例变量
        this._addedFilters = addedFilters;
        console.log("已添加的 Filter 列:", addedFilters);
        //1.24版本以上使用
        // await oFilter.setFilterFieldVisible("werks", true);
        // await oFilter.setFilterFieldVisible("ZSite", true);
        // if (selectedIndex === 1) {

        // await oFilter.setFilterFieldVisible("matnr", true);
        // }
        // if (selectedIndex === 0) {
        //   await oFilter.setFilterFieldVisible("sobkz", true);
        // }
        // if (selectedIndex === 0 || selectedIndex === 3 ) {
        // await oFilter.setFilterFieldVisible("lifnr", true);
        // }
        // if (selectedIndex === 0 || selectedIndex === 4 ) {
        // await oFilter.setFilterFieldVisible("KUNNR", true);
        // }
        // if (selectedIndex === 0 || selectedIndex === 2 ) {
        // await oFilter.setFilterFieldVisible("LGORT", true);

        // await oFilter.setFilterFieldVisible("LGNUM", true);
        // await oFilter.setFilterFieldVisible("LGTYP", true);
        // await oFilter.setFilterFieldVisible("LGPLA", true);
        // }
        // if (selectedIndex === 1) {
        //   await oFilter.setFilterFieldVisible("DISPO", true);
        //   await oFilter.setFilterFieldVisible("Project", true);
        // }
        // await oFilter.setFilterFieldVisible("Counter", true);
        // await oFilter.setFilterFieldVisible("Deadline", true);
        // if (selectedIndex !== 0) {
        //   await oFilter.setFilterFieldVisible("zSchedule", true);
        // }
      },
      handleFiltersChanged: function (oEvent) {
        // 设置字段必输
        // var ozsite = this.byId("zwm311countingrequest::StocksMain--FilterBar-content::FilterField::ZSite");
        // ozsite.setRequired(true);
        // ozsite.setValueState("Error");
        // ozsite.setValueStateText("site is a required field.");
        // ozsite.mProperties.required = true;
        // ozsite.mProperties.valueState = "Error";
        // oZSiteFilterField.setValueState("Error");
        // ozsite.mProperties.valueStateText = "site is a required field.";
      },
      getOfilterSigneValue: function (oEvent, fieldname) {
        var allfilters = oEvent.getParameter("filters");
        // 处理第一条数据（若存在）
        if (allfilters && allfilters.length > 0) {
          const firstData = allfilters[0].oFilter; // 获取第一条数据
        }
      },
      getGridTableType: function () {
        if (!this.oGridTableType) {
          this.oGridTableType = new GridTableType({
            enableColumnFreeze: "{view>/gridType/enableColumnFreeze}",
            fixedColumnCount: "{view>/gridType/fixedColumnCount}",
            rowCount: "{view>/gridType/rowCount}",
            rowCountMode: "{view>/gridType/rowCountMode}",
            scrollThreshold: "{view>/gridType/scrollThreshold}",
            selectionLimit: "{view>/gridType/selectionLimit}",
            showHeaderSelector: "{view>/gridType/showHeaderSelector}",
          });
        }
        return this.oGridTableType;
      },
      getResponsiveTableType: function () {
        if (!this.oResponsiveTableType) {
          this.oResponsiveTableType = new ResponsiveTableType({
            detailsButtonSetting: "{view>/respType/detailsButtonSetting}",
            growingMode: "{view>/respType/growingMode}",
            popinLayout: "{view>/respType/popinLayout}",
            showDetailsButton: "{view>/respType/showDetailsButton}",
          });
        }
        return this.oResponsiveTableType;
      },
      openConfigurationDialog: function () {
        const oTable = this.getView().byId("table");
        const sFragmentName = oTable
          .getType()
          .isA("sap.ui.mdc.table.ResponsiveTableType")
          ? "ResponsiveTableType"
          : "GridTableType";
        if (!this.oDialog) {
          this.oDialog = Fragment.load({
            name: `mdc.sample.view.fragment.${sFragmentName}`,
            id: "configurationDialog",
            controller: this,
          }).then((oDialog) => {
            this.getView().addDependent(oDialog);
            return oDialog;
          });
        }
        this.oDialog.then((oDialog) => {
          oDialog.open();
        });
      },
      // closeDialog: function () {
      //   this.oDialog.then().then((oDialog) => {
      //     oDialog.close();
      //     oDialog.destroy();
      //   });
      //   this.oDialog = null;
      // },
      onDetailsButtonChange: function (oEvent) {
        const aItems = oEvent
          .getParameter("selectedItems")
          .map((oItem) => oItem.getKey());
        this.getView()
          .getModel("view")
          .setProperty("/respType/detailsButtonSetting", aItems);
      },
      enumToObject: function (oEnum) {
        return Object.values(oEnum).map((sValue) => {
          return { value: sValue };
        });
      },
      onShowmessage: async function (oEvent) {
        const total = await this.fetchcountData(
          this.getView().getModel(),
          "/Stocks/$count"
        );
        console.log("总记录数:", total);
        Messaging.removeAllMessages();
        //获取Model
        const oModel = this.getView().getModel("Stocks");
        const otable = this.byId("table");
        // 获取选中的行
        var selContexts = otable.getSelectedContexts();

        const oFilterBar = this.byId("FilterBar");
        // 循环遍历每个选中的上下文
        var oMessage = new Message({
          message: "ZSite 是必输项，请输入有效的 ZSite 值。",
          type: MessageType.Error,
          // type: MessageType.Success,
          //       target: "zwm311countingrequest::StocksMain--FilterBar-content::FilterField::ZSite",
          target: "/FilterBar/filterFields/ZSite/editMode",
          processor: oFilterBar.getModel(),
        });

        Messaging.addMessages(oMessage);

        var oMessage = new Message({
          message: "Plant 是必输项，请输入有效的 Plant 值。",
          type: MessageType.Error,
          // type: MessageType.Success,
          target: "/Stocks/1/Counter",
          processor: this.getView().getModel("Stocks"),
        });
        Messaging.addMessages(oMessage);

        oMessage = new Message({
          message: "成功消息",
          type: MessageType.Success,
          target: "/selectionData/Plant",
          processor: this.getView().getModel(),
        });
        Messaging.addMessages(oMessage);
        // 获取消息按钮实例
        const oMessageButton = this.byId("messageButtonId");

        // 触发点击事件
        if (oMessageButton) {
          oMessageButton.firePress(); // 推荐方式（触发UI5事件）
          // 或者直接调用DOM点击
          // oMessageButton.getDomRef().click();
        }
      },
      onClearmessage: function (oEvent) {
        const oViewModel = this.getView().getModel("ui");
        // 修改模型中的属性值
        oViewModel.setProperty("/isEditable", false);
        this.byId("Table").metadata.properties.readOnly = true;
        this.byId("Table").invalidate();
        Messaging.removeAllMessages();
      },
      onShowDialog: function (oEvent) {
        // if (!this.fragmentTwo) {
        //   this.fragmentTwo = this.getExtensionAPI().loadFragment({
        //     id: "fragmentTwo",
        //     name: "zwm311countingrequest.ext.main.Dialog",
        //     controller: this
        //   });
        // }
        // this.fragmentTwo.then(function (dialog) {
        //   dialog.open();
        // });
        this.oGlobalDialog = null;
        const oController = this;

        // 返回Promise，用户操作后resolve结果
        return new Promise((resolve) => {
          // 存储resolve方法到控制器实例，供按钮事件调用
          oController._dialogResolve = resolve;

          // 原有加载片段逻辑（复用已加载的实例）
          if (!this.fragmentTwo) {
            this.fragmentTwo = this.getExtensionAPI()
              .loadFragment({
                id: "fragmentTwo",
                name: "zwm311countreq.ext.main.Dialog",
                controller: this, // 确保对话框内事件绑定到当前控制器
              })
              .then((dialog) => {
                // 初始化时绑定关闭事件（避免重复绑定）
                dialog.attachAfterClose(() => {
                  // 可选：如果需要每次关闭后销毁实例，可添加以下代码
                  //  dialog.destroy();
                  //  oController.fragmentTwo = null;
                });
                return dialog;
              });
          }

          // 打开对话框
          this.fragmentTwo.then(function (dialog) {
            dialog.open();
            oController.oGlobalDialog = dialog;
          });
        });
      },
      closeDialog: function (closeBtn) {
        var sFragmentId = "fragmentTwo";
        var sControlId = "idSelectionRadioGroup3";
        var oRadioGroup = sap.ui.core.Fragment.byId(sFragmentId, sControlId);
        //成功获取选中值
        const selectedIndex = oRadioGroup.getSelectedIndex();
        const result = {
          action: "Confirm",
          selectedIndex: selectedIndex,
        };
        // 4. 传递结果并关闭对话框
        this._dialogResolve(result);
        closeBtn.getSource().getParent().close();
      },
      // 取消按钮事件：返回取消操作（无选中项）
      cancelDialog: function (closeBtn) {
        const result = {
          action: "cancel",
          selectedIndex: null, // 取消时无选中项
        };
        this._dialogResolve(result);
        closeBtn.getSource().getParent().close();
      },
      onClearPress() {
        // does not remove the manually set ValueStateText we set in onValueStatePress():
        Messaging.removeAllMessages();
      },

      //################ Private APIs ###################

      _getMessagePopover() {
        return this.loadFragment({
          name: "zwm311countreq.ext.main.MessagePopover",
        });
      },

      async onMessagePopoverPress(oEvent) {
        if (showmessage) {
          return;
        }
        const oSourceControl = oEvent.getSource();
        const oMessagePopover = await this._getMessagePopover();
        // 绑定close事件
        oMessagePopover.attachAfterClose(this._onPopoverClose, this);
        showmessage = true;
        oMessagePopover.openBy(oSourceControl);
      },
      _onPopoverClose: function (oEvent) {
        // 示例：重置状态变量
        showmessage = false;
      },
      buttonIconFormatter: function () {
        var sIcon;
        var aMessages = this.getView().getModel("message").oData;
        aMessages.forEach(function (sMessage) {
          switch (sMessage.type) {
            case "Error":
              sIcon = "sap-icon://message-error";
              break;
            case "Warning":
              sIcon =
                sIcon !== "sap-icon://message-error"
                  ? "sap-icon://message-warning"
                  : sIcon;
              break;
            case "Success":
              sIcon =
                sIcon !== "sap-icon://message-error" &&
                sIcon !== "sap-icon://message-warning"
                  ? "sap-icon://message-success"
                  : sIcon;
              break;
            default:
              sIcon = !sIcon ? "sap-icon://message-information" : sIcon;
              break;
          }
        });

        return sIcon;
        //return "sap-icon://error";
      },
      buttonTypeFormatter: function () {
        var sHighestSeverityIcon;
        var aMessages = this.getView().getModel("message").oData;
        sHighestSeverityIcon = "Neutral";
        aMessages.forEach(function (sMessage) {
          switch (sMessage.type) {
            case "Error":
              sHighestSeverityIcon = "Negative";
              break;
            case "Warning":
              sHighestSeverityIcon =
                sHighestSeverityIcon !== "Negative"
                  ? "Critical"
                  : sHighestSeverityIcon;
              break;
            case "Success":
              sHighestSeverityIcon =
                sHighestSeverityIcon !== "Negative" &&
                sHighestSeverityIcon !== "Critical"
                  ? "Success"
                  : sHighestSeverityIcon;
              break;
            default:
              sHighestSeverityIcon = !sHighestSeverityIcon
                ? "Neutral"
                : sHighestSeverityIcon;
              break;
          }
        });

        return sHighestSeverityIcon;
      },
      onOpenCommentPopup: function (oEvent) {
        // 1. 获取点击的按钮控件
        const oButton = oEvent.getSource();
        // 2. 获取按钮所在行的绑定上下文（关键步骤）
        // 如果表格使用默认模型，可省略模型名称参数
        const oBindingContext = oButton.getBindingContext("Stocks");
        // 若使用了命名模型，需指定模型名称：oButton.getBindingContext("modelName")

        if (oBindingContext) {
          // 3. 获取MDC Table控件
          const oTable = this.byId("table");

          // 4. 获取表格的选择插件（SelectionPlugin）
          const oSelectionPlugin = oTable.getPlugin(
            "sap.ui.mdc.plugins.SelectionPlugin"
          );
          if (!oSelectionPlugin) {
            console.error("未找到选择插件，请检查表格配置");
            return;
          }

          // 5. 选中当前行（根据选择模式自动处理单选/多选）
          // 单选模式下会自动取消其他行的选择
          oSelectionPlugin.select(oBindingContext);

          // 3. 获取当前行的数据对象
          const oRowData = oBindingContext.getObject();

          // 4. 使用行数据（示例：打印数据）
          console.log("当前行数据：", oRowData);
          // 可根据需要处理数据，如导航、弹窗等
        }
      },
      /**
       * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
       * (NOT before the first rendering! onInit() is used for that one!).
       * @memberOf zwm311countingrequest.ext.main.Main
       */
      //  onBeforeRendering: function() {
      //
      //  },

      /**
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       * @memberOf zwm311countingrequest.ext.main.Main
       */
      //  onAfterRendering: function() {
      //
      //  },

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       * @memberOf zwm311countingrequest.ext.main.Main
       */
      //  onExit: function() {
      //
      //  }
    });
  }
);
