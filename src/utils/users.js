const users = [];

// addUser, removeUser, getUser, getUsers

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: `Username and room is required!`,
        };
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate username
    if (existingUser) {
        return {
            error: `Username is in use!`
        }
    }

    // store user
    const newUser = { id, username, room };
    users.push(newUser);

    return newUser;
};

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index != -1) {
        return users.splice(index, 1)
    }
}