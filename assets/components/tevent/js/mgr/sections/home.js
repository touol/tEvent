tEvent.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
            xtype: 'tevent-panel-home',
            renderTo: 'tevent-panel-home-div'
        }]
    });
    tEvent.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.page.Home, MODx.Component);
Ext.reg('tevent-page-home', tEvent.page.Home);