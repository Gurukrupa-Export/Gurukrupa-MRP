// Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('Diamond MRP Price List', {
	setup: function(frm) {
		var parent_fields = [['diamond_quality', 'Diamond Quality'],
		['stone_shape', 'Stone Shape'],
		['diamond_type', 'Diamond Type'],
		];
		set_filters_on_parent_table_fields(frm, parent_fields);
	},
	price_list_type: function(frm){
		update_fields_in_child_table(frm, "price_list_type")
	}
});


frappe.ui.form.on('Diamond MRP Price List Details', {
	diamond_mrp_price_list_details_add: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		row.price_list_type = cur_frm.doc.price_list_type;
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
