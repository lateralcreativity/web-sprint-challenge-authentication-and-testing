const db = require('../database/dbConfig');

module.exports = {
    add,
    getBy
}

function getById(id) {
    return db('users as u')
    .where({ id: id })
    .select('u.id', 'u.username')
    .first();
}

function getBy(filter) {
    return db("users as u")
    .where(filter)
    .select('u.id', "u.username", 'u.password')
    .orderBy("u.id");
}

function add(user) {
    return db('users')
    .insert(user, 'id')
    .then(id => {
        return getById(id)
    })
}