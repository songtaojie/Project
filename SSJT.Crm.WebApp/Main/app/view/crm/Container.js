/**
 * 最外层容器
 */
Ext.define('SSJT.view.crm.Container', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.field.Text',
        'Ext.field.ComboBox',
        'Ext.plugin.Responsive',
        'SSJT.view.crm.ListItem',
        'SSJT.store.main.ListItem'
    ],

    xtype: 'crm-container',
    controller: 'crm-container',
    nameHolder: true,
    referenceHolder: true,

    layout: 'hbox',
    userCls: 'task-container',
    items: [{
        xtype: 'panel',
        reference: 'viewWrapper',
        scrollable: 'y',
        ui: 'block',
        flex: 1,
        // layout: 'vbox',
        html:'<input type="file" id="excel-file">',
        items: [
            /*
            , {
                xtype: 'task_minelist' // 此处放任务的各种视图
            }
            */
        ]

    }, {
        xtype: 'panel',
        items:[{
            xtype:'menu-listItem'
        }],
        width: 340
    }]
});