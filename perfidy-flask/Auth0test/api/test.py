import  json
import http.client

file = open("config.json")
parameters = json.load(file)
file.close()

YOUR_ACCESS_TOKEN = parameters["ACCESS_TOKEN"]

conn = http.client.HTTPConnection("localhost:5000")

headers = { 'authorization': "Bearer " + YOUR_ACCESS_TOKEN}

conn.request("GET", "/api/private", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))