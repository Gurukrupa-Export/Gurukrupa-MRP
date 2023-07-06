// Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('Diamond MRP Price List', {
	setup: function(frm) {
		var parent_fields = [['diamond_quality', 'Diamond Quality'],
		['stone_shape', 'Stone Shape'],
		['diamond_type', 'Diamond Type'],
		['diamond_grade','Diamond Grade']
		];
		set_filters_on_parent_table_fields(frm, parent_fields);

		var child_fields = [['sieve_size_range','Diamond Sieve Size Range']]
		set_filters_on_child_table_fields(frm, child_fields);
	},
	price_list_type: function(frm){
		update_fields_in_child_table(frm, "price_list_type")
	},
	margin:function(frm){
		update_fields_in_child_table(frm, "margin")
	},
	
	
});


frappe.ui.form.on('Diamond MRP Price List', {
	onload(frm) {
		if (cur_frm.doc.docstatus == 0){
			frappe.call({
				method: 'mrp.mrp.doctype.diamond_mrp_price_list.diamond_mrp_price_list.get_diamond_sieve_size_range',
				callback: function(r) {
					if (!r.exc) {
						var arrayLength = r.message.length;
						for (var i = 0; i < arrayLength; i++) {
							console.log(r.message[i][0]);
							let row = frm.add_child('diamond_mrp_price_list_details', {
								sieve_size_range:r.message[i][0],
							});
						}
						frm.refresh_field('diamond_mrp_price_list_details');
					}
				}
			});
		}
	},
});


frappe.ui.form.on('Diamond MRP Price List Details', {
	diamond_mrp_price_list_details_add: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		row.price_list_type = cur_frm.doc.price_list_type;
		refresh_field("diamond_mrp_price_list_details");
	},
	purchase_rate: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		row.rate = ((row.purchase_rate * row.margin/100)+row.purchase_rate);
		refresh_field("diamond_mrp_price_list_details");
	},
	margin: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		row.rate = ((row.purchase_rate * row.margin/100)+row.purchase_rate);
		refresh_field("diamond_mrp_price_list_details");
	},
	
});



function set_filters_on_parent_table_fields(frm, fields) {
	fields.map(function (field) {
		frm.set_query(field[0], function (doc) {
			return {
				query: 'mrp.query.item_attribute_query',
				filters: { 'item_attribute': field[1]}
			};
		});
	});
}


function update_fields_in_child_table(frm, fieldname) {
	$.each(frm.doc.diamond_mrp_price_list_details || [], function (i, d) {
		console.log(d)
		d[fieldname] = frm.doc[fieldname];
		
	});
	refresh_field("diamond_mrp_price_list_details");
	
}


function set_filters_on_child_table_fields(frm, fields) {
	fields.map(function (field) {
		frm.set_query(field[0], "diamond_mrp_price_list_details", function () {
			return {
				query: 'mrp.query.item_attribute_query',
				filters: { 'item_attribute': field[1] }
			};
		});
	});
}