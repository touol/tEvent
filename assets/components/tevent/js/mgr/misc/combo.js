tEvent.combo.Search = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        xtype: 'twintrigger',
        ctCls: 'x-field-search',
        allowBlank: true,
        msgTarget: 'under',
        emptyText: _('search'),
        name: 'query',
        triggerAction: 'all',
        clearBtnCls: 'x-field-search-clear',
        searchBtnCls: 'x-field-search-go',
        onTrigger1Click: this._triggerSearch,
        onTrigger2Click: this._triggerClear,
    });
    tEvent.combo.Search.superclass.constructor.call(this, config);
    this.on('render', function () {
        this.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
            this._triggerSearch();
        }, this);
    });
    this.addEvents('clear', 'search');
};
Ext.extend(tEvent.combo.Search, Ext.form.TwinTriggerField, {

    initComponent: function () {
        Ext.form.TwinTriggerField.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag: 'span',
            cls: 'x-field-search-btns',
            cn: [
                {tag: 'div', cls: 'x-form-trigger ' + this.searchBtnCls},
                {tag: 'div', cls: 'x-form-trigger ' + this.clearBtnCls}
            ]
        };
    },

    _triggerSearch: function () {
        this.fireEvent('search', this);
    },

    _triggerClear: function () {
        this.fireEvent('clear', this);
    },

});
Ext.reg('tevent-combo-search', tEvent.combo.Search);
Ext.reg('tevent-field-search', tEvent.combo.Search);

tEvent.combo.Univers = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        //name: 'title',
        //hiddenName: 'title',
        displayField: 'title',
        valueField: 'id',
        fields: ['title','id'],
        pageSize: 20,
        url: tEvent.config.connector_url,
        baseParams: {
            action: 'mgr/field/select_query',
			name: config.name,
        },
        typeAhead: true,
        editable: true,
    });
    tEvent.combo.Univers.superclass.constructor.call(this,config);
};
Ext.extend(tEvent.combo.Univers, MODx.combo.ComboBox);
Ext.reg('tevent-univers-combo',tEvent.combo.Univers);