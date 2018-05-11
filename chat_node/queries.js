var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({host: 'localhost', port: 5432, database: 'chat', user: 'postgres', password: 'postgres'});

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  getMessages: getMessages,
  createUser: createUser,
  createMessage: createMessage
};

function getUsers(req, res, next){
	db.any('select * from chatusers')
		.then(function (data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved all users'
				});
		})
		.catch(function (err) {
			return next(err);
		});
}

function getUser(req, res, next){
	var userId = parseInt(req.params.id);
	db.one('select * from chatusers where id = $1', userId)
		.then(function (data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved user with id $1'
				});
		})
		.catch(function (err) {
			return next(err);
		});
}

function getMessages(req, res, next){
	req.body.my_id = parseInt(req.body.my_id) || req.query.my_id;
	req.body.their_id = parseInt(req.body.their_id) || req.query.their_id;
	db.any('select * from messages WHERE $1 IN (to_id, from_id) AND $2 IN (to_id, from_id) ORDER BY timestamp ASC', [req.body.my_id, req.body.their_id])
		.then(function (data) {
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved all relevant messages ' + req
				});
		})
		.catch(function (err) {
			return next(err);
		});
}

function createUser(req, res, next) {
  db.none('insert into chatusers(name)' +
      'values(${name})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one user'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createMessage(req, res, next) {
  req.body.to_id = parseInt(req.body.to_id) || req.query.to_id;
  req.body.from_id = parseInt(req.body.from_id) || req.query.from_id;
  req.body.text = req.body.text || req.query.text;
  req.body.timestamp = req.body.timestamp || req.query.timestamp;
  db.none('insert into messages(to_id, from_id, text, timestamp)' +
      'values(${to_id}, ${from_id}, ${text}, ${timestamp})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one message'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

