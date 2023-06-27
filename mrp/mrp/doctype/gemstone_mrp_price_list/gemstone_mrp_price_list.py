# Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class GemstoneMRPPriceList(Document):
	pass

@frappe.whitelist()
def get_bom_gemstone_amount(item_code):
	quary_1 = frappe.db.sql(
		f"""SELECT master_bom FROM _407955e35814a6c9.tabItem where name = '{item_code}';"""
	,as_dict=1)
	quary_2 = frappe.db.sql(
		f"""SELECT gemstone_bom_amount FROM _407955e35814a6c9.tabBOM where name = '{quary_1[0]['master_bom']}';"""
	,as_dict=1)
	return quary_2
