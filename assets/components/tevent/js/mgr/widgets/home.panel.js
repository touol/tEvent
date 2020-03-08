tEvent.panel.Home = function (config) {
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
            html: '<h2>' + _('tevent') + '</h2>',
            cls: '',
            style: {margin: '15px 0'}
        }, {
            xtype: 'modx-tabs',
            defaults: {border: false, autoHeight: true},
            border: true,
            hideMode: 'offsets',
            items: [{
                title: _('tevent_items'),
                layout: 'anchor',
                items: [{
                    html: _('tevent_intro_msg'),
                    cls: 'panel-desc',
                }, {
                    xtype: 'tevent-grid-items',
                    cls: 'main-wrapper',
                }]
            }]
        }]
    });
    tEvent.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.panel.Home, MODx.Panel);
Ext.reg('tevent-panel-home', tEvent.panel.Home);
