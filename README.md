# COMAN(Consultation Management System)

[![Version](https://img.shields.io/github/package-json/v/papatekken/coman)](https://github.com/papatekken/coman)
[![license](https://img.shields.io/github/license/papatekken/coman)](https://www.gnu.org/licenses/agpl-3.0)
[![ExpressJS](https://img.shields.io/badge/expressJS-4.16.1-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongonese-5.10.6-blue)](https://www.npmjs.com/package/mongoose)

A clinic management system which was developed in Express.js with mongonese database


## About

This system was developed for my kung fu instructor, who is a chinese chiropractor. So the updates in future will probably based on his feedback and requests.

In current version, all CRUD operation are ready with some basic features, but I would like to implement few more planned features before launching the production version.


## Features

- manage records of patients, consultations, medicines and prescriptions
- switch language between English and Chinese


## Installation

1. Setup [NodeJS](https://nodejs.org/) and [GIT](https://git-scm.com/) in runtime environment

2. Clone the repository 
    ```
    git clone https://github.com/papatekken/coman coman
    ```
3. In local directory 'coman'(directory with the repository content cloned ), check package.json to make sure all required packages are installed

4. Duplicate the `env.example` file and edit the ".env" file for your own setting
	```
    cp .env.example .env
    ```
	
	- [okta](https://www.okta.com/) account is needed, as it handles the authentication of COMAN system.
	- [mongodb](https://www.mongodb.com/) account is needed, as it is used for cloud database for COMAN system.

5. In root directory of 'coman', run following command to start the application
	```
	npm start
	```
	
## Planned implementation
- pagination of patient/consulation list
- print receipt
- print leave paper
- display list of last 10 consultations
- edit page for preset formula, which can be applied in prescription as predefined medicine selection

## License
[GNU AGPLv3](https://github.com/papatekken/coman/LICENSE)

## Contact
Created by [@papatekken](papatekken@gmail.com) - feel free to contact me!