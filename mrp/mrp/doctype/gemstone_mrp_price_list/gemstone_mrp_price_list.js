// Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gemstone MRP Price List', {
	setup: function(frm) {
		var parent_fields = [['stone_type', 'Gemstone Type'],
		['stone_shape', 'Stone Shape'],
		['stone_size', 'Gemstone Size'],
		['stone_quality', 'Gemstone Quality'],
		['cut_or_cab', 'Cut Or Cab'],
		['gemstone_pr', 'Gemstone PR'],
		['per_pc_or_per_carat', 'Per Pc or Per Carat'],
		];
		set_filters_on_parent_table_fields(frm, parent_fields);
	},
	company(frm){
		console.log(cur_frm.doc.company)
		if(cur_frm.doc.company=='Gurukrupa Exports'){
			frm.set_value('margin',150.000)
		}
		else{
			frm.set_value('margin',200.000)
		}
	}
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