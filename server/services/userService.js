// services/userService.js

// Sample user data (in-memory database)
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
];

const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    return users.find((user) => user.id === parseInt(userId));
  },

  // Create a new user
  createUser: async (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  // Update an existing user
  updateUser: async (userId, userData) => {
    const index = users.findIndex((user) => user.id === parseInt(userId));
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      return users[index];
    }
    return null; // User not found
  },

  // Delete a user
  deleteUser: async (userId) => {
    const index = users.findIndex((user) => user.id === parseInt(userId));
    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      return deletedUser[0];
    }
    return null; // User not found
  },
};

export default userService;
