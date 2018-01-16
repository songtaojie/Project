﻿/**
* jQuery ligerUI 1.0.0
* 
* Author leoxie [ gd_star@163.com ] 
* 
*/

if (typeof (LigerUIManagers) == "undefined") LigerUIManagers = {};
(function($)
{
    $.fn.ligerGetGridManager = function()
    {
        return LigerUIManagers[this[0].id + "_Grid"];
    }; 
    
    ///	<param name="$" type="jQuery"></param>
    $.ligerAddGrid = function(grid, p)
    {
        if (grid.usedGrid) return;
        $(grid).hasClass("l-panel") || $(grid).addClass("l-panel");
        var gridHTML = "";
        gridHTML += "        <div class='l-panel-header'><span class='l-panel-header-text'></span></div>";
        gridHTML += "                    <div class='l-grid-loading'></div>";
        gridHTML += "                    <div class='l-grid-editor'></div>";
        gridHTML += "        <div class='l-panel-bwarp'>";
        gridHTML += "            <div class='l-panel-body'>";
        gridHTML += "                <div class='l-grid'>";
        gridHTML += "                    <div class='l-grid-dragging-line'></div>";
        gridHTML += "                    <div class='l-grid-popup'><table cellpadding='0' cellspacing='0'><tbody></tbody></table></div>";
        gridHTML += "                    <div class='l-grid-header'>";
         gridHTML += "                       <div class='l-grid-header-inner'>";
        gridHTML += "                        <table class='l-grid-td-table' cellpadding='0' cellspacing='0'><tbody><tr></tr></tbody></table>";
         gridHTML += "                    </div>";
        gridHTML += "                    </div>";
        gridHTML += "                    <div class='l-grid-scroller'>";
        gridHTML += "                        <div class='l-grid-body'>";
        gridHTML += "                        </div>";
        gridHTML += "                    </div>";
        gridHTML += "                 </div>";
        gridHTML += "              </div>";
        gridHTML += "         </div>";
        gridHTML += "         <div class='l-panel-bar'>";
        gridHTML += "            <div class='l-panel-bbar-inner'>";
        gridHTML += "            <div class='l-bar-group l-bar-selectpagesize'></div>";
        gridHTML += "                <div class='l-bar-separator'></div>";
        gridHTML += "                <div class='l-bar-group'>";
        gridHTML += "                    <div class='l-bar-button l-bar-btnfirst'><span></span></div>";
        gridHTML += "                    <div class='l-bar-button l-bar-btnprev'><span></span></div>";
        gridHTML += "                </div>";
        gridHTML += "                <div class='l-bar-separator'></div>";
        gridHTML += "                <div class='l-bar-group'><span class='pcontrol'> <input type='text' size='4' value='1' style='width:20px' maxlength='3' /> / <span></span></span></div>";
        gridHTML += "                <div class='l-bar-separator'></div>";
        gridHTML += "                <div class='l-bar-group'>";
        gridHTML += "                     <div class='l-bar-button l-bar-btnnext'><span></span></div>";
        gridHTML += "                    <div class='l-bar-button l-bar-btnlast'><span></span></div>";
        gridHTML += "                </div>";
        gridHTML += "                <div class='l-bar-separator'></div>";
        gridHTML += "                <div class='l-bar-group'>";
        gridHTML += "                     <div class='l-bar-button l-bar-btnload'><span></span></div>";
        gridHTML += "                </div>";
        gridHTML += "                <div class='l-bar-separator'></div>";
        gridHTML += "                <div class='l-bar-group'><span class='l-bar-text'></span></div>";
        gridHTML += "            </div>";
        gridHTML += "         </div>";
        $(grid).html(gridHTML);
        var g = {
            //刷新数据
            loadData: function(loadService)
            {
                //参数初始化
                if (!p.newPage) p.newPage = 1;
                if (p.dataAction == "server")
                {
                    if (!p.sortOrder) p.sortOrder = "asc";
                }
                var param = [];
                if(p.parms && p.parms.length)
                {
                    $(p.parms).each(function()
                    {
                        param.push({ name: this.name, value: this.value });
                    });
                } 
                if (p.dataAction == "server")
                {
                    if (p.usePager)
                    {
                        param.push({ name: 'page', value: p.newPage });
                        param.push({ name: 'pagesize', value: p.pageSize });
                    }
                    if (p.sortName)
                    {
                        param.push({ name: 'sortname', value: p.sortName });
                        param.push({ name: 'sortorder', value: p.sortOrder });
                    }
                }; 
                //loading状态 
                g.gridloading.show();
                $(".l-bar-btnload span",g.toolbar).addClass("l-disabled");
                this.loading = true;
                if (p.dataType == "local")
                {
                    if (!g.data) g.data = $.extend({}, p.data);
                    if (p.usePager)
                        g.currentData = g.getCurrentPageData(g.data);
                    else
                    {
                        g.currentData = $.extend({}, g.data);
                    }
                    g.showData(g.currentData);
                } else if (p.dataAction == "local" && g.data && !loadService)
                {
                    g.currentData = g.getCurrentPageData(g.data);
                    g.showData(g.currentData);
                }
                else
                { 
                    //请求服务器
                    $.ajax({
                        type: p.method,
                        url: p.url,
                        data: param,
                        dataType: 'json', 
                        success: function(data)
                        {  
                            g.data = $.extend({}, data);
                            if (p.dataAction == "server")
                            {
                                g.currentData = g.data;
                                g.showData(g.currentData);
                            } else
                            {
                                g.currentData = g.getCurrentPageData(g.data);
                                g.showData(g.currentData);
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) 
                        {   
                            g.gridloading.hide();
                            $(".l-bar-btnload span",g.toolbar).removeClass("l-disabled");
                            try { if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown); } catch (e) { } 
                        }
                    });
                }
            },
            setOptions:function(parms)
            {
                $.extend(p, parms);
            },
            showData: function(data)
            { 
                g.isDataChanged = false;
                //加载中
                $('.l-bar-btnloading', this.toolbar).removeClass('l-bar-btnloading');
                g.gridloading.hide();
                $(".l-bar-btnload span",g.toolbar).removeClass("l-disabled");
                this.loading = false;
                if (p.usePager)
                {
                    //更新分页
                    p.total = data.Total;
                    p.page = p.newPage;
                    p.pageCount = Math.ceil(p.total / p.pageSize);
                    this.buildPager();
                }
                //清空数据
                $(".l-grid-row,.l-grid-detailpanel,.l-grid-totalsummary", g.gridbody).remove();
                //加载数据
                var rowlenth = data.Rows.length;
                $(data.Rows).each(function(i, item)
                {
                    if (!item) return;
                    var row = $("<div class='l-grid-row' rowindex='" + i + "'><table class='l-grid-row-table' cellpadding='0' cellspacing='0'><tbody><tr></tr></tbody></table></div>");
                    g.gridbody.append(row);
                    if (!p.usePager && i == rowlenth - 1 && !g.isTotalSummary()) row.addClass("l-grid-row-last");
                    $(".l-grid-hd-cell", g.gridheader).each(function(headerCellIndex, headerCell)
                    {
                        //如果是明细列
                        if ($(headerCell).hasClass("l-grid-hd-cell-detail"))
                        {
                            var rowCell = $("<td class='l-grid-row-cell l-grid-row-cell-detail'><div class='l-grid-row-cell-inner'><span></span></div></td>");
                            rowCell.css('width', $(headerCell).css('width'));
                            $("tr", row).append(rowCell);
                            $("span", rowCell).click(function()
                            {
                                if ($(this).hasClass("l-open"))
                                {
                                    $(this).removeClass("l-open")
                                    row.next(".l-grid-detailpanel").remove();
                                }
                                else
                                {
                                    $(this).addClass("l-open")
                                    var detailPanel = $("<div class='l-grid-detailpanel'></div>");
                                    detailPanel.hide();
                                    row.after(detailPanel);
                                    p.detail.onShowDetail(item, detailPanel[0]);
                                }
                            });
                            return;
                        }
                        columnname = $(headerCell).attr("columnname");
                        columnindex = $(headerCell).attr("columnindex");
                        var rowCell = $("<td class='l-grid-row-cell' columnindex='" + columnindex + "'><div class='l-grid-row-cell-inner'></div></td>");
//                        if ($(headerCell).hasClass("l-grid-hd-cell-last"))
//                            rowCell.addClass("l-grid-row-cell-last");
                        var content = "";
                        var column = p.columns[columnindex];
                        if (column && column.align) $("> .l-grid-row-cell-inner", rowCell).css({ textAlign: column.align });
                        if (column && column.render)
                        {
                            content = column.render(item, i);
                        }
                        else if (columnname)
                        {
                            if (column.type && column.type == 'date')
                            {
                                var date = p.renderDate(item[columnname]);
                                item[columnname] = date;
                                if (date != null)
                                {
                                    if (column.format) content = g.getFormatDate(date, column.format);
                                    else content = g.getFormatDate(date, p.dateFormat);
                                }
                            }
                            else
                            {
                                content = item[columnname];
                            }
                        }
                        if (columnname)
                        {
                            rowCell.attr({ columnname: columnname });
                        }
                        $("> .l-grid-row-cell-inner", rowCell).html(content);
                        $("tr", row).append(rowCell);
                        rowCell.css('width', $(headerCell).css('width'));
                        $(">div:first",rowCell).width($(headerCell).width()-8);
                        if (!$(this).is(":visible")) rowCell.hide();
                    });
                });
                g.onResize();
                //创建汇总行
                g.bulidTotalSummary();
                //表体 - 行经过事件
                $(".l-grid-row", g.gridbody).hover(function()
                {
                    $(this).addClass("l-grid-row-over");
                }, function()
                {
                    $(this).removeClass("l-grid-row-over");
                }).click(function()
                {
                    if ($(this).hasClass("l-grid-row-selected"))
                        $(this).removeClass("l-grid-row-selected");
                    else
                    {
                        $(this).siblings(".l-grid-row-selected").removeClass("l-grid-row-selected");
                        $(this).addClass("l-grid-row-selected");
                    }
                });
                $(".l-grid-row-cell", g.gridbody).click(function(e)
                {
                    if (p.enabledEdit)
                    {
                        g.applyEditor(e);
                    }
                });
                if (p.onAfterShowData)
                {
                    p.onAfterShowData(grid);
                }
            },
            applyEditor: function(e)
            {
                var obj = (e.target || e.srcElement);
                if (obj.href || obj.type) return true;
                var rowcell;
                if ($(obj).hasClass("l-grid-row-cell")) rowcell = obj;
                if ($(obj).parent().hasClass("l-grid-row-cell")) rowcell = $(obj).parent()[0];
                if (!rowcell) return;
                var row = $(rowcell).parent().parent().parent().parent();
                var rowindex = $(row).attr("rowindex");
                var columnindex = $(rowcell).attr("columnindex");
                var columnname = $(rowcell).attr("columnname");
                var column = p.columns[columnindex];
                var left = $(rowcell).offset().left - g.body.offset().left;
                var top = $(rowcell).offset().top - $(grid).offset().top - 2;

                g.grideditor.css({ left: left, top: top, width: $(rowcell).css('width'), height: $(rowcell).css('height') }).html("");
                g.grideditor.editingCell = null;
                if (column.editor && column.editor.type == 'date')
                {
                    var $inputText = $("<input type='text'/>");
                    g.grideditor.append($inputText);
                    $inputText.attr({ style: 'border:#6E90BE' }).val($(".l-grid-row-cell-inner", rowcell).html());
                    $inputText.ligerDateEditor(
                            {
                                width: $(rowcell).width(),
                                onChangeDate: function(newValue)
                                {
                                    $(rowcell).addClass("l-grid-row-cell-edited");
                                    $(obj).html(newValue);
                                    g.updateData(rowcell, newValue);

                                }
                            }
                             );
                    g.grideditor.editingCell = rowcell;
                    g.grideditor.show();
                }
                else if (column.editor && column.editor.type == 'select')
                {
                    var $inputText = $("<input type='text'/>");
                    g.grideditor.append($inputText);
                    $inputText.attr({ style: 'border:#6E90BE' }).val($(".l-grid-row-cell-inner", rowcell).html());
                    var options = {
                        width: $(rowcell).width(),
                        data: column.editor.data,
                        isMultiSelect: false,
                        onSelected: function(newValue, newText)
                        {
                            $(rowcell).addClass("l-grid-row-cell-edited");
                            if (column.editor.valueColumnName && columnname)
                                g.currentData.Rows[rowindex][columnname] = newText;
                            g.updateData(rowcell, newValue);
                            if (column.editor.render)
                                $(obj).html(column.editor.render(g.currentData.Rows[rowindex]));
                            else
                                $(obj).html(newText);
                        }
                    };
                    if (column.editor.dataValueField) options.valueField = column.editor.dataValueField;
                    if (column.editor.dataDisplayField) options.displayField = options.textField = column.editor.dataDisplayField;
                    if (column.editor.valueColumnName)
                        options.initValue = g.currentData.Rows[rowindex][column.editor.valueColumnName];
                    else if (columnname)
                        options.initText = g.currentData.Rows[rowindex][columnname];
                    $inputText.ligerComboBox(options);
                    g.grideditor.editingCell = rowcell;
                    g.grideditor.show();
                }
                else if (column.editor && column.editor.type == 'int')
                {
                    var $inputText = $("<input type='text'/>");
                    g.grideditor.append($inputText);
                    $inputText.attr({ style: 'border:#6E90BE' }).val($(".l-grid-row-cell-inner", rowcell).html());
                    $inputText.ligerSpinner(
                            {
                                width: $(rowcell).width(),
                                height: $(rowcell).height(),
                                type: 'int',
                                onChangeValue: function(newValue)
                                {
                                    $(rowcell).addClass("l-grid-row-cell-edited");
                                    $(obj).html(newValue);
                                    g.updateData(rowcell, newValue);
                                }
                            }
                             );
                    g.grideditor.editingCell = rowcell;
                    g.grideditor.show();
                }
                else if (column.editor && column.editor.type == 'text')
                {
                    var $inputText = $("<input type='text'/>");
                    g.grideditor.append($inputText);
                    $inputText.val($(".l-grid-row-cell-inner", rowcell).html());
                    $inputText.ligerTextBox(
                            {
                                width: $(rowcell).width(),
                                //                                height: $(rowcell).height(),
                                onChangeValue: function(newValue)
                                {
                                    $(rowcell).addClass("l-grid-row-cell-edited");
                                    $(obj).html(newValue);
                                    g.updateData(rowcell, newValue);
                                }
                            }
                    );
                    g.grideditor.editingCell = rowcell;
                    g.grideditor.show();
                }
            },
            getFormatDate: function(date, dateformat)
            {
                if (date == "NaN") return null;
                var format = dateformat;
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                }
                if (/(y+)/.test(format))
                {
                    format = format.replace(RegExp.$1, (date.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
                }
                for (var k in o)
                {
                    if (new RegExp("(" + k + ")").test(format))
                    {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            },
            deleteSelectedRow: function()
            {
                var row = $(".l-grid-row-selected", g.gridbody);
                g.deleteRow(row);
            },
            deleteRow: function(row)
            {
                g.popup.hide();
                g.grideditor.html("").hide();
                var rowindex = row.attr("rowindex");
                $(row).remove();
                g.deleteData(rowindex);
                g.isDataChanged = true;
            },
            deleteData: function(rowindex)
            {
                g.currentData.Rows[rowindex].__status = 'delete';
            },
            updateData: function(cell, value)
            {
                var columnindex = $(cell).attr("columnindex");
                var column = p.columns[columnindex];
                var columnname = column.name;
                var row = $(cell).parents(".l-grid-row:eq(0)");
                var rowindex = row.attr("rowindex");
                if (column.type && column.type == 'int')
                    g.currentData.Rows[rowindex][columnname] = parseInt(value);
                else if (column && column.editor && column.editor.type == 'select')
                    g.currentData.Rows[rowindex][column.editor.valueColumnName ? column.editor.valueColumnName : columnname] = value;
                else
                    g.currentData.Rows[rowindex][columnname] = value;
                if (g.currentData.Rows[rowindex].__status == undefined)
                    g.currentData.Rows[rowindex].__status = 'update';
                g.isDataChanged = true;
            },
            addRow: function()
            {
                var rowindex = g.currentData.Rows.length;
                g.currentData.Rows[rowindex] = {};
                var rowdata = g.currentData.Rows[rowindex];
                if (!p.usePager && !g.isTotalSummary())
                    $("> .l-grid-row:last", g.gridbody).removeClass("l-grid-row-last");
                var row = $("<div class='l-grid-row' rowindex='" + rowindex + "'><table class='l-grid-row-table' cellpadding='0' cellspacing='0'><tbody><tr></tr></tbody></table></div>");
                g.gridbody.append(row);
                if (!p.usePager && !g.isTotalSummary())
                    row.addClass("l-grid-row-last");
                var celllength = $("tr > .l-grid-hd-cell", g.gridheader).length;
                $("tr > .l-grid-hd-cell", g.gridheader).each(function(headerCellIndex, headerCell)
                {

                    var columnname = $(headerCell).attr("columnname");
                    var columnindex = $(headerCell).attr("columnindex");
                    var column = p.columns[columnindex];
                    var rowCell = $("<td class='l-grid-row-cell' columnindex='" + columnindex + "'><div class='l-grid-row-cell-inner'></div></td>");
                    if (celllength == headerCellIndex + 1) rowCell.addClass("l-grid-row-cell-last");
                    if (columnname)
                    {
                        rowdata[columnname] = "";
                        if (column.type && column.type == 'int') rowdata[columnname] = 0;
                        rowCell.attr({ columnname: columnname });
                    }
                    $(".l-grid-row-cell-inner", rowCell).html(rowdata[columnname]);
                    $("tr", row).append(rowCell);
                    rowCell.css('width', $(headerCell).css('width'));
                    if (column.align) $(".l-grid-row-cell-inner", rowCell).css({ textAlign: column.align });
                    if ($(headerCell).is(":visible") == false) rowCell.hide();
                });
                rowdata.__status = 'add';
                //添加事件
                row.click(function(e)
                {
                    $(this).siblings(".l-grid-row-selected").removeClass("l-grid-row-selected");
                    $(this).addClass("l-grid-row-selected");
                    if (p.enabledEdit)
                    {
                        g.applyEditor(e);
                    }
                }).hover(function()
                {
                    $(this).addClass("l-grid-row-over");
                }, function()
                {
                    $(this).removeClass("l-grid-row-over");
                });
                //标识状态
                g.isDataChanged = true;
            },
            getData: function()
            {
                if (g.currentData == null) return null;
                return g.currentData.Rows;
            },
            getCurrentPageData: function(jsonObj)
            {
                var data = {
                    Rows: new Array(),
                    Total: jsonObj.Rows.length
                };
                if (!p.newPage) p.newPage = 1;
                for (i = (p.newPage - 1) * p.pageSize; i < jsonObj.Rows.length && i < p.newPage * p.pageSize; i++)
                {
                    var obj = $.extend({}, jsonObj.Rows[i]);
                    data.Rows.push(obj);
                }
                return data;
            },
            getColumn: function(columnname)
            {
                for (i = 0; i < p.columns.length; i++)
                {
                    if (p.columns[i].name == columnname)
                    {
                        return p.columns[i];
                    }
                }
                return null;
            },
            getColumnType: function(columnname)
            {
                for (i = 0; i < p.columns.length; i++)
                {
                    if (p.columns[i].name == columnname)
                    {
                        if (p.columns[i].type) return p.columns[i].type;
                        return "string";
                    }
                }
                return null;
            },
            //比较某一列两个数据
            compareData: function(data1, data2, columnName, columnType)
            {
                switch (columnType)
                {
                    case "int":
                        return parseInt(data1[columnName]) < parseInt(data2[columnName]) ? -1 : parseInt(data1[columnName]) > parseInt(data2[columnName]) ? 1 : 0;
                    case "float":
                        return parseFloat(data1[columnName]) < parseFloat(data2[columnName]) ? -1 : parseFloat(data1[columnName]) > parseFloat(data2[columnName]) ? 1 : 0;
                    case "string":
                        return data1[columnName].localeCompare(data2[columnName]);
                    case "date":
                        return data1[columnName] < data2[columnName] ? -1 : data1[columnName] > data2[columnName] ? 1 : 0;
                }
                return data1[columnName].localeCompare(data2[columnName]);
            },
            //是否包含汇总
            isTotalSummary: function()
            {
                for (var i = 0; i < p.columns.length; i++)
                {
                    if (p.columns[i].totalSummary) return true;
                }
                return false;
            },
            bulidTotalSummary: function()
            {
                if (!g.isTotalSummary()) return false;
                if (!g.currentData || g.currentData.Rows.length == 0) return false;
                if (g.gridbody.totalsummary) g.gridbody.totalsummary.remove();
                g.gridbody.totalsummary = $("<div class='l-grid-totalsummary'><table class='l-grid-totalsummary-table' cellpadding='0' cellspacing='0'><tbody><tr></tr></tbody></table></div>");
                if (!p.usePager) g.gridbody.totalsummary.addClass("l-grid-totalsummary-nobottom");
                g.gridbody.append(g.gridbody.totalsummary);
                $(".l-grid-hd-cell", g.gridheader).each(function(headerCellIndex, headerCell)
                {
                    var cell = $("<td class='l-grid-totalsummary-cell'><div class='l-grid-totalsummary-cell-inner'></div></td>");
                    $("tr", g.gridbody.totalsummary).append(cell);
                    cell.css('width', $(headerCell).css('width'));
                    columnname = $(headerCell).attr("columnname");
                    columnindex = $(headerCell).attr("columnindex");
                    if (!$(this).is(":visible")) cell.hide();
                    if (columnname)
                    {
                        cell.attr({ columnname: columnname });
                    }
                    if (!columnindex) return;
                    cell.attr({ columnindex: columnindex });
                    var column = p.columns[columnindex];
                    if (column.align) $(".l-grid-totalsummary-cell-inner", cell).css({ textAlign: column.align });
                    if (column.totalSummary)
                    {
                        if (column.totalSummary.type)
                        {
                            var types = column.totalSummary.type.split(',');
                            var isExist = function(type)
                            {
                                for (var i = 0; i < types.length; i++)
                                    if (types[i].toLowerCase() == type.toLowerCase()) return true;
                                return false;
                            };
                            var sum = 0, count = 0, avg = 0;
                            var max = parseFloat(g.currentData.Rows[0][column.name]);
                            var min = parseFloat(g.currentData.Rows[0][column.name]);
                            for (var i = 0; i < g.currentData.Rows.length; i++)
                            {
                                var value = parseFloat(g.currentData.Rows[i][column.name]);
                                sum += value;
                                count += 1;
                                if (value > max) max = value;
                                if (value < min) min = value;
                            }
                            avg = sum * 1.0 / g.currentData.Rows.length;
                            if (isExist('sum'))
                                $(".l-grid-totalsummary-cell-inner", cell).append("<div>Sum=" + sum.toFixed(2) + "</div>");
                            if (isExist('count'))
                                $(".l-grid-totalsummary-cell-inner", cell).append("<div>Count=" + count + "</div>");
                            if (isExist('max'))
                                $(".l-grid-totalsummary-cell-inner", cell).append("<div>Max=" + max.toFixed(2) + "</div>");
                            if (isExist('min'))
                                $(".l-grid-totalsummary-cell-inner", cell).append("<div>Min=" + min.toFixed(2) + "</div>");
                            if (isExist('avg'))
                                $(".l-grid-totalsummary-cell-inner", cell).append("<div>Avg=" + avg.toFixed(2) + "</div>");
                        }
                    }

                });
            },
            //改变排序
            changeSort: function(columnName, sortOrder)
            {
                if (this.loading) return true;
                if (p.dataAction == "local")
                {
                    var columnType = g.getColumnType(columnName);
                    if (!g.sortedData)
                        g.sortedData = $.extend({}, g.data);
                    if (p.sortName == columnName)
                    {
                        g.sortedData.Rows.reverse();
                    } else
                    {
                        g.sortedData.Rows.sort(function(data1, data2)
                        {
                            return g.compareData(data1, data2, columnName, columnType);
                        });
                    }
                    if (p.usePager)
                        g.currentData = g.getCurrentPageData(g.sortedData);
                    else
                        g.currentData = g.sortedData;
                    g.showData(g.currentData);
                }
                p.sortName = columnName;
                p.sortOrder = sortOrder;
                if (p.dataAction == "server")
                {
                    g.loadData();
                }
            },
            //改变分页
            changePage: function(ctype)
            {
                if (this.loading) return true;
                if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                    return false;
                //计算新page
                switch (ctype)
                {
                    case 'first': if (p.page == 1) return; p.newPage = 1; break;
                    case 'prev': if (p.page == 1) return; if (p.page > 1) p.newPage = parseInt(p.page) - 1; break;
                    case 'next': if (p.page >= p.pageCount) return; p.newPage = parseInt(p.page) + 1; break;
                    case 'last': if (p.page >= p.pageCount) return; p.newPage = p.pageCount; break;
                    case 'input':
                        var nv = parseInt($('.pcontrol input', this.toolbar).val());
                        if (isNaN(nv)) nv = 1;
                        if (nv < 1) nv = 1;
                        else if (nv > p.pageCount) nv = p.pageCount;
                        $('.pcontrol input', this.toolbar).val(nv);
                        p.newPage = nv;
                        break;
                }
                if (p.newPage == p.page) return false; 
                if(p.newPage==1)
                {
                     $(".l-bar-btnfirst span",g.toolbar).addClass("l-disabled");
                     $(".l-bar-btnprev span",g.toolbar).addClass("l-disabled");
                }
                else
                {
                    $(".l-bar-btnfirst span",g.toolbar).removeClass("l-disabled");
                     $(".l-bar-btnprev span",g.toolbar).removeClass("l-disabled");
                }
                if(p.newPage == p.pageCount)
                {
                    $(".l-bar-btnlast span",g.toolbar).addClass("l-disabled");
                     $(".l-bar-btnnext span",g.toolbar).addClass("l-disabled");
                }
                else
                {
                    $(".l-bar-btnlast span",g.toolbar).removeClass("l-disabled");
                     $(".l-bar-btnnext span",g.toolbar).removeClass("l-disabled");
                }
                if (p.onChangePage)
                    p.onChangePage(p.newPage);
                if (p.dataAction == "server")
                {
                    this.loadData();
                }
                else
                {
                    g.currentData = g.getCurrentPageData(g.data);
                    g.showData(g.currentData);
                }
            },
            buildPager: function()
            {
                $('.pcontrol input', this.toolbar).val(p.page);
                $('.pcontrol span', this.toolbar).html(p.pageCount);
                var r1 = parseInt((p.page - 1) * p.pageSize) + 1.0;
                var r2 = parseInt(r1) + parseInt(p.pageSize) - 1;
                if (p.total < r2) r2 = p.total;
                var stat = p.pageStatMessage;
                stat = stat.replace(/{from}/, r1);
                stat = stat.replace(/{to}/, r2);
                stat = stat.replace(/{total}/, p.total);
                $('.l-bar-text', this.toolbar).html(stat);
                if(p.page==1)
                {
                     $(".l-bar-btnfirst span",g.toolbar).addClass("l-disabled");
                     $(".l-bar-btnprev span",g.toolbar).addClass("l-disabled");
                }
                else
                {
                    $(".l-bar-btnfirst span",g.toolbar).removeClass("l-disabled");
                     $(".l-bar-btnprev span",g.toolbar).removeClass("l-disabled");
                }
                if(p.page == p.pageCount)
                {
                    $(".l-bar-btnlast span",g.toolbar).addClass("l-disabled");
                     $(".l-bar-btnnext span",g.toolbar).addClass("l-disabled");
                }
                else
                {
                    $(".l-bar-btnlast span",g.toolbar).removeClass("l-disabled");
                     $(".l-bar-btnnext span",g.toolbar).removeClass("l-disabled");
                }
            },
            getSelectedRow: function()
            {
                var row = $("> .l-grid-row-selected", g.gridbody);
                var rowindex = row.attr("rowindex");
                return g.getRowByRowIndex(parseInt(rowindex));
            },
            getRowByRowIndex: function(rowindex)
            {
                if (g.currentData == null) return null;
                return g.currentData.Rows[rowindex];
            },
            onResize: function()
            {
                if (p.height && p.height != 'auto')
                {
                    var h = 0;
                    if (p.height.indexOf('%') > 0)
                    { 
                        if ($(grid).parent()[0].tagName.toLowerCase() == "body") {
                            var windowHeight = $(window).height();
                            windowHeight -= parseInt($(grid).parent().css('paddingTop'));
                            windowHeight -= parseInt($(grid).parent().css('paddingBottom'));
                            h = windowHeight * parseFloat(p.height) * 0.01;
                        }
                        else{
                             h =  $(grid).parent().height() * parseFloat(p.height) * 0.01;
                        } 
                    } 
                    else
                    {
                        h = p.height;
                    }  
                    if(p.title) h -= g.header.height();
                    if(p.usePager) h -= g.toolbar.height();
                    h -= g.gridheader.height();
                    h -= $(grid).offset().top;
                    h-=5; 
                    g.scroller.height(h);
                }
                if ($(grid).width() != 0)
                {
                    if (p.gridMinWidth && p.gridMinWidth >= $(grid).width())
                    {
                        //$(".l-grid", g.body).width(p.gridMinWidth);
                          
                         $(" >div:first",g.gridheader).width(p.gridMinWidth+30); 
                         g.gridbody.width(p.gridMinWidth); 
                    }
                    else if (g.gridMinWidth > $(grid).width())
                    {
                        //$(".l-grid", g.body).width(g.gridMinWidth + 10);
 
                        $(" >div:first",g.gridheader).width(g.gridMinWidth + 10+30); 
                        g.gridbody.width(g.gridMinWidth); 
                    } else
                    {
                        $(" >div:first",g.gridheader).width($(grid).width() + 10+30); 
                        g.gridbody.width($(grid).width()); 
                    }
                }
            },
            dragStart: function(dragtype, e, obj)
            {
                if (dragtype == 'colresize') //列宽调整
                {
                    var columnindex = $(obj).parent().parent().attr("columnindex");
                    if (!columnindex) return;
                    var width = $(obj).parent().parent().width();
                    this.colresize = { startX: e.pageX, width: width, columnindex: columnindex };
                    $('body').css('cursor', 'col-resize');
                    g.draggingline.css({ height: g.body.height(), left: e.pageX - $(grid).offset().left + parseInt(g.body[0].scrollLeft), top: 0 }).show();
                }
                $.fn.ligerNoSelect && $('body').ligerNoSelect();
            },
            dragMove: function(e)
            {
                if (this.colresize) //列 调整
                {
                    var diff = e.pageX - this.colresize.startX;
                    var newwidth = this.colresize.width + diff;
                    this.colresize.newwidth = newwidth;
                    $('body').css('cursor', 'col-resize');
                    g.draggingline.css({ left: e.pageX - $(grid).offset().left + parseInt(g.body[0].scrollLeft) });
                }
            },
            dragEnd: function(e)
            {
                if (this.colresize)
                {
                    var mincolumnwidth = 80;
                    var columnindex = this.colresize.columnindex;
                    var column = p.columns[columnindex];
                    if (column && column.minWidth) mincolumnwidth = column.minWidth;
                    var newwidth = this.colresize.newwidth;
                    newwidth = newwidth < mincolumnwidth ? mincolumnwidth : newwidth;
                    g.gridMinWidth += (newwidth - parseInt($('.l-grid-hd-cell[columnindex=' + columnindex + ']', this.gridheader).css('width')));
                    $('.l-grid-hd-cell[columnindex=' + columnindex + ']', this.gridheader).css('width', newwidth);
                    $('> .l-grid-row,> .l-grid-totalsummary', this.gridbody).each(
						function()
						{
						    if ($(this).hasClass("l-grid-row"))
						        $('.l-grid-row-cell[columnindex=' + columnindex + ']', this).css('width', newwidth);
						    if (g.isTotalSummary() && $(this).hasClass("l-grid-totalsummary"))
						        $('td[columnindex=' + columnindex + ']', this).css('width', newwidth);
						}
				    );
                    g.onResize();
                    g.draggingline.hide();
                    this.colresize = false;
                }

                $('body').css('cursor', 'default');
                $.fn.ligerNoSelect && $('body').ligerNoSelect(false);
            },
            onClick: function(e)
            {
                var obj = (e.target || e.srcElement);
                var tagName = obj.tagName.toLowerCase();
                if (g.grideditor.editingCell)
                {
                    if (tagName == 'html' || tagName == 'body' || $(obj).hasClass("l-grid-scroller") || $(obj).hasClass("l-grid-row"))
                    {
                        g.grideditor.html("").hide();
                    }
                }
                if (p.showToggleColBtn)
                {
                    if (tagName == 'html' || tagName == 'body' || $(obj).hasClass("l-grid-scroller") || $(obj).hasClass("l-grid-row") || $(obj).hasClass("l-grid-row-cell-inner") || $(obj).hasClass("l-grid-header"))
                    {
                        g.popup.hide();
                    }
                }
            },
            toggleCol: function(columnindex, visible)
            {
                var headercell = $(".l-grid-hd-cell[columnindex='" + columnindex + "']", this.gridheader);
                if (!headercell) return;
                if (visible)
                {
                    headercell.show();
                    $(".l-grid-row-cell[columnindex='" + columnindex + "']", this.gridbody).show();
                } else
                {
                    headercell.hide();
                    $(".l-grid-row-cell[columnindex='" + columnindex + "']", this.gridbody).hide();
                }
            }
        };
        //头部
        g.header = $(".l-panel-header", grid);
        //scroller
        g.scroller = $(".l-grid-scroller", grid);
        //主体
        g.body = $(".l-panel-body", grid);
        //底部工具条         
        g.toolbar = $(".l-panel-bar", grid);
        //显示/隐藏列      
        g.popup = $(".l-grid-popup", grid);
        //编辑层   
        g.grideditor = $(".l-grid-editor", grid);
        //加载中
        g.gridloading = $(".l-grid-loading", grid);
        //调整列宽层 
        g.draggingline = $(".l-grid-dragging-line", grid);
        //表头     
        g.gridheader = $(".l-grid-header", grid);
        //表主体     
        g.gridbody = $(".l-grid-body", grid);
        g.currentData = null;
        

        /*--------------------------------
        --------------创建头部------------
        ---------------------------------*/
        if (p.showTitle)
            $(".l-panel-header-text", g.header).html(p.title);
        else
            g.header.hide();
        /*----------------------------------
        --------------创建表头--------------
        ----------------------------------*/
        //如果有明细，创建列
        if (p.detail && p.detail.onShowDetail)
        {
            var detailHeaderCell = $("<td class='l-grid-hd-cell l-grid-hd-cell-detail'><div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-text'></div></td>");
            detailHeaderCell.css({ width: 29 });
            $("tr", g.gridheader).append(detailHeaderCell);
        }
        g.gridMinWidth = 0;
        $(p.columns).each(function(i, item)
        {
            var $headerCell = $("<td class='l-grid-hd-cell' columnindex='" + i + "'><div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-dropleft'></div><div class='l-grid-hd-cell-dropright'></div><div class='l-grid-hd-cell-text'> </div><div class='l-grid-hd-cell-drophandle'></div></td>");
            if (i == p.columns.length - 1)
            {
                //$(".l-grid-hd-cell-drophandle", $headerCell).remove();
                //$headerCell.addClass("l-grid-hd-cell-last");
            }
            if (item.name)
                $headerCell.attr({ columnname: item.name });
            if (item.isSort != undefined)
                $headerCell.attr({ isSort: item.isSort });
            if (item.isAllowHide != undefined) 
                $headerCell.attr({ isAllowHide: item.isAllowHide });
            var headerText = "";
            if (item.display && item.display != "")
                headerText = item.display;
            else if (item.headerRender)
                headerText = item.headerRender(item);
            else
                headerText = "&nbsp;";
            $(".l-grid-hd-cell-text", $headerCell).html(headerText);
            $("tr", g.gridheader).append($headerCell);
            if (item.minWidth)
            {
                $headerCell.width(item.minWidth);
                if (item.width && item.width > item.minWidth)
                    $headerCell.width(item.width);
            } else if (item.width)
            {
                $headerCell.width(item.width);
            } else if (p.columnWidth)
            {
                $headerCell.width(p.columnWidth);
            }
            g.gridMinWidth += (parseInt($headerCell.css('width')) + 5);
        });
        //创建 显示/隐藏 列 列表
        $("tr .l-grid-hd-cell", g.gridheader).each(function(i, td)
        {
            if ($(this).hasClass("l-grid-hd-cell-detail")) return;
            var isAllowHide = $(this).attr("isAllowHide");
            if (isAllowHide != undefined && isAllowHide.toLowerCase() == "false") return;
            var chk = 'checked="checked"';
            var columnindex = $(this).attr("columnindex");
            var columnname = $(this).attr("columnname");
            if (!columnindex || !columnname) return;
            var header = $(".l-grid-hd-cell-text", this).html();
            if (this.style.display == 'none') chk = '';
            $('tbody', g.popup).append('<tr><td class="l-column-left"><input type="checkbox" ' + chk + ' class="l-checkbox" columnindex="' + columnindex + '"/></td><td class="l-column-right">' + header + '</td></tr>');
        });
        if ($.fn.ligerCheckBox)
            $('input:checkbox', g.popup).ligerCheckBox(
                {
                    onBeforeClick: function(obj)
                    {
                        if (!obj.checked) return true;
                        if ($('input:checked', g.popup).length <= p.minColToggle)
                            return false;
                        return true;
                    }
                });

        /*----------------------------------
        ----------宽度高度初始化------------
        ----------------------------------*/
        if (!p.isScroll)
        {
            g.scroller.height('auto');
        }
        else if (p.gridHeight)
        {
            g.scroller.height(p.gridHeight);
        }
        if (p.width)
        {
            if (p.width == 'auto')
                $(grid).width(g.gridMinWidth + 10);
            else
                $(grid).width(p.width);
        }
        if (p.height) { $(grid).height(p.height); }
        g.onResize();
        /*----------------------------------
        --------------创建表体--------------
        ----------------------------------*/
        g.loadData();
        /*----------------------------------------
        --------------创建底部工具条--------------
        ----------------------------------------*/
        if (p.usePager)
        {
            //创建底部工具条 - 选择每页显示记录数
            var optStr = "";
            var selectedIndex = -1;
            $(p.pageSizeOptions).each(function(i, item)
            {
                var selectedStr = "";
                if (p.pageSize == item) selectedIndex = i;
                optStr += "<option value='" + item + "' " + selectedStr + " >" + item + "</option>";
            });

            $('.l-bar-selectpagesize', g.toolbar).append("<select name='rp'>" + optStr + "</select>");
            if (selectedIndex != -1) $('.l-bar-selectpagesize select', g.toolbar)[0].selectedIndex = selectedIndex;
            if ($.fn.ligerComboBox)
            {
                $(".l-bar-selectpagesize select", g.toolbar).ligerComboBox(
                {
                    onBeforeSelect: function()
                    {
                        if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                            return false;
                        return true;
                    },
                    width: 45
                });
            }
            //创建底部工具条 - 各个按钮状态
            //创建底部工具条 - 当前页数
            //创建底部工具条 - 当前分页信息
        }
        else
        {
            g.toolbar.hide();
        }
        /*----------------------------------
        ------------创建Loading------------
        ----------------------------------*/
        g.gridloading.html(p.loadingMessage);
        /*----------------------------------
        --------------创建事件--------------
        ----------------------------------*/
        g.header.click(function()
        {
            g.popup.hide();
            g.grideditor.html("").hide();
        });
        //表头 - 经过和点击事件
        $(".l-grid-hd-cell", g.gridheader).hover(function()
        {
            if (g.colresize) return false;
            //$(this).addClass("l-grid-hd-cell-over");
            if (p.showToggleColBtn)
            {
                //if (!$(this).attr("columnname")) return;
                if ($(this).attr("isAllowHide") != undefined && $(this).attr("isAllowHide").toLowerCase() == "false") return;
                var btn = $("<div class='l-grid-hd-cell-btn'><span></span></div>");
                $(".l-grid-hd-cell-inner", this).append(btn);
                var islast = $(this).hasClass("l-grid-hd-cell-last");
                btn.click(function()
                {
                    var left = ($(this).offset().left - g.body.offset().left + parseInt(g.body[0].scrollLeft));
                    if (islast)
                    {
                        left -= 70;
                    }
                    g.popup.css({ left: left, top: g.gridheader.height() + 1 });
                    g.popup.toggle();
                });
            }
            return false;
        }, function()
        {
            $(this).removeClass("l-grid-hd-cell-over");
            if (p.showToggleColBtn)
                $(".l-grid-hd-cell-btn", this).remove();
        }).click(function(e)
        {
            if (!$(this).attr("columnname")) return;
            if ($(this).attr("isSort") != undefined && $(this).attr("isSort").toLowerCase() == "false") return;
            var obj = (e.target || e.srcElement);
            if (obj.tagName.toLowerCase() == "span" || $(obj).hasClass("l-grid-hd-cell-btn")) return;
            if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                return false;
            var sort = $(".l-grid-hd-cell-sort", this);
            var columnName = $(this).attr("columnname");
            if (sort.length > 0)
            {
                if (sort.hasClass("l-grid-hd-cell-sort-asc"))
                {
                    sort.removeClass("l-grid-hd-cell-sort-asc");
                    sort.addClass("l-grid-hd-cell-sort-desc");
                    g.changeSort(columnName, 'desc');
                }
                else if (sort.hasClass("l-grid-hd-cell-sort-desc"))
                {
                    sort.removeClass("l-grid-hd-cell-sort-desc");
                    sort.addClass("l-grid-hd-cell-sort-asc");
                    g.changeSort(columnName, 'asc');
                }
            }
            else
            {
                $(".l-grid-hd-cell-inner", this).append("<div class='l-grid-hd-cell-sort l-grid-hd-cell-sort-asc'></div>");
                g.changeSort(columnName, 'asc');
            }
            $(".l-grid-hd-cell-sort", $(this).siblings()).remove();
            return false;
        }).mousedown(function()
        {
            return false;
        });
        g.gridheader.click(function()
        {
            g.grideditor.html("").hide();
        });
        //调整列宽
        if (p.allowAdjustColWidth)
        {
            $(".l-grid-hd-cell-drophandle", g.gridheader).mousedown(function(e)
            {
                g.dragStart('colresize', e, this);
            });
        }

        //表头 - 显示/隐藏'列控制'按钮事件
        if (p.showToggleColBtn)
        {

            $('tr', g.popup).hover(function() { $(this).addClass('l-popup-row-over'); },
            function() { $(this).removeClass('l-popup-row-over'); });
            var onPopupCheckboxChange = function()
            {
                if ($('input:checked', g.popup).length + 1 <= p.minColToggle)
                {
                    return false;
                }
                g.toggleCol($(this).attr("columnindex"), this.checked);
            };
            if ($.fn.ligerCheckBox)
                $(':checkbox', g.popup).change(onPopupCheckboxChange);
            else
                $(':checkbox', g.popup).click(onPopupCheckboxChange);
        }
        //表头 - 调整列宽层事件
        //表体 - 滚动联动事件
        g.scroller.scroll(function(){  
           
            if(g.scroller[0].scrollLeft == undefined) return ;
            var scrollLeft = parseInt(g.scroller[0].scrollLeft); 
            g.gridheader[0].scrollLeft = scrollLeft;
        });
        //表体 - 数据 单元格事件
        //工具条 - 切换每页记录数事件
        $('select', g.toolbar).change(function()
        {
            if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                return false;
            p.newPage = 1;
            p.pageSize = this.value;
            g.loadData();
        });
        //工具条 - 切换当前页事件
        $('.pcontrol input', g.toolbar).keydown(function(e) { if (e.keyCode == 13) g.changePage('input') });
        //工具条 - 按钮事件
        $(".l-bar-button", g.toolbar).hover(function()
        {
            $(this).addClass("l-bar-button-over");
        }, function()
        {
            $(this).removeClass("l-bar-button-over");
        }).click(function()
        {
            if ($(this).hasClass("l-bar-btnfirst"))
            { 
                g.changePage('first');
            }
            else if ($(this).hasClass("l-bar-btnprev"))
            {
                g.changePage('prev');
            }
            else if ($(this).hasClass("l-bar-btnnext"))
            {
                g.changePage('next');
            }
            else if ($(this).hasClass("l-bar-btnlast"))
            {
                g.changePage('last');
            }
            else if ($(this).hasClass("l-bar-btnload"))
            {
                if($("span",this).hasClass("l-disabled")) return false;
                if (g.isDataChanged && !confirm(p.isContinueByDataChanged))
                    return false;
                g.loadData();
            }
        });
        g.toolbar.click(function()
        {
            g.popup.hide();
            g.grideditor.html("").hide();
        });
        //全局事件
        $(document).mousemove(function(e) { g.dragMove(e) }).mouseup(function(e) { g.dragEnd() }).hover(function() { }, function() { g.dragEnd() }).click(function(e) { g.onClick(e) });
        //$(grid).click(function (e) { g.onClick(e) });
        
        if (grid.id == undefined) grid.id = "LigerUI_" + new Date().getTime();
        LigerUIManagers[grid.id + "_Grid"] = g;
        grid.usedGrid = true;
        
        $(window).resize(function()
        {
            g.onResize();
        });
    };
    $.ligerGridSetParms = function(p, fixedP)
    {
        p = $.extend({}, $.ligerDefaults.Grid, p);
        if (p.url && p.data)
        {
            p.dataType = "local";
        }
        else if (p.url && !p.data)
        {
            p.dataType = "server";
        }
        else if (!p.url && p.data)
        {
            p.dataType = "local";
        }
        else if (!p.url && !p.data)
        {
            p.dataType = "local";
            p.data = [];
        }
        if (p.dataType == "local")
            p.dataAction = "local";
        if (fixedP)
        {
            p = $.extend(p, fixedP);
        }
        return p;
    };

    $.fn.ligerGrid = function(p)
    {
        var fixedP = {};
        p = p || {};
        p = $.ligerGridSetParms(p, fixedP);
        return this.each(function()
        {
            $.ligerAddGrid(this, p);
        });
    };

    $.fn.ligerSimpleGrid = function(p)
    {
        var fixedP = {
            resizable: false,                        //table是否可伸缩
            usePager: false,                         //是否分页 
            showTableToggleBtn: false,               //是否显示'显示隐藏Grid'按钮   
            showCheckbox: false,                     //是否显示复选框
            showToggleColBtn: false,                 //是否显示'切换列层'按钮
            enabledEdit: false,                      //是否允许编辑
            allowAdjustColWidth: false,              //是否允许调整列宽     
            onDragCol: false,                        //拖动列事件
            onToggleCol: false,                      //切换列事件
            onChangeSort: false,                     //改变排序事件
            onSuccess: false,                        //成功事件
            onError: false,                          //错误事件
            onSubmit: false
        };
        p = $.ligerGridSetParms(p, fixedP);
        return this.each(function()
        {
            $.ligerAddGrid(this, p);
        });
    };
    $.ligerDefaults = $.ligerDefaults || {};
    $.ligerDefaults.Grid = {
        errorMessage: '发生错误',
        pageStatMessage: '显示记录从{from}到{to}，总数 {total} 条',
        pageTextMessage: 'Page',
        loadingMessage: '加载中...',
        findTextMessage: '查找',
        noRecordMessage: '没有符合条件的记录存在',
        title: null,
        isContinueByDataChanged: '数据已经改变,如果继续将丢失数据,是否继续?',
        width: 'auto',                          //宽度值
        columnWidth: 120,                      //默认列宽度
        resizable: true,                        //table是否可伸缩
        url: false,                             //ajax url
        usePager: true,                         //是否分页
        page: 1,                                //默认当前页
        total: 1,                               //总页面数
        pageSize: 10,                           //每页默认的结果数
        pageSizeOptions: [10, 20, 30, 40, 50],  //可选择设定的每页结果数
        parms : [],                         //提交到服务器的参数
        columns: [],                          //数据源
        minColToggle: 1,                        //最小显示的列
        dataType: 'server',                     //数据源：本地(local)或(server),本地是将读取p.data
        dataAction: 'server',                    //提交数据的方式：本地(local)或(server),选择本地方式时将在客服端分页、排序
        showTableToggleBtn: false,              //是否显示'显示隐藏Grid'按钮 
        allowAdjustColWidth: true,              //是否允许调整列宽     
        showCheckbox: true,                     //是否显示复选框
        showToggleColBtn: true,                 //是否显示'切换列层'按钮
        enabledEdit: false,                      //是否允许编辑
        isScroll: true,                         //是否滚动
        onDragCol: false,                       //拖动列事件
        onToggleCol: false,                     //切换列事件
        onChangeSort: false,                    //改变排序事件
        onSuccess: false,                       //成功事件
        onSelectedRow: false,                  //选择行事件
        onAfterShowData: false,                 //显示完数据事件
        onError: false,                         //错误事件
        onSubmit: false,                         //提交前事件
        dateFormat: 'yyyy-MM-dd',              //默认时间显示格式
        method :'POST',
        //获取时间
        renderDate: function(value)
        {
            var da;
            if (!value) return null;
            if (typeof value == 'object')
            {
                return value;
            }
            if (value.indexOf('Date') > -1)
            {
                da = eval('new ' + value.replace('/', '', 'g').replace('/', '', 'g'));
            } else
            {
                da = eval('new Date("' + value + '");');
            }
            return da;
        }
    };

})(jQuery);