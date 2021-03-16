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

# Imports added by TK for machine learning
from itertools import product
from datetime import datetime
import warnings


import numpy as np
from scipy import stats
import statsmodels.api as sm


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

# Tom's price predictor
@app.route("/price-prediction-data", methods=['GET', 'POST'])
def price_prediction_data():

    coin_of_interest = request.form['CoinName']
    print('test'+coin_of_interest)
    
    #Connect to Amazon SQL
    conn = engine.connect()

    # Grab coin prices
    query = '''
    SELECT 
        RecordDate,
        OpenPrice,
        High,
        Low,
        ClosingPrice,
        AdjClose,
        Volume,
        c.CoinName,
        cph.TokenName
    FROM
        CoinPriceHistory cph
    INNER JOIN Coins c
        ON cph.CoinID = c.CoinID
    ORDER BY
        RecordDate
    '''
    coin_raw = pd.read_sql(query, conn)

    # Grab coin names
    query = '''
    SELECT CoinName FROM Coins
    '''
    coin_names = pd.read_sql(query,conn)

    # NEED TO IMPLEMENT: LINK TO PRICE-PREDICT.HTML
    # Get coin-of-interest from user
    # coin_of_interest = request.form['coi']

    # NEED TO IMPLMENT: PASS RESPONSE BACK TO PRICE-PREDICT.HTML
    # Determine if coin is in db
    # For now, we print it to the terminal.
    if coin_names[coin_names['CoinName']==coin_of_interest].any().bool():
      print("We got your coin!")
    else:
      print('We NO got your coin')

    # Clean data
    coin_history = coin_raw[coin_raw['CoinName']==coin_of_interest]
    coin_history['RecordDate'] = pd.to_datetime(coin_history['RecordDate'], errors='coerce')
    coin_history.rename(columns={'RecordDate':'Timestamp','OpenPrice':'Open', 'ClosingPrice':'Close'}, inplace=True)
    coin_history.set_index('Timestamp', inplace=True)
    coin_history.drop(['AdjClose', 'Volume', 'CoinName', 'TokenName'], axis=1, inplace=True)
    coin_history = coin_history[coin_history['Close']!=0]  

    # Transform data for ARIMA
    coin_history['Box'], lmbda = stats.boxcox(coin_history.Close)
    coin_history['BoxDiff'] = coin_history.Box - coin_history.Box.shift(12)
    coin_history['BoxDiff2'] = coin_history.BoxDiff - coin_history.BoxDiff.shift(1)

    # Optimize ARIMA Prediction
    Qs = range(0, 2)
    qs = range(0, 3)
    Ps = range(0, 3)
    ps = range(0, 3)
    D=1
    d=1
    parameters = product(ps, qs, Ps, Qs)
    parameters_list = list(parameters)
    results = []
    best_aic = float("inf")
    warnings.filterwarnings('ignore')
    #for param in parameters_list:
    param = parameters_list[0]
    try:
        model=sm.tsa.statespace.SARIMAX(coin_history.Box, order=(param[0], d, param[1]), 
                                        seasonal_order=(param[2], D, param[3], 12)).fit(disp=-1)
    except:
        print('Data cannot be conditioned for ARIMA model.  Sorry!') # Need to send this back to user
    aic = model.aic
    if aic < best_aic:
        best_model = model
        best_aic = aic
        best_param = param
    results.append([param, model.aic])

    #Generate Price Prediction Data
    def invboxcox(y,lmbda):
        if lmbda == 0:
            return(np.exp(y))
        else:
            return(np.exp(np.log(lmbda*y+1)/lmbda))
    coin_history_with_predictions = coin_history[['Close']]
    coin_history_with_predictions['Forecast'] = invboxcox(best_model.predict(start = 0, end=(len(coin_history_with_predictions)-1)), lmbda)
    prediction_dates = [datetime(2021, 4, 30), datetime(2021, 5, 31), datetime(2021, 6, 30), 
             datetime(2021, 7, 31), datetime(2021, 8, 31), datetime(2021, 9, 30), datetime(2021, 10, 31),
             datetime(2021, 11, 30), datetime(2021, 12, 31)]
    future = pd.DataFrame(index=prediction_dates, columns= coin_history.columns)
    future['Forecast'] = invboxcox(best_model.forecast(steps=len(future)), lmbda).tolist()
    coin_history_with_predictions = pd.concat([coin_history_with_predictions, future])
    coin_history_with_predictions['Coin'] = coin_of_interest
    graph = coin_history_with_predictions.reset_index().rename(columns={'index':'Date'})
    graph2 = graph[['Coin','Date', 'Close', 'Forecast']]
    # Return Price Prediction Data to Plotly
    _json = coin_history_with_predictions.to_json(orient='records')
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'

    return resp


@app.route("/price-predict")
def price_predict():

    return render_template("price-predict.html")


# @app.route("/price-prediction-data-test", methods=['GET', 'POST'])
# def price_prediction_data_test():
#     CoinName = request.form['CoinName']
#     return CoinName

# run the app in debug mode
if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)


