import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB

client = MongoClient( "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority:27017" )

db = client['MUSICDB']

collection = db['users']
songs = db['songs']

#collection.remove()
songs.remove()
