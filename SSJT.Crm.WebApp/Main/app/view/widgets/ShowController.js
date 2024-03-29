Ext.define('SSJT.view.widgets.ShowController',{
    extend:'Ext.app.ViewController',
    alias:'controller.show',
    control: {
        '#': {
            recordchange: 'onRecordChange'
        }
    },

    getRecord: function() {
        return this.getViewModel().get('record');
    },

    onRecordChange: function(view, record) {
        this.getViewModel().set('record', record);

        // Scroll to the top of the view but make sure that the view is still
        // valid since the record is reset to null when the view is destroyed.
        if (!view.destroying && !view.destroyed) {
            view.getScrollable().scrollTo(null, 0, true);
        }
    },
    onEditTap: function() {
        this.redirectTo(this.getRecord().toEditUrl());
    },
})