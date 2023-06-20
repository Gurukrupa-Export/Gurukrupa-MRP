import frappe
from erpnext.controllers.item_variant import get_variant,create_variant
from frappe import _

@frappe.whitelist()
def item_attribute_query(doctype, txt, searchfield, start, page_len, filters):
	args = {
		'item_attribute': filters.get("item_attribute"),
		"txt": "%{0}%".format(txt),
	}
	condition = ''
	

	if filters.get("metal_touch"):
		args["metal_touch"] = filters.get("metal_touch")
		condition += "and attribute_value in (select av.name from `tabAttribute Value` av where metal_touch = %(metal_touch)s)"

	if (filters.get("parent_attribute_value")):
		args['parent_attribute_value'] = filters.get("parent_attribute_value")
		item_attribute = frappe.db.sql("""select attribute_value
				from `tabItem Attribute Value`
					where parent = %(item_attribute)s 
					and attribute_value like %(txt)s
					and parent_attribute_value = %(parent_attribute_value)s
				""",args)
	else:
		item_attribute = frappe.db.sql(f"""select attribute_value
				from `tabItem Attribute Value`
					where parent = %(item_attribute)s 
					and attribute_value like %(txt)s {condition}
				""",args)
	return item_attribute if item_attribute else []