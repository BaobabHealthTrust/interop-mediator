# OpenHIM INTEROP-MEDIATOR

The mediator will synchronization facilities between DHIS2 and MHFR.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following are the softwares that you need to install to work with the mediator:

* [OpenHim ](https://openhim.readthedocs.io/en/latest/ "openHim")
* [NodeJS > v8.12.0](https://nodejs.org/en/download/ "node")
* [Mongo](https://www.mongodb.com/ "mongo")

Note: click on the link and follow the instructions.

### Installing
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

#### Step 1 clone

Clone this repository into your local directory, Use the command below:

```sh
# Clone project to a computer
git clone https://github.com/BaobabHealthTrust/interop-mediator.git

# Navigate to the project root directory
cd interop-mediator
```

#### Step 2 dependancies

Install all the dependancies.

```sh
# install backend dependancies
npm install
```

### step 3 configure mediator

Create a `.env` file with the contents of your `.env.example` file.

```sh
# copy the .env.example to .env file
cp .env.example .env
```

Modify the `.env` file and make sure it reflects your mongo and openHIM settings.
Furthermore, set the mediator configurations found in `config/mediator.json`<br/>

```sh
# navigate to config directory.
cd config/

# copy mediator.example.json to mediator.json file
cp mediator.example.json mediator.json

# Modify mediator.json in the terminal or text editor
# remember to use inet for the host in the mediator.json file.

# navigate to the root directory
cd ..
```

## Running the tests

Run the tests and make sure they are all passing:

```sh
npm test
```

## Run the mediator

Once the admin user has been generated, you are now ready to start the backend server by running `node .`

```sh
# run the server
npm start
```

## Step up openHIM channel

Add the channel created by the mediator in openHIM, use the following steps:

* login openHIM console.
* In the sidebar, click on Mediators.
* In the content area, click on Mediator with the name you configured in mediator.json
* Finnally, click on a green plus symbol to create the channel.

### Happy coding
