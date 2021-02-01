from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.requests import Request

import time
import requests

# Load secrets from .env
from dotenv import load_dotenv
load_dotenv()

import os
FINNHUB_TOKEN = os.environ['FINNHUB_TOKEN']

# setup cache (for finnhub api responses)
cache = {}

app = FastAPI()


@app.get('/shorty.json')
async def shorty():
    if resp := cache.get('short'):
        return resp

    url = "https://finnhub.io/api/v1/stock/short-interest?symbol={sym}&from={from_date}&to={to_date}&token={token}"
    today = time.strftime('%Y-%m-%d')
    url = url.format(sym='GME', from_date='2020-01-01', to_date=today, token=FINNHUB_TOKEN)

    resp = requests.get(url)
    print('got response', resp, resp.json())
    cache['short'] = resp.json()

    return resp.json()



app.mount('/', StaticFiles(directory='./public', html=True))
