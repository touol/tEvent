tEvent.window.CreateField = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'tevent-field-window-create';
    }
    Ext.applyIf(config, {
        title: _('tevent_field_create'),
        width: 900,
        autoHeight: true,
        url: tEvent.config.connector_url,
        action: 'mgr/field/create',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    tEvent.window.CreateField.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.window.CreateField, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'textfield',
            fieldLabel: _('tevent_fields_name'),
            name: 'name',
            id: config.id + '-name',
            anchor: '99%',
            allowBlank: false,
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_label'),
            name: 'label',
            id: config.id + '-label',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_dbtype'),
            name: 'dbtype',
            id: config.id + '-dbtype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_precision'),
            name: 'precision',
            id: config.id + '-precision',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_phptype'),
            name: 'phptype',
            id: config.id + '-phptype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_xtype'),
            name: 'xtype',
            id: config.id + '-xtype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_sort'),
            name: 'sort',
            id: config.id + '-sort',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_validate'),
            name: 'validate',
            id: config.id + '-validate',
            anchor: '99%',
        }, {
			xtype: 'textarea',
            fieldLabel: _('tevent_fields_select_query'),
            name: 'select_query',
            id: config.id + '-select_query',
            anchor: '99%',
		},{
			xtype: 'xcheckbox',
            boxLabel: _('tevent_fields_filter'),
            name: 'filter',
            id: config.id + '-filter',
		},{
			xtype: 'xcheckbox',
            boxLabel: _('tevent_item_active'),
            name: 'active',
            id: config.id + '-active',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('tevent-field-window-create', tEvent.window.CreateField);

tEvent.window.UpdateField = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'tevent-field-window-update';
    }
    Ext.applyIf(config, {
        title: _('tevent_field_update'),
        width: 900,
        autoHeight: true,
        url: tEvent.config.connector_url,
        action: 'mgr/field/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    tEvent.window.UpdateField.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.window.UpdateField, MODx.Window, {

    getFields: function (config) {
        return [{
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        }, {
            xtype: 'textfield',
            fieldLabel: _('tevent_fields_name'),
            name: 'name',
            id: config.id + '-name',
            anchor: '99%',
            allowBlank: false,
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_label'),
            name: 'label',
            id: config.id + '-label',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_dbtype'),
            name: 'dbtype',
            id: config.id + '-dbtype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_precision'),
            name: 'precision',
            id: config.id + '-precision',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_phptype'),
            name: 'phptype',
            id: config.id + '-phptype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_xtype'),
            name: 'xtype',
            id: config.id + '-xtype',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_sort'),
            name: 'sort',
            id: config.id + '-sort',
            anchor: '99%',
        }, {
			xtype: 'textfield',
            fieldLabel: _('tevent_fields_validate'),
            name: 'validate',
            id: config.id + '-validate',
            anchor: '99%',
        }, {
			xtype: 'textarea',
            fieldLabel: _('tevent_fields_select_query'),
            name: 'select_query',
            id: config.id + '-select_query',
            anchor: '99%',
		}, {	
			xtype: 'xcheckbox',
            boxLabel: _('tevent_fields_filter'),
            name: 'filter',
            id: config.id + '-filter',
		},{
			xtype: 'xcheckbox',
            boxLabel: _('tevent_item_active'),
            name: 'active',
            id: config.id + '-active',
        }];
    },

    loadDropZones: function () {
    }

});
Ext.reg('tevent-field-window-update', tEvent.window.UpdateField);