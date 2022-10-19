# perfidy-flask

A Flask Server to Power Perfidy Endpoints

## Installation & Running

### Clone

1. `git clone git@github.com:Proskomma/perfidy-flask.git`
1. `cd perfidy-flash`

### Run a Local Python Flask Instance

1. Install Python 3.10 or higher
1. `pip install pipenv`
1. `pipenv install`
1. `bash ./bootstrap.sh -p 5000 & # -p is the port to use, optional, default is 5000`

### Run with Docker

1. Install Docker
1. If you want to use a different port on your local machine than 5000, `export PERFIDY_FLASK_PORT=<port>`
1. `docker compose up`


## Usages
### Using with Perfidy

1. Download/Clone Perfidy (https://github.com/Proskomma/perfidy)
1. `cd perfidy`
1. `yarn && yarn start`
1. Go to http://localhost:3000
1. Click the `>P` button and load from the `perfidy/pipelines` directory the `remoteTransformSpecSteps.json` file
1. If you are NOT using port 5000 for the perfidy-flask app, change 5000 to your port in Source 2
1. Click the `>>` button to run and see the response from the flask app

### Running Tests

1. Go to http://localhost:5000/jobs
1. `bash ./test.sh`
1. Reload http://localhost:5000/jobs
