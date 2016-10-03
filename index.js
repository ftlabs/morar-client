'use strict';

const dotenv = require('dotenv').config({silent : true});
const debug = require('debug')('morar-client:index');
const fetch = require('node-fetch');

const serviceProtocol = `https`;
const serviceHost = `morar.ft.com`;

const opts = {
	token : undefined,
	name : undefined
};

function storeData(data, params){

	const reqURL = `${serviceProtocol}://${serviceHost}/store?name=${opts.name}&token=${opts.token}`;
	const requestBody = data;
	var queryParams = '';

	if(params !== undefined){

		Object.keys(params).forEach(key => {
			queryParams += `&${key}=${params[key]}`;
		});

	}

	debug(reqURL, queryParams, `${reqURL}${queryParams}`);

}

function setConfigurationOptions(options){

	debug(options);

	Object.keys(options).forEach(key => {
		opts[key] = options[key];
	});

	if(opts.name === undefined){
		throw "You must pass a 'name' value when you configure the Morar client";
	}

	if(opts.token === undefined){
		throw "You must pass a 'token' value when you configure the Morar client";
	}

	return storeData;

}

module.exports = {
	config : setConfigurationOptions,
	store : storeData
};