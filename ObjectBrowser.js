Ext.define('Components.ObjectBrowser', {
    
	extend: 'Ext.tree.Panel',
	alias:	'widget.objectbrowser',
	
	initComponent: function () {
    		Ext.apply(this, {
			forceFit: true,
			useArrows: true,
			rootVisible: false,
			multiSelect: true,
			columns: [{
				xtype: 'treecolumn',
				text: 'Key',
				sortable: true,
				dataIndex: 'key',
				flex: 2
			}, {
				text: 'Value',
				sortable: true,
				dataIndex: 'value'
			}]
		});
        	
        	if(typeof this.nullValue == 'undefined'){
            		this.nullValue = 'null';
        	}
		this.store = this.createStore(this.data);
		
		return this.callParent(arguments);
	},
    
	createStore: function (data) {
	    var modelName = this.id + '-Objects';
	    
		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: [{
				name: 'key',
				type: 'string'
			}, {
				name: 'value',
				type: 'string'
			}]
		});
    	
        return Ext.create('Ext.data.TreeStore', {
        	folderSort: true,
			model: modelName,
			proxy: {
				type: 'memory',
				data: { 
            	    text: 'root',
            	    children: this.parseObject(data)
            	}
			}
		});
	},

	parseObject: function (o) {
		var items = [];

		if (o.hasOwnProperty('length') && (typeof o === 'object')) {
			var idx = o.length;
			while (idx--) {
				if (typeof o[idx] === 'object' && (o[idx] !== null)) {
					items.push({
						key: '[' + idx + ']',
						value: '',
						iconCls: 'tree-node-' + this.findType(o[idx]),
						children: this.parseObject(o[idx])
					});
				} else {
					var v = (o[idx] === null) ? this.nullValue : o[idx];
					items.push({
						key: '[' + idx + ']',
						value: v,
						leaf: true,
						iconCls: 'tree-node-' + this.findType(v)
					});
				}
			}
		}
		else if (!o.hasOwnProperty('length') && (typeof o === 'object')) {
			for (var key in o) {
				if (o.hasOwnProperty(key)) {
					if (typeof o[key] === 'object' && (o[key] !== null)) {
						items.push({
							key: key,
							value: '',
							iconCls: 'tree-node-' + this.findType(o[key]),
							children: this.parseObject(o[key])
						});
					} else {
						var v = (o[key] === null) ? this.nullValue : o[key];
						items.push({
							key: key,
							value: v,
							leaf: true,
							iconCls: 'tree-node-' + this.findType(v)
						});
					}
				}
			}
		}

		return items;
	},

	findType: function (o) {
		if (typeof o === 'object') {
			if (o.hasOwnProperty('length')) {
				return 'array';
			} else {
				return 'object';
			}
		} else {
			return typeof o;
		}
	}
});
