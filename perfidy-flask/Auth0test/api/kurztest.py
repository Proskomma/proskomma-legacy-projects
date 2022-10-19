import json

file = open("config.json")
parameters = json.load(file)
file.close()

print("My password is:", parameters["PASSWORD"])