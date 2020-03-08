tEvent.panel.Settings = function (config) {
    config = config || {};
    Ext.apply(config, {
        baseCls: 'modx-formpanel',
        layout: 'anchor',
        /*
         stateful: true,
         stateId: 'tevent-panel-home',
         stateEvents: ['tabchange'],
         getState:function() {return {activeTab:this.items.indexOf(this.getActiveTab())};},
         */
        hideMode: 'offsets',
        items: [{
            html: '<h2>' + _('tevent_settings') + '</h2>',
            cls: '',
            style: {margin: '15px 0'}
        }, {
            xtype: 'modx-tabs',
            defaults: {border: false, autoHeight: true},
            border: true,
            hideMode: 'offsets',
            items: [{
                title: _('tevent_fields'),
                layout: 'anchor',
                items: [{
                    xtype: 'tevent-grid-fields',
                    cls: 'main-wrapper',
                }]
            }]
        }]
    });
    tEvent.panel.Settings.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.panel.Settings, MODx.Panel);
Ext.reg('tevent-panel-settings', tEvent.panel.Settings);
