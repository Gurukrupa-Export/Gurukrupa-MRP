// Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('Making Charges MRP Price List', {
	setup: function(frm) {
		var parent_fields = [['metal_type', 'Metal Type'],['metal_touch','Metal Touch'],['metal_purity','Metal Purity']];
		set_filters_on_parent_table_fields(frm, parent_fields);
		cur_frm.fields_dict['metal_purity'].get_query = function(doc) {
			return {
				filters: {
					"metal_touch": cur_frm.doc.metal_touch
				}
			}
		}
		var fields = [['subcategory','Item Subcategory']];
		set_filters_on_item_subcategory_child_table_fields(frm,fields);

		var fields2 = [['subcategory','Finding Sub-Category']];
		set_filters_on_finding_subcategory_child_table_fields(frm,fields2);
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

function set_filters_on_item_subcategory_child_table_fields(frm, fields) {
	fields.map(function (field) {
		frm.set_query(field[0], "subcategory", function () {
			return {
				query: 'mrp.query.item_attribute_query',
				filters: { 'item_attribute': field[1] }
			};
		});
	});
}

function set_filters_on_finding_subcategory_child_table_fields(frm, fields2) {
	fields2.map(function (fields2) {
		frm.set_query(fields2[0], "finding_subcategory", function () {
			return {
				query: 'mrp.query.item_attribute_query',
				filters: { 'item_attribute': fields2[1] }
			};
		});
	});
}