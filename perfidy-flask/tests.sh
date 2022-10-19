# start the application
# ./bootstrap.sh &

# get expenses
curl http://localhost:5000/api/jobs

# add a new json2json
curl -X POST -H "Content-Type: application/json" -d '{
    "id": 20,
    "name": "do_this",
    "title": "do this",
    "description": "Doing this",
    "inputs": [],
    "outputs": []
}' http://localhost:5000/api/json2json

# get json2json list
curl http://localhost:5000/api/json2json

# add a new json2json
curl -X POST -H "Content-Type: application/json" -d '{
    "id": 20,
    "name": "do_this",
    "title": "do this",
    "description": "Doing this",
    "inputs": [],
    "outputs": []
}' http://localhost:5000/api/text2text

# get text2text list
curl http://localhost:5000/api/text2text
