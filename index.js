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

function storeData(data, params){

	let requestBody = data;
	let queryParams = '';

	if(params !== undefined){

		Object.keys(params).forEach(key => {
			queryParams += `&${key}=${params[key]}`;
		});

	}

	debug(`Passed values:`);
	debug(queryParams, requestBody);

	const form = new FormData();

	if(requestBody !== undefined && requestBody !== ''){

		if(typeof(data) === 'string'){
			debug('Body is String');
			form.append('data', requestBody);
		}

	}

	return new Promise( (resolve, reject) => {
		
		const request = requestProtocol.request({
			method: 'POST',
			host: serviceHost,
			path: `/store?name=${opts.name}&token=${opts.token}${queryParams}`,
			headers: form.getHeaders(),
			port : 443
		});

		request.on('response', function(res) {

			res.setEncoding('utf8');

			var b = "";

			res.on('data', (chunk) => {
				b += chunk;
			});

			res.on('end', () => {
				debug(b);
				resolve(JSON.parse(b) );
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

	if(opts.name === undefined){
		throw `You must pass a 'name' value when you configure the Morar client. You can also set the environment variable MORAR_NAME.`;
	}

	if(opts.token === undefined){
		throw `You must pass a 'token' value when you configure the Morar client. You can also set the environment variable MORAR_TOKEN.`;
	}

	return storeData;

}

module.exports = {
	config : setConfigurationOptions,
	store : storeData
};