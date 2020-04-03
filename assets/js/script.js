/* Author: Aniket*/

// Customer Class: Represents a Customer
class Customer {
	constructor(name, Course, author) {
		this.name = name;
		this.course = Course;
		this.author = author;
	};
}
//  To maintain count of Customer
var idCount = 0;
// UI Class: Handle UI Tasks
class UI {
	// function to display on load
	static displayCustomers() {
		const Customers = Store.getCustomers();
		Customers.forEach((existingMember) =>
			UI.displayCustomerInDom(existingMember.pictureSource, existingMember));
	}

	// function to display on click
	static addCustomerToList(newCustomer) {
		// api Url to retrieve a random image for every user
		const Url = 'https://randomuser.me/api/';
		fetch(Url)
			.then(function (response) {
				return response.json();
			}) //Api gives us an object in return we destructre only an image Source from that object
			.then(function ({ results: { 0: { picture: { medium: profilePicture } } } } = data) {
				newCustomer.id = idCount;
				newCustomer.pictureSource = profilePicture;
				// Adds Customer to localstorages
				Store.addCustomer(newCustomer);
				idCount++;
				// Clear  input fields
				UI.clearFields();
				let pictureSource = profilePicture;
				// display customer card in Dom
				UI.displayCustomerInDom(pictureSource, newCustomer);
				// Show success message
				UI.showAlert('Customer Added', 'message-success');
			})
			.catch(function (err) {
				console.log("Something went wrong!: " + err);
			});
	}
	// display customer card in Dom
	static displayCustomerInDom(pictureSource, newCustomer) {
		const list = document.querySelector('.customer-list');
		const customerLi = document.createElement('li');
		customerLi.innerHTML = `
			<img src="${pictureSource}" class="customer-img" alt="${newCustomer.name}">
			<ul class="customer-details">
				<li>
					<span class="label-name">name :</span>
					<span id="customer-name">${newCustomer.name}</span>
				</li>
				<li>
					<span class="label-course">course :</span>
					<span id="customer-course">${newCustomer.course}</span>
				</li>
				<li>
					<span class="label-author">author :</span>
					<span id="Customer-author">${newCustomer.author}</span>
				</li>
			</ul>
			`;
		customerLi.classList.add('customer');
		customerLi.setAttribute('data-Id', newCustomer.id)
		list.appendChild(customerLi);
	}

	// remove customer card from Dom
	static deleteCustomer(el) {
		if (el.classList.contains('customer')) {
			el.remove();
		}
	}
	// displays an alert message
	static showAlert(message, className) {
		if (className === "error") {
			let errorSpans = document.querySelectorAll('.error');
			errorSpans.forEach((errorSpan) => {
				if (errorSpan.previousElementSibling.value === "") {
					errorSpan.className = `${className} visible`;
					errorSpan.innerText = message;
				}
			})
		} else if (className === "message-error" || className === "message-success") {
			const messageSpan = document.createElement('span');
			const headingElement = document.querySelector('main h3');
			messageSpan.className = `${className} visible`;
			messageSpan.classList.add('message');
			messageSpan.innerText = message;
			headingElement.appendChild(messageSpan);
		}
		// alert Vanishes in 3 seconds
		setTimeout(() => {
			document.querySelectorAll('.visible').forEach((element) => {
				element.classList.remove('visible');
			})
		}, 3000);
	}

	// Clear  input fields
	static clearFields() {
		document.querySelector('#customer-form').reset();
	}
}

// Store Class: Handles Storage
class Store {
	// Get Customer objects from LocalStorage
	static getCustomers() {
		let Customers;
		if (localStorage.getItem('Customers') === null) {
			Customers = [];
		} else {
			Customers = JSON.parse(localStorage.getItem('Customers'));
		}

		return Customers;
	}

	// Add Customer objects to LocalStorage
	static addCustomer(newCustomer) {
		const Customers = Store.getCustomers();
		if (newCustomer.id !== undefined) {
			Customers.push(newCustomer);
			localStorage.setItem('Customers', JSON.stringify(Customers));
		}
	}

	// Remove Customer objects from LocalStorage
	static removeCustomer(el) {
		if (el.classList.contains('customer')) {
			const Customers = Store.getCustomers();
			let existingCustomer = el;
			// finding an id through filtering and splicing that object from array
			Customers.splice(Customers.findIndex(e =>
				e.id == existingCustomer.dataset.id), 1);
			localStorage.setItem('Customers', JSON.stringify(Customers));
		}
	}
}

// Event: Display Customers
document.addEventListener('DOMContentLoaded', UI.displayCustomers);
// Event: Add a Customer
document.querySelector('#customer-form').addEventListener('submit', (e) => {
	// Prevent actual submit
	e.preventDefault();

	// Get form values
	const name = document.querySelector('#name').value;
	const Course = document.querySelector('#course').value;
	const author = document.querySelector('#author').value;
	let anyError = false;
	// Validate
	if (name === '' || author === '' || Course === '') {
		UI.showAlert('Please fill this field!', 'error');
	}
	let errorSpans = document.querySelectorAll('.error');
	errorSpans.forEach((errorSpan) => {
		if (errorSpan.classList.contains('visible')) {
			anyError = true;
		} else if (!anyError) {
			anyError = false;
		}
	});
	if (!anyError) {
		// Instatiate Customer
		const newCustomer = new Customer(name, Course, author);
		// Add Customer to UI
		UI.addCustomerToList(newCustomer);
	}
});

// Event: Remove a Customer
setInterval(() => {
	document.querySelectorAll('.customer').forEach((element) => {
		element.addEventListener('click', removeACustomer);
	});
}, 2000);

function removeACustomer(element) {
	// Remove Customer from store
	Store.removeCustomer(element.currentTarget);
	// Remove Customer from UI
	UI.deleteCustomer(element.currentTarget);
	// Show error message
	UI.showAlert('Customer Removed', 'message-error');
}
