console.log('starting password manager');

var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync();


var argv = require('yargs')
	.command('create', 'Create an account', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Name of the website goes here',
				type: 'string'
			}, 
			username: {
				demand: true,
				alias: 'u',
				description: 'Your username goes here',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'Your password goes here',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Your master password here',
				type: 'string'
			}
		}).help('help');
	})
	.command('get', 'Get account details', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Name of website account goes here',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Your master password here',
				type: 'string'
			}
		}).help('help');
	})
	.command('edit', 'Edit account details', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Name of the website account you want to edit',
				type: 'string'
			},
			username: {
				demand: false,
				alias: 'u',
				description: 'New account username',
				type: 'string'
			},
			password: {
				demand: false,
				alias: 'p',
				description: 'New account password',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Your master password here',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;

var command = argv._[0];

function getAccounts(masterPassword) {
	var encryptedAccounts = storage.getItemSync('accounts');
	var accounts = [];
	if (typeof encryptedAccounts !== 'undefined'){
		var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}
	
	return accounts;
	// getItemSync() - fetch accounts
	// decrypt
	// return accounts array
}

function saveAccounts(accounts, masterPassword) {
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
	storage.setItemSync('accounts', encryptedAccounts.toString());
	return accounts;
	// encrypt accounts
	// setItemSync('accounts', accounts);
	// return accounts
}

function overwriteAccount(newAccount, accounts) {
	for (var i = accounts.length - 1; i >= 0; i--) {
		if (accounts[i].name === newAccount.name) {
			accounts[i] = newAccount;
		}
		console.log('Account overwritten!');
		return;
	}
}

function createAccount(account, masterPassword) {
	//if (masterPassword is correct)

	var accounts = getAccounts(masterPassword);	
	accounts.push(account);
	saveAccounts(accounts, masterPassword);
	return account;
}

function getAccount(accountName, masterPassword) {
	var accounts = getAccounts(masterPassword);
	var matchedAccount;
	accounts.forEach(function (account) {
		if (account.name === accountName){
			matchedAccount = account;
			return;
		}
	})

	return matchedAccount;
}


if (command === 'create') {
	try {
		console.log('Adding account...')
		createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword)
		console.log(argv.name + ' account created!');
	} catch (e) {
		console.log('Unable to create account!');
	}
	
} else if (command === 'get') {
	try {
		var account = getAccount(argv.name, argv.masterPassword);

		if (typeof account === 'undefined') {
			console.log('Account not found');
		} else {
			console.log('Account found!');
			console.log(account);
		}
	} catch (e) {
		console.log('Unable to fetch account!');
	}
		
} else if (command === 'edit') {
	try {
		console.log(argv);
		var account = getAccount(argv.name, argv.masterPassword);

		if (typeof argv.username !== 'undefined') {
			account.username = argv.username;
		}

		if (typeof argv.password !== 'undefined') {
			account.password = argv.password;
		}
		console.log(account);
		var updatedAccounts = getAccounts(argv.masterPassword)
		overwriteAccount(account, updatedAccounts);
		saveAccounts(updatedAccounts, argv.masterPassword);
	} catch (e) {
		console.log(e);
	}
}