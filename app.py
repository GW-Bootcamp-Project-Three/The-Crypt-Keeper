import json
import pandas as pd
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
    
else:
    # use the config.py file if IS_HEROKU is not detected
    from config import mongoConn, remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd, accessToken
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

@app.route("/map")
def map():
    return render_template("maps.html", accessToken=accessToken)


@app.route("/api/lookup/<query>")
def get_title(query):
    if query == '':
        query = "nothing"
    df = lookup(query)
    _json = df.to_json(orient='records', default_handler=str) 
    #print(_json) 
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'
    return resp
 

########################
## GET DATA FROM DB RETURN JSON
@app.route("/api/view/<db_view_name>") #set up for testing need to SECCURE!!!!!
def get_db_view(db_view_name): 
 
    df = get_dataframe_from_db(db_view_name)
    _json = df.to_json(orient='records')
    resp = make_response(_json)
    resp.headers['content-type'] = 'application/json'  
    return resp
 



# run the app in debug mode
if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)


