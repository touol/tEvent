tEvent.grid.Fields = function (config) {
    config = config || {};
    if (!config.id) {
        config.id = 'tevent-grid-fields';
    }
	
    Ext.applyIf(config, {
        url: tEvent.config.connector_url,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/field/getlist'
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
            getRowClass: function (rec) {
                return !rec.data.active
                    ? 'tevent-grid-row-disabled'
                    : '';
            }
        },
        paging: true,
        remoteSort: true,
        autoHeight: true,
    });
    tEvent.grid.Fields.superclass.constructor.call(this, config);

    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
};
Ext.extend(tEvent.grid.Fields, MODx.grid.Grid, {
    windows: {},

    getMenu: function (grid, rowIndex) {
        var ids = this._getSelectedIds();

        var row = grid.getStore().getAt(rowIndex);
        var menu = tEvent.utils.getMenu(row.data['actions'], this, ids);

        this.addContextMenuItem(menu);
    },
	createItem: function (btn, e) {
		var w = MODx.load({
			xtype: 'tevent-field-window-create',
			id: Ext.id(),
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					}, scope: this
				}
			}
		});
		w.reset();
		w.setValues({active: true});
		w.show(e.target);
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
                action: 'mgr/field/get',
                id: id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        var w = MODx.load({
                            xtype: 'tevent-field-window-update',
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
                action: 'mgr/field/remove',
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
	disableItem: function (act, btn, e) {
		var ids = this._getSelectedIds();
		if (!ids.length) {
			return false;
		}
		MODx.Ajax.request({
			url: this.config.url,
			params: {
				action: 'mgr/field/disable',
				ids: Ext.util.JSON.encode(ids),
			},
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					}, scope: this
				}
			}
		})
	},

	enableItem: function (act, btn, e) {
		var ids = this._getSelectedIds();
		if (!ids.length) {
			return false;
		}
		MODx.Ajax.request({
			url: this.config.url,
			params: {
				action: 'mgr/field/enable',
				ids: Ext.util.JSON.encode(ids),
			},
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					}, scope: this
				}
			}
		})
	},
    getFields: function () {
        return ['id', 'name', 'label', 'dbtype', 'precision', 'phptype', 'xtype', 'sort', 'validate', 'select_query', 'filter', 'active', 'actions'];
    },

    getColumns: function () {
        return [{
            header: _('tevent_item_id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        }, {
			header: _('tevent_fields_name'),
            dataIndex: 'name',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_label'),
            dataIndex: 'label',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_dbtype'),
            dataIndex: 'dbtype',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_precision'),
            dataIndex: 'precision',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_phptype'),
            dataIndex: 'phptype',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_xtype'),
            dataIndex: 'xtype',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_sort'),
            dataIndex: 'sort',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_validate'),
            dataIndex: 'validate',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_select_query'),
            dataIndex: 'select_query',
            sortable: true,
            width: 100,
        }, {
			header: _('tevent_fields_filter'),
			dataIndex: 'filter',
			renderer: tEvent.utils.renderBoolean,
			sortable: true,
			width: 70,
		},{
			header: _('tevent_item_active'),
			dataIndex: 'active',
			renderer: tEvent.utils.renderBoolean,
			sortable: true,
			width: 70,
		},{
            header: _('tevent_grid_actions'),
            dataIndex: 'actions',
            renderer: tEvent.utils.renderActions,
            sortable: false,
            width: 100,
            id: 'actions'
        }];
    },
	BaseUpdate: function () {
        MODx.msg.confirm({
            title: _('tevent_fields_base_update'),
            text: _('tevent_fields_base_update'),
            url: this.config.url,
            params: {
                action: 'mgr/field/base_update',
            },
            listeners: {
                success: {
                    fn: function (res) {
                        console.info(res);
						MODx.msg.status({
							title: _('save_successful'),
							message: res.message,
							delay: 3
						});
						this.refresh();
                    }, scope: this
                }
            }
        });
        return true;
    },
    getTopBar: function (config) {
        return [ {
			text: '<i class="icon icon-plus"></i>&nbsp;' + _('tevent_item_create'),
			handler: this.createItem,
			scope: this
		},{
            text: _('tevent_fields_base_update'),
            handler: this.BaseUpdate,
            scope: this
        },'->',{
			xtype: 'button',
			id: config.id + '-search1',
			text: '<i class="icon x-field-search-go"></i>',
			listeners: {
				click: {fn: this._search, scope: this}
			}
		}, {
			xtype: 'button',
			id: config.id + '-search-clear',
			text: '<i class="icon icon-times"></i>',
			listeners: {
				click: {fn: this._clearSearch, scope: this}
			}
        }];
    },
	_search: function (tf) {
		this.getBottomToolbar().changePage(1);
		this.refresh();
	},
	_clearSearch: function (btn, e) {
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
Ext.reg('tevent-grid-fields', tEvent.grid.Fields);
