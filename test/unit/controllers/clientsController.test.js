/* eslint-disable global-require */
const chai = require('chai');
const td = require('testdouble');

const { expect } = chai;

describe('clientsController', () => {
	afterEach(() => {
		td.reset();
	});

	it('#get should return clients list', async () => {
		const clientsList = [
			{ id: 'someid' },
		];

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.getList()).thenResolve(clientsList);

		const testedController = require('../../../src/controllers/clientsController');
		const getResult = await testedController.get();

		expect(getResult)
			.to.be.an('array')
			.that.equals(clientsList);
	});

	it('#getOne should return one client', async () => {
		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.getOne('some-client-id')).thenResolve({ id: 'some-client-id' });

		const testedController = require('../../../src/controllers/clientsController');
		const getOneResult = await testedController.getOne({ params: { clientId: 'some-client-id' } });

		expect(getOneResult)
			.to.be.an('object')
			.and.has.property('id')
			.that.equals('some-client-id');
	});

	it('#createOne should create one client', async () => {
		const req = {
			body: {
				phoneNumber: '+4407777712333',
				firstname: 'John',
				surname: 'Doe',
			},
		};

		const validator = td.replace('../../../src/helpers/validator');
		td.when(validator.validate(td.matchers.isA(String), req.body))
			.thenReturn({ valid: true });

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.hashClient(req.body))
			.thenReturn('test-record-#');
		td.when(clientModel.createOne(req.body, 'test-record-#'))
			.thenResolve({ client: 'client-created' });

		const testedController = require('../../../src/controllers/clientsController');
		const createOneResult = await testedController.createOne(req);

		expect(createOneResult)
			.to.be.an('object')
			.and.has.property('client')
			.that.is.an('string');
	});

	it('#updateOne should return success', async () => {
		const req = {
			params: { clientId: 'some-client-id' },
			body: {
				firstname: 'John',
				surname: 'Doe',
			},
		};

		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.updateOne('some-client-id', req.body)).thenResolve();

		const testedController = require('../../../src/controllers/clientsController');
		const updateOneResult = await testedController.updateOne(req);

		expect(updateOneResult)
			.to.be.an('object')
			.and.has.property('message')
			.that.is.an('string')
			.that.equals('success');
	});

	it('#deleteOne should return success', async () => {
		const clientModel = td.replace('../../../src/models/ClientModel');
		td.when(clientModel.deleteById('some-client-id')).thenResolve();

		const testedController = require('../../../src/controllers/clientsController');
		const deleteOneResult = await testedController.deleteOne({ params: { clientId: 'some-client-id' } });

		expect(deleteOneResult)
			.to.be.an('object')
			.and.has.property('message')
			.that.is.an('string')
			.that.equals('success');
	});
});