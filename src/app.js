import express from 'express';
import db from './utils/database.js';
import Todo from './models/todo.model.js';
import cors from 'cors'

Todo;

const app = express()
const PORT = process.env.PORT ?? 8000
app.use(express.json())
app.use(cors())

db.authenticate()
    .then( () => console.log('conexion correcta'))
    .catch( (err) => console.log(err))

db.sync()
    .then(()=> console.log('base de datos sincronizada'))
    .catch((err)=> console.log(err))


app.get('/', (req, res)=>{
    res.send('OK')
})

app.get('/todos', async (req, res)=>{
    try {
        const todos = await Todo.findAll()
        res.json(todos);
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/todos', async (req, res) => {
    try {
        const { body } = req
        const todo = await Todo.create(body)
        res.status(201).json(todo)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req
        const todo = await Todo.update(body, {
            where: {id}
        })
        res.json(todo)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/todos/:id', async (req, res) => {
    try{
        const { id } = req.params
        await Todo.destroy({
            where:{id}
        })
        res.status(204).end()
    }
    catch(error){
        res.status(400).json(error)
    }
})

app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const todo = await Todo.findByPk(id)
        res.json( todo )
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`)
})
