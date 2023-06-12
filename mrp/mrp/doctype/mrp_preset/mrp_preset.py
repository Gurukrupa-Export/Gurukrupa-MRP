# Copyright (c) 2023, vishal@gurukrupaexport.in and contributors
# For license information, please see license.txt

import frappe,math
from frappe.model.document import Document
import requests
import cloudscraper
import json
from datetime import datetime,timedelta
from dateutil.relativedelta import relativedelta
import calendar
import pandas as pd
from currency_converter import CurrencyConverter

class MRPPreset(Document):
	pass



@frappe.whitelist()
def get_gold_price():
	
	end_date = datetime.now()
	print(end_date)

	start_date = (end_date - relativedelta(months=1)) - timedelta(days=1)
	print(start_date)

	start_date_epoch = calendar.timegm(start_date.timetuple())
	end_date_epoch = calendar.timegm(end_date.timetuple())


	scraper = cloudscraper.create_scraper()


	url = f"https://in.investing.com/currencies/xau-usd-historical-data?end_date={end_date_epoch}&st_date={start_date_epoch}"

	payload = {}
	headers = {
	'authority': 'in.investing.com',
	'accept': 'application/json, text/javascript, */*; q=0.01',
	'accept-language': 'en-US,en;q=0.9',
	'cookie': '_tz_id=74216b261b58d8a95f629d6eae6327b4; geoC=IN; welcomePopup=1; udid=00425dcf6aa60201e39c661da149833d; smd=00425dcf6aa60201e39c661da149833d-1686128382; __cf_bm=c4f6cMsYve0h7taVSKIxM1KJpG_V0uMNjO.PzUuiKnA-1686128382-0-AUFZJaBFnG7u1UXFJuu3YcGfxX9RQqTvHLlPWyIPWPqxqhWw71R00fMfB427hBQ6ndON6sZobS+xJoJillJgHzw=; __cflb=0H28vS6A9ipBeEbgf2sHmZKfA5h8RM4ez6D2rtkfRsh; PHPSESSID=t57eb49utv136r5aa08l5hfrh7; _fbp=fb.1.1686128464706.1428746387; __gpi=UID=00000c10b2d0d60e:T=1686128384:RT=1686128384:S=ALNI_Ma2w6oRdGdvSupZTl4tXougiydW_w; _cc_id=93d722c306fed9e8b52d03d46454b64f; panoramaId_expiry=1686733185384; panoramaId=ce0ad73526bf17dd746839b2321816d53938691adcd588573bf2aa11874b2aac; panoramaIdType=panoIndiv; outbrain_cid_fetch=true; _gid=GA1.2.1615638638.1686128467; cto_bundle=jVZSe18yZGl4Yjc3ZUlPTzhLR2QydmxvS3BaZm9COWN0c2lPRGpKcUwlMkJ5dU01NFA0cGlsbG9JYlVMUHZSTTZUVElxVmkyMzNYQWdIOWw3Zkl2VDkxZG9jdWJCJTJCTXo4cmJWMCUyQkhOSnF0NFFTdHM4cUZ3WDR0YnYyR213a3VJem1SZEZiRUNVUGNCUUlMOTlNeHB4TnNaSU9wSXclM0QlM0Q; _pbjs_userid_consent_data=3524755945110770; _lr_retry_request=true; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%223f8cb34e-d7b4-4f5c-998a-2c2c29e5021a%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222023-05-07T08%3A59%3A49%22%7D; pbjs-unifiedid_last=Wed%2C%2007%20Jun%202023%2009%3A01%3A09%20GMT; billboardCounter_56=1; __gads=ID=9ddf8475ab4b138a-22e7d3efd2e100e5:T=1686128384:RT=1686128561:S=ALNI_MZ40waj8g5usXSzIxK33uvzaIXEfw; invpc=4; _gat_UA-2555300-55=1; nyxDorf=OT5hNTJ6N2ozZTw5MH00NDNnZiM1NTE1; _ga=GA1.1.1773106593.1686128464; _ga_C4NDLGKVMK=GS1.1.1686128464.1.1.1686128673.57.0.0; firstUdid=0; smd=00425dcf6aa60201e39c661da149833d-1686128382; udid=00425dcf6aa60201e39c661da149833d; _tz_id=1297b7176a7fd881cb6c1108fb25d364; geoC=IN; nyxDorf=ZGNjN24mZjs1Y21oZyphYWM3YSQzM2Zi',
	'referer': 'https://in.investing.com/currencies/xau-usd-historical-data?end_date=1685471400&st_date=1682879400',
	'res-scheme': '1',
	'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
	'sec-ch-ua-mobile': '?0',
	'sec-ch-ua-platform': '"Windows"',
	'sec-fetch-dest': 'empty',
	'sec-fetch-mode': 'cors',
	'sec-fetch-site': 'same-origin',
	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
	'x-requested-with': 'XMLHttpRequest'
	}

	response = scraper.get(url, headers=headers, data=payload)
	data_list = []
	json_data = json.loads(response.text)
	raw_data = json_data['body']['content']['_list'][1]['nested']['body']['vars']['data']
	for data in raw_data:
		last_open = float(data['last_open'].replace(',',''))
		last_close = float(data['last_close'].replace(',',''))
		last_max = float(data['last_max'].replace(',',''))
		last_min = float(data['last_min'].replace(',',''))
		date = data['rowDate']
		data_list.append([date,last_open,last_close,last_max,last_min])
	df = pd.DataFrame(data_list,columns=['date','last_open','last_close','last_max','last_min'])
	# Set the span for EMA calculation
	raw_rate = df.loc[0]['last_close']
	span = 20
	# Calculate the multiplier
	multiplier = 2 / (span + 1)
	# Calculate EMA
	df['EMA'] = df['last_close'].ewm(span=span, adjust=False).mean()
	# span = 20
	# multiplier = 2 / (span + 1)
	df['SMA'] = df['last_close'].rolling(window=span, min_periods=span).mean()
	df.loc[span:, 'EMA'] = df.loc[span - 1, 'SMA'] + (df.loc[span:, 'last_close'] - df.loc[span - 1, 'SMA']) * multiplier
	df['EMA'].ffill(inplace=True)
	df2= df[['date','last_close','EMA']]
	# latest_ema_rate = df2.loc[0]['EMA']
	rate_in_ounce = round(df2.loc[0]['EMA']+100,2)
	# rate_in_gram = rate_in_ounce/31.10348
	

	current_datetime = str(end_date).split('.')[0]
	return round(raw_rate),rate_in_ounce,current_datetime


