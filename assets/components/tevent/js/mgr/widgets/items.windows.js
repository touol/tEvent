tEvent.window.UpdateItem = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'tevent-item-window-update';
    }
    Ext.applyIf(config, {
        title: _('tevent_item_update'),
        width: 900,
        autoHeight: true,
        url: tEvent.config.connector_url,
        action: 'mgr/item/update',
        fields: this.getFields(config),
        keys: [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }]
    });
    tEvent.window.UpdateItem.superclass.constructor.call(this, config);
};
Ext.extend(tEvent.window.UpdateItem, MODx.Window, {

    getFields: function (config) {
        getFields = [];
		getFields.push({
            xtype: 'hidden',
            name: 'id',
            id: config.id + '-id',
        });
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			if(element['active']){
				var field = {};
				field.xtype = element['xtype'];
				field.name = element['name'];
				field.id = config.id + "-" + element['name'];
				field.fieldLabel = element['label'];
				field.anchor = '99%';
				//field.width = 200;
				switch(element['xtype']){
					/*case 'xdatetime':
						field.id = config.id + "-filter-" + element['name'] + "-from";
						field.emptyText = "От " + element['label'];
						getFields.push(field);
						field.id = config.id + "-filter-" + element['name'] + "-to";
						field.emptyText = "До " + element['label'];
						getFields.push(field);
					break*/
					case 'tevent-univers-combo':
						//field.emptyText = element['label'];
						
						field.hiddenName = element['name'];
						getFields.push(field);
					break
					default:
						getFields.push(field);
				}
			}
		})
		console.info('getFields',getFields);
		return getFields;
    },

    loadDropZones: function () {
    }

});
Ext.reg('tevent-item-window-update', tEvent.window.UpdateItem);