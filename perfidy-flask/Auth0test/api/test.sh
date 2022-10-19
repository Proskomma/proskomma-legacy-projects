#!/bin/bash

CLIENT_ID=kHZDK9gJIa1eyaHef5G4KSae7dyrc0V5
CLIENT_SECRET=UnzNaF60UuqESV7JPsu4u1ms0-ncnf0piWa8by2s_PV07LoPbroq5FixQ2WU_YJc
AUDIENCE=https://dev-m-7frtqz.eu.auth0.com/api/v2/
GRANT_TYPE=client_credentials

curl --request POST \
--url https://dev-m-7frtqz.eu.auth0.com/oauth/token \
--header 'content-type: application/json' \
--data "{\"client_id\":\"${CLIENT_ID}\",\"client_secret\":\"${CLIENT_SECRET}\",\"audience\":\"${AUDIENCE}\",\"grant_type\":\"${GRANT_TYPE}\"}"


curl --request POST \
  --url https://dev-m-7frtqz.eu.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"kHZDK9gJIa1eyaHef5G4KSae7dyrc0V5","client_secret":"UnzNaF60UuqESV7JPsu4u1ms0-ncnf0piWa8by2s_PV07LoPbroq5FixQ2WU_YJc","audience":"https://dev-m-7frtqz.eu.auth0.com/api/v2/","grant_type":"client_credentials"}'

curl --request GET   --url http://localhost:5000/api/private   --header 'authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp1azVFbjhHYkxHY0VmUTJ2RkkzQiJ9.eyJpc3MiOiJodHRwczovL2Rldi1tLTdmcnRxei5ldS5hdXRoMC5jb20vIiwic3ViIjoia0haREs5Z0pJYTFleWFIZWY1RzRLU2FlN2R5cmMwVjVAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW0tN2ZydHF6LmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjA4MjAzNzQzLCJleHAiOjE2MDgyOTAxNDMsImF6cCI6ImtIWkRLOWdKSWExZXlhSGVmNUc0S1NhZTdkeXJjMFY1IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qDAGSF0k9sAnXuFBDZGeKn1B-zB7PuTGBBGAk-wa6RBZN2K6DG2LJ_vBf7jzWlyHjvWiXOTvjJIsaDtoy6q4WqtKjHiLFtKcoSxmqRooqCeg_Whme4MJdiyRV62Cwlw_BhxiRFquPThrraIHi2wwplS35zFwkEnDpvHoqyuuFoRaZj8kf_HDoSx9fZxkvbGeaD8KTJm0rV9SKvaSGVv0KLkN4a3MUwjsEtHMOJdzZ6rpZ6YMmT-3bn9gKsNm0nBWsnm7VBaX4tjp2UzCPQd6zEPGLn2gABrbYb7_Wy8TnDtFXHEAWZzBsJQ9kB2Umttk9s39B_XotlBm7uhXR7SdbA'
{"message":"Hello from a private endpoint! You need to be authenticated to see this."}