# @frappe.whitelist()
# def split(gold_rate,mrp,number_of_range):
# 	n = int(number_of_range)
# 	a = range(int(float(gold_rate)),int(float(mrp)))
# 	k,m = divmod(len(a),n)
# 	range_list = (a[i*k+min(i,m):(i+1)*k+min(i+1,m)] for i in range(n))
# 	return range_list


@frappe.whitelist()
def final(number_of_range,value_range,gold_rate):
    number_of_range = int(number_of_range)
    value_range = int(value_range)
    gold_rate = int(gold_rate)
    def plus(number_of_range,value_range,gold_rate):
        plus_parts = []

        for _ in range(number_of_range):
            part = f'{gold_rate} - {gold_rate + value_range}'
            gold_rate += value_range
            plus_parts.append(part)

        return plus_parts

    def minus(number_of_range,value_range,gold_rate):
        minus_parts = []

        for _ in range(number_of_range):
            part = f'{gold_rate - value_range} - {gold_rate}'
            gold_rate -= value_range
            minus_parts.append(part)

        minus_parts.reverse()
        return minus_parts
    
	
    p_a = minus(number_of_range,value_range,gold_rate) + plus(number_of_range,value_range,gold_rate)
    index = int(len(p_a)/2)
    if (index%2) != 0:
           return p_a[index-math.floor(index/2):index+math.ceil(index/2)]
    else:
        return p_a[index-round(index/2):index+round(index/2)]