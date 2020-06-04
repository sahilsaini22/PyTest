import pandas as pd
from pymongo import MongoClient

# Load csv dataset
data = pd.read_csv('users.csv')
songdata = pd.read_csv('songs.csv')

# Connect to MongoDB

client = MongoClient( "mongodb+srv://musicdbuser1:root@musicdbcluster-s6hji.azure.mongodb.net/MUSICDB?retryWrites=true&w=majority:27017" )

db = client['MUSICDB']

collection = db['users']
songs = db['songs']


songdata.reset_index(inplace=True)

data_songs = songdata.to_dict("records")

# Insert collection

#songs.insert_many(data_songs)



#collection.remove()

data.reset_index(inplace=True)

data_dict = data.to_dict("records")

# Insert collection

collection.insert_many(data_dict)



print("import done!")
