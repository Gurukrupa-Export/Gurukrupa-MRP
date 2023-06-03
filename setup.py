from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in mrp/__init__.py
from mrp import __version__ as version

setup(
	name="mrp",
	version=version,
	description="MRP Module for EXP",
	author="vishal@gurukrupaexport.in",
	author_email="vishal@gurukrupaexport.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
