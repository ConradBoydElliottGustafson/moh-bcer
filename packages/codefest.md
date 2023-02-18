Instructions for repeating codefest progress.

Note: scripts work in Linux/Mac -- not Powershell/Windows

# Getting a local database running in Docker (with BCER schema)

Before running the typeorm migration you have to build the project and install typeorm.

* Install npm & node.js (see: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)
* Switch to node version 12 'nvm install 12'
* From packages/bcer-api/app run 'npm i'
* From packages/bcer-api/app run 'npm run build'
* Install typeorm so you can run it from the command line: 'npm install i -g typeorm@0.2.41'

Bring up a generic database

* From the root of the project, run 'docker-compose up -f docker-compose-codefest.yml'

Run the typeorm migration, using the connection file we built for codefest

* From packages/bcer-api/app run 'typeorm migration:run -f ./ormconfig-codefest.js'


