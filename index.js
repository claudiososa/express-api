const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const auth = require('./auth');
const Joi = require('joi');
const express = require('express');

const app  = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`env ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(logger);

app.use(auth);

app.use(helmet());

if( app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgaon enabled...');
}


const genres = [
    {id:1,name:'action'},
    {id:2,name:'horror'},
    {id:3,name:'whatever'},
]


app.get('/api/genres', (req, res) => {
    res.send(genres);
})

app.post('/api/genres/', (req, res) => {

    const { error } = validateGenres(req.body);

    if ( error ) return res.status(404).send(error.details[0].message);

    const item = 
        {
        'id' : genres.length + 1,
        'name': req.body.name
        }
    
    genres.push(item);

    res.send(item);
})

app.put('/api/genres/:id', (req, res) => {

    //validate data
    const { error } = validateGenres(req.body);

    if ( error ) return res.status(404).send(error.details[0].message);

    //find genre in genres    
    const genre = genres.find( item => item.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The ID  was not found');

    // assign name to genre
    genre.name = req.body.name;
    res.send(genre);
})

app.delete('/api/genres/:id', (req, res) => {

    const genre = genres.find( item => item.id === parseInt(req.params.id));
    
    if(!genre) return res.status(404).res.send('The genre with this ID was not found');

    const index = genres.indexOf(genre);
    
    genres.splice(index, 1);

    res.send(genre);
})

function validateGenres(course){
    const schema = {
        name: Joi.string().min(5).required()
    }
    return Joi.validate(course, schema);
}


const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listengin on port 4000'));
