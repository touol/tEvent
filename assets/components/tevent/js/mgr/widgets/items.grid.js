tEvent.grid.Items = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'tevent-grid-items';
    }

	//console.info('tEvent.config.my_fields',tEvent.config.my_fields);
    Ext.applyIf(config, {
        url: tEvent.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/item/getlist'
        },
        listeners: {
            rowDblClick: function (grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateItem(grid, e, row);
            }
        },
        viewConfig: {
            forceFit: true,
            enableRowBody: true,
            autoFill: true,
            showPreview: true,
            scrollOffset: 0,
            /* getRowClass: function (rec) {
                return !rec.data.active
                    ? 'tevent-grid-row-disabled'
                    : '';
            } */
        },
        paging: true,
        remoteSort: true,
        autoHeight: true,
    });
    tEvent.grid.Items.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(tEvent.grid.Items, MODx.grid.Grid, {
    windows: {},

    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = tEvent.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuItem(menu);
    },

    updateItem: function (btn, e, row) {
        if (typeof(row) != 'undefined') {
            this.menu.record = row.data;
        }
        else if (!this.menu.record) {
            return false;
        }
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/item/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'tevent-item-window-update',
                            id: Ext.id(),
                            record: r,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    }, scope: this
                                }
                            }
                        });
                        w.reset();
                        w.setValues(r.object);
                        w.show(e.target);
                    }, scope: this
                }
            }
        });
    },

    removeItem: function () {
        var ids = this._getSelectedIds();
        if (!ids.length) {
            return false;
        }
        MODx.msg.confirm({
            title: ids.length > 1
                ? _('tevent_items_remove')
                : _('tevent_item_remove'),
            text: ids.length > 1
                ? _('tevent_items_remove_confirm')
                : _('tevent_item_remove_confirm'),
            url: this.config.url,
            params: {
                action: 'mgr/item/remove',
                ids: Ext.util.JSON.encode(ids),
            },
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    }, scope: this
                }
            }
        });
        return true;
    },

    getFields: function () {
		var fields = ['id'];
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			fields.push(element['name']);
			if(element['select_query']){
				fields.push(element['name'] + "_title");
			}
		})
		fields.push('actions');
		//console.info('my_fields',my_fields);
		//console.info('fields',fields);
        return fields;
    },

    getColumns: function () {
        Columns = [
			{
				header: _('tevent_item_id'),
				dataIndex: 'id',
				sortable: true,
				width: 70
			}
		];
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			var field = {};
			if(element['active']){
				field.header = element['label'];
				if(element['select_query']){
					field.dataIndex = element['name'] + "_title";
				}else{
					field.dataIndex = element['name'];
				}
				field.width = 100;
				Columns.push(field);
			}
		})
		for (var z in my_fields){
			
		}
		Columns.push({
            header: _('tevent_grid_actions'),
            dataIndex: 'actions',
            renderer: tEvent.utils.renderActions,
            sortable: false,
            width: 100,
            id: 'actions'
        });
        return Columns;
    },

    getTopBar: function (config) {
        getTopBar = [];
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			if(element['filter'] && element['active']){
				var field = {};
				field.xtype = element['xtype'];
				field.width = 200;
				switch(element['xtype']){
					case 'xdatetime':
						getTopBar.push({html: "От"});
						field.dateWidth = 120;
						field.timeWidth = 120;
						field.id = config.id + "-filter-" + element['name'] + "-from";
						//field.emptyText = "От " + element['label'];
						getTopBar.push(field);
						getTopBar.push({html: "До"});
						var field = {};
						field.xtype = element['xtype'];
						field.dateWidth = 120;
						field.timeWidth = 120;
						field.id = config.id + "-filter-" + element['name'] + "-to";
						//field.emptyText = "До " + element['label'];
						getTopBar.push(field);
					break
					case 'tevent-univers-combo':
						field.id = config.id + "-filter-" + element['name'];
						field.name = element['name'];
						field.emptyText = element['label'];
						getTopBar.push(field);
					break
					default:
						field.id = config.id + "-filter-" + element['name'];
						field.emptyText = element['label'];
						getTopBar.push(field);
				}
			}
		})
		
		getTopBar.push({
				xtype: 'button',
				id: config.id + '-search1',
				text: '<i class="icon x-field-search-go"></i>',
				listeners: {
					click: {fn: this._search, scope: this}
				}
			});
		getTopBar.push({
				xtype: 'button',
				id: config.id + '-search-clear',
				text: '<i class="icon icon-times"></i>',
				listeners: {
					click: {fn: this._clearSearch, scope: this}
				}
			});
		getTopBar.push('->');
		getTopBar.push({
				xtype: 'button',
				id: config.id + '-excel',
				text: '<i class="icon icon-file-excel-o"></i>',
				listeners: {
					click: {fn: this._exportExcel, scope: this}
				}
        });
		console.info('config.id',config.id);
		return getTopBar;
    },
	_exportExcel: function (tf) {
		console.info('this.config.id',this.config.id);
		url ='/assets/components/tevent/otchet_events.php?'
		my_fields = tEvent.config.my_fields;
		query = [];
		my_fields.forEach((element) => {
			if(element['filter'] && element['active']){
				switch(element['xtype']){
					case 'xdatetime':
						date = false;
						console.info('ext id',this.config.id + "-filter-" + element['name'] + "-from");
						date = Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-from").getValue();
						if(date) query.push(element['name'] + "-from=" + date);
						date = false;
						date = Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-to").getValue();
						if(date) query.push(element['name'] + "-to=" + date);
					break
					default:
						data = false;
						data = Ext.getCmp(this.config.id + "-filter-" + element['name']).getValue();
						if(data) query.push(element['name'] + "=" + data);
				}
			}
		})
		url += query.join('&');
		window.open(url, '_blank');
	},
	_search: function (tf) {
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			if(element['filter'] && element['active']){
				switch(element['xtype']){
					case 'xdatetime':
						date = false;
						date = Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-from").getValue();
						if(date) this.getStore().baseParams[element['name'] + "-from"] = date;
						date = false;
						date = Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-to").getValue();
						if(date) this.getStore().baseParams[element['name'] + "-to"] = date;
					break
					default:
						data = false;
						data = Ext.getCmp(this.config.id + "-filter-" + element['name']).getValue();
						if(data) this.getStore().baseParams[element['name']] = data;
				}
			}
		})
		this.getBottomToolbar().changePage(1);
		this.refresh();
	},
	_clearSearch: function (btn, e) {
		my_fields = tEvent.config.my_fields;
		my_fields.forEach((element) => {
			if(element['filter'] && element['active']){
				switch(element['xtype']){
					case 'xdatetime':
						this.getStore().baseParams[element['name'] + "-from"] = '';
						Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-from").setValue('');
						this.getStore().baseParams[element['name'] + "-to"] = '';
						Ext.getCmp(this.config.id + "-filter-" + element['name'] + "-to").setValue('');
					break
					default:
						this.getStore().baseParams[element['name']] = '';
						Ext.getCmp(this.config.id + "-filter-" + element['name']).setValue('');
				}
			}
		})
		this.getBottomToolbar().changePage(1);
		this.refresh();
	},
    onClick: function (e) {
        var elem = e.getTarget();
        if (elem.nodeName == 'BUTTON') {
            var row = this.getSelectionModel().getSelected();
            if (typeof(row) != 'undefined') {
                var action = elem.getAttribute('action');
                if (action == 'showMenu') {
                    var ri = this.getStore().find('id', row.id);
                    return this._showMenu(this, ri, e);
                }
                else if (typeof this[action] === 'function') {
                    this.menu.record = row.data;
                    return this[action](this, e);
                }
            }
        }
        return this.processEvent('click', e);
    },

    _getSelectedIds: function () {
        var ids = [];
        var selected = this.getSelectionModel().getSelections();

        for (var i in selected) {
            if (!selected.hasOwnProperty(i)) {
                continue;
            }
            ids.push(selected[i]['id']);
        }

        return ids;
    },

    _doSearch: function (tf) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },

    
});
Ext.reg('tevent-grid-items', tEvent.grid.Items);
