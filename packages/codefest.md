Instructions for repeating codefest progress.

Note: scripts work in Linux/Mac -- not Powershell/Windows

# Getting a local database running in Docker (with BCER schema)

Before running the typeorm migration you have to build the project and install typeorm.

* Install npm
* Install node.js (tested with v14.21.3 -- )
* From packages/bcer-api run 'npm i'
* From packages/bcer-api run 'npm run build'
* Install typeorm so you can run it from the command line: 'npm install i -g typeorm@0.2.41

Bring up a generic database

* From packages/bcer-api run 'typeorm migration:run -f ./ormconfig-codefest.js'


