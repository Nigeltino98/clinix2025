# starting the project
Run `docker compose -f docker-compose.dev.yml up`

# frontend
http://localhost/

# backend
http://localhost:8000

# Swagger
http://localhost:8000/swagger/

http://localhost:8000/swagger/?.json/

http://localhost:8000/swagger/?.xml/


## Deplyoment
#env.env

`POSTGRES_PASSWORD=<>`
`POSTGRES_USER=<>`
`POSTGRES_DB=<>`
`POSTGRES_HOST=<>`
`POSTGRES_PORT=<>`
`DEBUG=false`
`USE_SPACES=true`
`AWS_ACCESS_KEY_ID=<>`
`AWS_SECRET_ACCESS_KEY=<>`
`AWS_STORAGE_BUCKET_NAME=<>`
`HOST =<>`
`EMAIL_HOST_USER=<>`
`EMAIL_HOST_PASSWORD=<>`
`EMAIL_HOST=<>`

#/frontend/src/.config.json
`{`
    `"ENV": "development",`
  `  "BASE_URL": "http://localhost:8000"`
 ` }`
  

# branches
`staging`: `staging`
`production`:`master`
`main dev branch`:`pu` 