tEvent.page.Settings = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
            xtype: 'tevent-panel-settings',
            renderTo: 'tevent-panel-home-div'
        }]
    });
    tEvent.page.Settings.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.page.Settings, MODx.Component);
Ext.reg('tevent-page-settings', tEvent.page.Settings);