# RepoFinder-Chatbot
RepoFinder helps you find open source development libraries, based on your input.


## Getting Started

Clone this repo from [here](https://github.com/AppLozic/RepoFinder-Chatbot.git).

### Prerequisites

You need below tools installed to start the RepoFinder.
..*node.js v8.0+
..*npm v4.2+
..*mongodb v3.4+

### Configuration

Create a mongodb schema(name it ```RepoFinder```) and import the collection ```repos```(dump file is checkedin under db folder). you can use ```mongoimport``` to import the collection.

```
mongoimport -c repos -d RepoFinder  -u <user_name> -p <password> --authenticationDatabase "admin" --file <path to RepoFinder>/db/repos.json
```
To ensure collection is imported successfully, open mongo shell and run the below query to see list of available collection.
```
use RepoFinder
show collections
```
it will show the list of collections on screen. The newly imported collection "repos" should be there.

Open  ```conf/config.js``` and update the mongodb ```username``` and ```password``` in  ```mongoDbUrl``` property. 


## Deployment

Navigate to the RepoFinder, and run below commands.
```
npm install
node main.js
```

RepoFinder is ready on port 4000.

