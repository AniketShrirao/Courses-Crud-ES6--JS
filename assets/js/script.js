/* Author: Aniket*/

// Customer Class: Represents a Customer
class Customer {
	constructor(name, Course, author) {
		this.name = name;
		this.course = Course;
		this.author = author;
	};
}

var idCount = 0;
// UI Class: Handle UI Tasks
class UI {
	static displayCustomers() {
		const Customers = Store.getCustomers();
		Customers.forEach((ExisitingMember) => 
		UI.displayCustomerInDom(ExisitingMember.pictureSource, ExisitingMember));
	}

	static addCustomerToList(NewCustomer) {
		const Url = 'https://randomuser.me/api/';
		fetch(Url)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				NewCustomer.id = idCount;
				NewCustomer.pictureSource = data.results[0].picture.medium;
				Store.addCustomer(NewCustomer);
				let pictureSource = data.results[0].picture.medium;
				console.log(pictureSource);
				UI.displayCustomerInDom(pictureSource, NewCustomer);
				idCount++;
			})
			.catch(function (err) {
				UI.showAlert("Something went wrong!: " + err, 'message');
			});
	}

	static displayCustomerInDom(pictureSource, NewCustomer) {
		const list = document.querySelector('.customer-list');
		const customerLi = document.createElement('li');
		customerLi.innerHTML = `
			<img src="${pictureSource}" class="customer-img" alt="${NewCustomer.name}">
			<ul class="customer-details">
				<li>
					<span class="label-name">name :</span>
					<span id="customer-name">${NewCustomer.name}</span>
				</li>
				<li>
					<span class="label-course">course :</span>
					<span id="customer-course">${NewCustomer.course}</span>
				</li>
				<li>
					<span class="label-author">author :</span>
					<span id="Customer-author">${NewCustomer.author}</span>
				</li>
			</ul>
			`;
		customerLi.classList.add('customer');
		customerLi.setAttribute('data-Id', NewCustomer.id)
		list.appendChild(customerLi);
	}

	static deleteCustomer(el) {
		if (el.classList.contains('customer')) {
			el.remove();
		}
	}

	static showAlert(message, className) {
		if (className === 'error') {
			const errorSpans = document.querySelectorAll('.error');
			errorSpans.forEach((errorSpan) => {
				errorSpan.className = `${className} visible`;
				errorSpan.innerText = message;
			})
		} else {
			const messageSpan = document.createElement('span');
			messageSpan.className = `${className} visible`;
			messageSpan.innerText = message;
			const mainWrapper = document.querySelector('main h3');
			mainWrapper.appendChild(messageSpan);
		}
		// Vanish in 3 seconds
		setTimeout(() => document.querySelector('.visible').remove(), 3000);
	}

	static clearFields() {
		document.querySelector('#name').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#course').value = '';
	}
}

// Store Class: Handles Storage
class Store {
	static getCustomers() {
		let Customers;
		if (localStorage.getItem('Customers') === null) {
			Customers = [];
		} else {
			Customers = JSON.parse(localStorage.getItem('Customers'));
		}

		return Customers;
	}

	static addCustomer(NewCustomer) {
		const Customers = Store.getCustomers();
		if (NewCustomer.id !== undefined) {
			Customers.push(NewCustomer);
			localStorage.setItem('Customers', JSON.stringify(Customers));
		}
	}

	static removeCustomer(el) {
		if (el.classList.contains('customer')) {
			const Customers = Store.getCustomers();
			let ExistingCustomer = el;
			Customers.splice(Customers.findIndex(e => 
				e.id == ExistingCustomer.dataset.id), 1);
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

	// Validate
	if (name === '' || author === '' || Course === '') {
		UI.showAlert('Please fill in all fields', 'error');
	} else {
		// Instatiate Customer
		const NewCustomer = new Customer(name, Course, author);

		// Add Customer to UI
		UI.addCustomerToList(NewCustomer);

		// Add Customer to store
		// Store.addCustomer(NewCustomer);

		// Show success message
		UI.showAlert('Customer Added', 'message success');

		// Clear fields
		UI.clearFields();
	}
});

// Event: Remove a Customer
function RemoveACustomer() {
	document.querySelectorAll('.customer').forEach((element) => {
		element.addEventListener('click', (e) => {

			// Remove Customer from store
			Store.removeCustomer(element);
			// Remove Customer from UI
			UI.deleteCustomer(element);
			// Show success message
			UI.showAlert('Customer Removed', 'success');
		});
	});

}
if (document.querySelector('.customer-list').childElementCount !== 0) {
	setInterval(RemoveACustomer, 2000);
} else { clearInterval(RemoveACustomer, 2000); }
