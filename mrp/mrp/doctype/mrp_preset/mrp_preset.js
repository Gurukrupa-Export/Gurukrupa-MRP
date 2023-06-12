// // Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
// // For license information, please see license.txt

// frappe.ui.form.on('MRP Preset', {
// 	onload(frm) {
// 		frappe.call({
// 			method: 'mrp.mrp.doctype.mrp_preset.mrp_preset.get_gold_price',
// 			callback: function(r) {
// 				if (!r.exc) {
// 					cur_frm.set_value('rate',r.message[0]);
// 					cur_frm.set_value('date',r.message[2]);
// 				}
// 			}
// 		});
// 		frm.set_query("metal_type", function() {
// 			return {
// 				filters: [
// 					['Item Attribute', 'attribute_name', '=', 'Metal Type']
// 				]
// 			};
// 		});
		
		
// 		// frm.set_query("metal_type", function() {
// 		// 	return{
// 		// 		filters:[
// 		// 			['Item Attribute','attribute_name', '=', 'Metal Type']
// 		// 			['Item Attribute','attribute_name', '=', 'Metal Type']
					
// 		// 		]
// 		// 	};
// 		// });
// 		// // cur_frm.fields_dict['metal_type'].get_query = function(doc) {
// 		// 	return {
// 		// 		filters: {
// 		// 			"parent": 'Metal Type'
// 		// 		}
// 		// 	}
// 		// }
// 	},
// 	number_of_range(frm){
// 		cur_frm.clear_table('range')
// 		console.log(cur_frm.doc.number_of_range)
// 		var arrayLength = cur_frm.doc.number_of_range;
// 		for (var i = 0; i < arrayLength; i++) {
// 			let row = frm.add_child('range');
// 		}
// 		frm.refresh_field('range');
// 	},
// 	value_range(frm){
// 		cur_frm.clear_table('range')
// 		frappe.call({
// 			method: 'mrp.mrp.doctype.mrp_preset.mrp_preset.final',
// 			args:{
// 				'gold_rate':cur_frm.doc.rate,
// 				'value_range':cur_frm.doc.value_range,
// 				'number_of_range':cur_frm.doc.number_of_range
// 			},
// 			callback: function(r) {
// 				if (!r.exc) {
// 					console.log(r.message)
// 					var arrayLength = cur_frm.doc.number_of_range;
// 					for (var i = 0; i < arrayLength; i++){
// 						let row = frm.add_child('range',{
// 						range:r.message[i],
// 						value_addition:cur_frm.doc.value_range,
// 					});}
// 					frm.refresh_field('range');
// 				}
// 			}
// 		});
// 	}
// });

frappe.ui.form.on('MRP Preset', {
	onload(frm) {
		frm.set_query("metal_type", function() {
			return {
				filters: [
					// ['Item Attribute', 'attribute_name', '=', 'Metal Type'],
					['Item Attribute Value', 'attribute_value', 'in', ['Gold', 'Silver', 'Platinum']]
				]
			};
		});

		frappe.call({
			method: 'mrp.mrp.doctype.mrp_preset.mrp_preset.get_gold_price',
			callback: function(r) {
				if (!r.exc) {
					cur_frm.set_value('rate', r.message[0]);
					cur_frm.set_value('date', r.message[2]);
				}
			}
		});
	},
	number_of_range(frm) {
		cur_frm.clear_table('range');
		console.log(cur_frm.doc.number_of_range);
		var arrayLength = cur_frm.doc.number_of_range;
		for (var i = 0; i < arrayLength; i++) {
			let row = frm.add_child('range');
		}
		frm.refresh_field('range');
	},
	value_range(frm) {
		cur_frm.clear_table('range');
		frappe.call({
			method: 'mrp.mrp.doctype.mrp_preset.mrp_preset.final',
			args: {
				'gold_rate': cur_frm.doc.rate,
				'value_range': cur_frm.doc.value_range,
				'number_of_range': cur_frm.doc.number_of_range
			},
			callback: function(r) {
				if (!r.exc) {
					console.log(r.message);
					var arrayLength = cur_frm.doc.number_of_range;
					for (var i = 0; i < arrayLength; i++) {
						let row = frm.add_child('range', {
							range: r.message[i],
							value_addition: cur_frm.doc.value_range,
						});
					}
					frm.refresh_field('range');
				}
			}
		});
	}
});
