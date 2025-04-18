console.clear()
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(express.json()); //enable parsing JSON body data
app.use (cors({ origin: '*'}))

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({
        message: `home -- Desafio FullStack api`
    });
});

// routing middleware
app.use('/users', require('./routes/users.routes.js'))
app.use('/tickets', require('./routes/tickets.routes.js'))
app.use('/states', require('./routes/states.routes.js'))
app.use('/departments', require('./routes/departments.routes.js'))

// handle invalid routes
// app.get('/*', function (req, res) {
//     res.status(404).json({ message: 'The path especified could not be found' });
// })

const server = app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));

module.exports = app
module.exports = server