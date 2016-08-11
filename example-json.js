var person = {
	name: 'Musta',
	age: 22
};

var personJSON = JSON.stringify(person);

console.log(personJSON);
console.log(typeof personJSON);

var personObject = JSON.parse(personJSON);
console.log(personObject.name);
console.log(typeof personObject);

console.log('--CHALLENGE AREA--');

var animal = '{"name": "Johnny"}';
var animalObj = JSON.parse(animal);
console.log(animalObj);
animalObj.age = 10;

var animalJSON = JSON.stringify(animalObj);
console.log(animalJSON);
