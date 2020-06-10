from py2neo import Graph
 
def loadneonodes():
    graph = Graph(host='localhost', port=7687, password="root")
#Clean up
    graph.delete_all()
 
 
#Read the csv file and create the song nodes
    query = """
    LOAD CSV WITH HEADERS FROM 'file:///dataset.csv' AS column 
    MERGE (s:Songs{name:column.Song,genre:column.Genre,album:column.Album,duration:column.Duration})
 
    """
    graph.run(query)

#Read the csv file and create the artist nodes
    query = """
    LOAD CSV WITH HEADERS FROM 'file:///dataset.csv' AS column MERGE (a:Artists {a_name:column.Artist})
 
    """
    graph.run(query)


    
#Read the csv file and create the genre nodes
    query = """
    LOAD CSV WITH HEADERS FROM 'file:///dataset.csv' AS column MERGE (g:Genres {genre:column.Genre})
 
    """
    graph.run(query)

#relation between the artists and the songs
    query = """
    LOAD CSV WITH HEADERS FROM 'file:///dataset.csv' AS column MERGE (s:Songs{name:column.Song,genre:column.Genre,album:column.Album,duration:column.Duration})
    MERGE (a:Artists {a_name:column.Artist})
    MERGE (s)-[:CREATED_BY{release:toInteger(column.Year)}]->(a)
 
    """
    graph.run(query)


    

#relation between the genre and the songs
    query = """
    LOAD CSV WITH HEADERS FROM 'file:///dataset.csv' AS column MERGE (s:Songs{name:column.Song,genre:column.Genre,album:column.Album,duration:column.Duration})
    MERGE (g:Genres {genre:column.Genre})
    MERGE (s)-[:BELONGS_TO]->(g)
 
    """
    graph.run(query)
 

# start 
if __name__ == '__main__':
    loadneonodes()
