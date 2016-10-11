# morar-client
A Node.js module for interfacing with Morar

## Installation

`npm i -S morar-client`

## Configuration

To store information in the Morar service, first include and configure it in your Node.js project like so:

```
const morar = require('morar-client').config({
	token : "VALID_MORAR_TOKEN",
	name : "NAME_WITH_WHICH_TO_INDEX_YOUR_DATA"
});
```

The token and name paramters are mandatory. If not set, an error will be thrown when data is passed to be stored.

### Environment variables

You can set the `name` and `token` values the morar-client requires by setting the environment variables `MORAR_NAME` and `MORAR_TOKEN`. Once done, you choose to store data in one of the following ways

```
// Option 1
const morar = require('morar').config();
morar('TEST_DATA_TO_STORE');

// Option 2
// const morar = require('morar');
morar.store('MORE_TEST_DATA_TO_STORE');
```
Note, you only have to call the store object if you don't call the config function. If you do call the config function on initialisation, you'll be unable to call the .store function. 

## Usage

Storing data with the morar-client is simple. To send data to the Morar service, call the object you assigned the required the client to and pass the data you wish to store in one of the following ways

```
// Saving a string
morar("SIMPLE_DEMO_STRING");

// Saving a string with additional filter fields
morar("SIMPLE_DEMO_STRING", {madeBy : "Joe Bloggs", arana : "discoteca"})

``` 

The first argument on the Morar object is the data you wish to store, and is required. The data can be a string, object or readable stream. The second argument are parameters that can be added to the record that is created when an object is stored. These fields can be used to filter items you have stored using Morar.

```
// Saving an object
morar({
	name : 'The Beatles',
	members : ['John', 'Paul', 'George', 'Ringo'],
	haveTicketToRide : true
});

// Saving a readable stream
morar(fs.createReadStream('./humorous_cat_animation.gif'), {catType : 'grumpy'});

```

## Responses

If you wish to log a response confirming that morar-client successfuly stored your data, the interface is promise-based. 

```
morar("SIMPLE_DEMO_STRING")
	.then(response => {
		console.log(response); // {"status":"ok","id":"[ITEM_UUID]"}
	})
	.catch(err => {
		// If morar-client can't save the data passed,
		// it will reject the promise, which you can handle here.
		console.log(err);
	})
;

```