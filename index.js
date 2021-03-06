'use strict';

const dotenv = require('dotenv').config({silent : true});
const debug = require('debug')('morar-client:index');
const fs = require('fs');

const requestProtocol = process.env.ENV === 'development' ? require('http') : require('https');
const FormData = require('form-data');

const serviceHost = `morar.ft.com`;

const opts = {
	token : process.env.MORAR_TOKEN || undefined,
	name : process.env.MORAR_NAME || undefined
};

function checkValuesAreSet(){
	
	if( (opts.name === undefined || opts.name === '') ){
		throw `You must pass a 'name' value when you configure the Morar client. You can also set the environment variable MORAR_NAME.`;
	}

	if( (opts.token === undefined || opts.token === '') ){
		throw `You must pass a 'token' value when you configure the Morar client. You can also set the environment variable MORAR_TOKEN.`;
	}

}

function storeData(data, params){

	checkValuesAreSet();

	let requestBody = data;
	let queryParams = '';

	if(params !== undefined){

		Object.keys(params).forEach(key => {
			queryParams += `&${key}=${encodeURIComponent(params[key])}`;
		});

	} else if(data === undefined){
		throw "No parameters or data was passed";
	}

	debug(`Passed values:`);
	debug(queryParams, requestBody);
	debug(typeof data);

	const form = new FormData();

	if(requestBody !== undefined && requestBody !== ''){

		// It's a string, so we save it as a text file
		if(typeof(data) === 'string'){
			debug('Body is String');
			form.append('data', requestBody);
		}

		if(typeof(data) === 'object'){

			try{
				form.append('data', JSON.stringify(requestBody));
			} catch (err) {
				debug(err);
				throw "Object passed was not JSON";
			}

		}

		// It's a readable stream, so we'll save it as a binary file
		if(typeof data.on === 'function'){
			debug('Body is Buffer');
			form.append('f', data);
		}

	}

	return new Promise( (resolve, reject) => {
		
		const request = requestProtocol.request({
			method: 'POST',
			host: serviceHost,
			path: `/store?name=${ encodeURIComponent(opts.name)}&token=${opts.token}${queryParams}`,
			headers: form.getHeaders(),
			port : 443
		});

		request.on('response', function(res) {

			debug(res.statusCode);
			res.setEncoding('utf8');

			var b = "";

			res.on('data', (chunk) => {
				b += chunk;
			});

			res.on('end', () => {
				debug(b);

				if(res.statusCode !== 200){
					try{
						reject(JSON.parse(b));
					} catch(err){
						reject({
							status : 'error',
							reason : 'morar-client was unable to parse the response from Morar service',
							details : [err, b]
						});
					}
				} else {
					resolve(JSON.parse(b));
				}

			});

		});

		request.on('error', (e) => {
			reject(e.message);
		});

		form.pipe(request);

	} );

}

function setConfigurationOptions(options){

	debug(options);

	if(options !== undefined){
		Object.keys(options).forEach(key => {
			opts[key] = options[key];
		});
	}

	debug(opts);

	checkValuesAreSet();

	return storeData;

}

module.exports = {
	config : setConfigurationOptions,
	store : storeData
};