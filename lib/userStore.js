// Simple in-memory store for demonstration purposes
const users = [];

export const addUser = (username, password) => {
  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    console.log('Add user failed: Username already exists');
    return { success: false, message: 'Username already exists. Please choose another one.' };
  }
  // Add new user to the store
  users.push({ username, password });
  console.log('User added:', { username, password });
  console.log('Current users:', users);
  return { success: true, message: 'Account created successfully!' };
};

export const authenticateUser = (username, password) => {
  // Check if user exists and password matches
  const user = users.find(user => user.username === username && user.password === password);
  console.log('Authentication attempt:', { username, password });
  console.log('Authentication result:', user ? 'Success' : 'Failure');
  return user ? { success: true } : { success: false, message: 'Invalid username or password.' };
};

export const getUsers = () => users; 