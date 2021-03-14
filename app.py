import json
import pandas as pd
import requests
import pymysql
import pymongo
import sqlalchemy
from sqlalchemy import create_engine 
from flask import Flask, request, render_template, jsonify, make_response, redirect
import os 
import re
from collections import Counter
import plotly.express as px
from plotly import graph_objects as go
from plotly.tools import FigureFactory as FF
from CK_dbFunctions import view_exists, get_dataframe_from_db

app = Flask(__name__)  

# # # # # # # # # # # # # # # #   
# Heroku check 
is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True  

if is_heroku == True:
    # if IS_HEROKU is found in the environment variables, then use the rest
    # NOTE: you still need to set up the IS_HEROKU environment variable on Heroku (it is not there by default)
    mongoConn = os.environ.get('mongoConn')
    remote_db_endpoint = os.environ.get('remote_db_endpoint')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_name = os.environ.get('remote_db_name')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')
    accessToken = os.environ.get('accessToken')
    market_API = os.environ.get('market_API')
    
else:
    # use the config.py file if IS_HEROKU is not detected
    from config import mongoConn, remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd, accessToken, market_API
# # # # # # # # # # # # # # # #   
## MY SQL CONN 
pymysql.install_as_MySQLdb() 
engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")

# # # # # # # # # # # # # # # #  
## ROUTES   


@app.route("/", methods=['GET', 'POST'])
def index(): 

    return render_template("index.html")


@app.route("/about", methods=['GET', 'POST'])
def about():

    return render_template("about.html")


@app.route("/coin/<int:coinid>", methods=['GET', 'POST'])
def coin(coinid):
    # print(coinid)
    df = get_dataframe_from_db('vwCoins')
    df = df.loc[df['CoinID'] == coinid]

    dfh = get_dataframe_from_db('vwCoinHistory')
    dfh = dfh.loc[dfh['CoinID'] == coinid]
  
    Token = df.iloc[0]['TokenName']
    url = f"https://api.nomics.com/v1/currencies/ticker?key={market_API}&ids={Token}&interval=1d,7d,30d&per-page=100&page=1"
    print(url)
    response = requests.get(url)
    dfm = pd.DataFrame(response.json())

    return render_template(
        "coin.html"
        , coin_view=df.to_dict(orient='records')
        , coin_history=dfh.to_dict(orient='records')
        , market_data=dfm.to_dict(orient='records')
    )


@app.route("/learn", methods=['GET', 'POST'])
def learn():

    return render_template("learn.html")
    
@app.route("/coinsearch")
def coinsearch():
    return render_template("coinsearch.html", accessToken=accessToken)


@app.route("/countries-map", methods=['GET', 'POST'])
def countries_map():

    return render_template("countries-map.html")

@app.route("/compare-price-dash", methods=['GET', 'POST'])
def compare_dash():
    return render_template("compare-price-dash.html")
 
########################
## GET DATA FROM DB RETURN JSON
@app.route("/api/view/<db_view_name>") 
def get_db_view(db_view_name): 
 
    df = get_dataframe_from_db(db_view_name)
    _json = df.to_json(orient='records')
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'  
    return resp

@app.route("/api/view/<db_view_name>/<key>/<val>") 
def get_db_view_kv(db_view_name, key, val):   
    df = get_dataframe_from_db(db_view_name)
    df = df.loc[ df[key] == val  ]
    _json = df.to_json(orient='records')
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'  
    return resp


@app.route("/surveyview")
def surveyview():
    return render_template("surveyview.html")


@app.route("/map")
def map():
    return render_template("map.html", accessToken=accessToken)


@app.route("/api/ticker", methods=['GET'])
def ticker():
    response = requests.get('https://crypt-keeper.herokuapp.com/api/view/vwCoins')
    tdf = pd.DataFrame(response.json())
    Coins = tdf['TokenName'][0:6]
    CoinList = Coins.astype(str).values.tolist()
    Token = ','.join(CoinList)
    # print(Token)
    url = f"https://api.nomics.com/v1/currencies/ticker?key={market_API}&ids={Token}&interval=1d,7d,30d&per-page=100&page=1"
    # print(url)
    response = requests.get(url)
    df = pd.DataFrame(response.json())
    df_merged = pd.merge(tdf, df, left_on='TokenName', right_on='id')
    _json = df_merged.to_json(orient='records')
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'

    

    return resp


# run the app in debug mode
if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)


