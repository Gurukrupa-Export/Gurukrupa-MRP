# Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DiamondMRPPriceList(Document):
	pass



@frappe.whitelist()
def get_diamond_sieve_size_range():
	db_data = frappe.db.sql("SELECT value from `tabItem Attribute Value` tiav where parent  = 'Diamond Sieve Size Range'")
	print(db_data)
	return db_data