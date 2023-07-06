// Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('GOLD MRP PRICE', {
	onload(frm) {
		if (cur_frm.doc.docstatus == 0){
			frappe.call({
				method: 'mrp.mrp.doctype.gold_mrp_price.gold_mrp_price.get_gold_price',
				callback: function(r) {
					if (!r.exc) {
						
						
						cur_frm.set_value('date',r.message[0]);
						var arrayLength = r.message[1].length;
						console.log(arrayLength)
						for (var i = 0; i < arrayLength; i++) {
							console.log(r.message[1][i]);
							let row = frm.add_child('details', {
								carat:r.message[1][i][0],
								gold_purity:r.message[1][i][1],
								dollor:r.message[1][i][2],
								// rupee:r.message[1][i][3],
							});
						}
						frm.refresh_field('details');
					}
				}
			});
			frappe.call({
				method: 'mrp.mrp.doctype.gold_mrp_price.gold_mrp_price.set_ema_rate',
				callback: function(r) {
					if (!r.exc) {
						console.log(r.message)
						cur_frm.set_value('preset',r.message[0]);
						cur_frm.set_value('gold_rate',r.message[1]);
						cur_frm.set_value('rate',r.message[2]);
					}
				}
			});
			var parent_fields = [["metal_type","Metal Type"]];
			set_item_attribute_filters_on_fields_in_parent_doctype(frm, parent_fields);
		}
	},
	// onload(frm){
	// 	// console.log(cur_frm.doc.preset)
	// 	frappe.call({
	// 		method: 'mrp.mrp.doctype.gold_mrp_price.gold_mrp_price.set_ema_rate',
	// 		callback: function(r) {
	// 			if (!r.exc) {
	// 				console.log(r.message)
	// 				cur_frm.set_value('preset',r.message[0]);
	// 				cur_frm.set_value('gold_rate',r.message[1]);
	// 				cur_frm.set_value('rate',r.message[2]);
	// 			}
	// 		}
	// 	});
	// }
});

function set_item_attribute_filters_on_fields_in_parent_doctype(frm, fields) {
  fields.map(function(field){
    frm.set_query(field[0], function() {
      return {
        query: 'jewellery_erpnext.query.item_attribute_query',
        filters: {'item_attribute': field[1]}
      }
    })
  })
}