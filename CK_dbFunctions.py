import json
import pandas as pd
import pymysql
import pymongo
import sqlalchemy
from sqlalchemy import create_engine

import os

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
else:
    # use the config.py file if IS_HEROKU is not detected
    from config import mongoConn, remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd

#CONNECT to mySQL
conn = pymysql.connect(host=f'{remote_db_endpoint}',
                       user=remote_db_user,
                       password=remote_db_pwd,
                       db=remote_db_name)

mycursor = conn.cursor()


pymysql.install_as_MySQLdb()
engine = create_engine(
    f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")

def view_exists(db_view_name):
    conn = engine.connect()
    sql = '''
    SELECT TABLE_NAME DB_VIEW FROM (
        SELECT TABLE_NAME  FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = 'CryptKeeper' 
        UNION
        SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'CryptKeeper' 
    ) DB_VIEWS  
    '''
    df = pd.read_sql(sql, con=conn)
    df = df.loc[df.DB_VIEW == db_view_name]
    conn.close()
    return len(df) > 0

#THIS FUNCTION RETURNS MYSQL VIEW OF SERVICES TABLE
def get_dataframe_from_db(db_view_name):
    conn = engine.connect()
    if not view_exists(db_view_name):
        return pd.DataFrame([{'err':'view does not exist'}])
    sql = f''' SELECT * FROM {db_view_name}'''
    df = pd.read_sql(sql, con=conn)
    conn.close()
    return df

