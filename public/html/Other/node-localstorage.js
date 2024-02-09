// Import the node-localstorage library
const { LocalStorage } = require("node-localstorage");

// Create a new instance of LocalStorage
const localStorage = new LocalStorage("./local-storage");

// After the user has logged in and their details have been authenticated,
// you can save their details to local storage like this:
const user = {
  id: "1234",
  name: "John Doe",
  email: "john.doe@example.com",
};
localStorage.setItem(`user`, JSON.stringify(user));
// localStorage.removeItem(`user`, JSON.stringify(user));
