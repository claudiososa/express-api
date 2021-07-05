const Joi = require('joi');
const express = require('express');

const app  = express();

app.use(express.json());

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

    if ( error ) return res.status(400).send(error.details[0].message);

    const item = [
        {
        'id' : genres.length + 1,
        'name': req.body.name
        }
    ]

    genres.push(item);

    res.send(item);
})

const port = process.env.PORT || 3000;

function validateGenres(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

app.listen(port, () => console.log('Listengin on port 4000'));
