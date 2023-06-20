frappe.ui.form.on('Platinum MRP preset', {
	onload(frm) {

		frappe.call({
			method: 'mrp.mrp.doctype.platinum_mrp_preset.platinum_mrp_preset.get_platinum_price',
			callback: function(r) {
				if (!r.exc) {
					cur_frm.set_value('standard_rate', r.message[0]);
					cur_frm.set_value('ema_rate', r.message[1]);
					cur_frm.set_value('date', r.message[2]);
				}
			}
		});
	},
	number_of_range(frm) {
		cur_frm.clear_table('range');
		var arrayLength = cur_frm.doc.number_of_range;
		for (var i = 0; i < arrayLength; i++) {
			let row = frm.add_child('range');
		}
		frm.refresh_field('range');
	},
	value_range(frm) {
		cur_frm.clear_table('range');
		frappe.call({
			method: 'mrp.mrp.doctype.platinum_mrp_preset.platinum_mrp_preset.final',
			args: {
				'standard_rate': cur_frm.doc.standard_rate,
				'value_range': cur_frm.doc.value_range,
				'number_of_range': cur_frm.doc.number_of_range
			},
			callback: function(r) {
				if (!r.exc) {
					var arrayLength = cur_frm.doc.number_of_range;
					for (var i = 0; i < arrayLength; i++) {
						let row = frm.add_child('range', {
							range: r.message[i],
							value_addition: cur_frm.doc.value_addition,
						});
					}
					frm.refresh_field('range');
				}
			}
		});
	},
	value_addition(frm){
		update_fields_in_child_table(frm, "value_addition")
	},
});


function update_fields_in_child_table(frm, fieldname) {
	$.each(frm.doc.range || [], function (i, d) {
		d[fieldname] = frm.doc[fieldname];
	});
	refresh_field("range");
	
}