const express = require('express');
const router = express.Router();
const customError =require('./customError')
const mongoose = require("mongoose");
const { check ,validationResult} = require('express-validator');
const { Todo } = require('./todoModel');
const todoModel = require('./todoModel');


router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().exec();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting todos' });
  }
});

router.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).exec();
    if (!todo) {
      res.status(404).send({ message: 'Todo not found' });
    } else {
      res.json(todo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting todo' });
  }
});

const allowedStatus = ["to-do", "in-progress", "done"];

router.post('/api/todos', async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title || !status) {
      throw new Error('Title and status are required');
    }
    const newTodo = await todoModel.create({ title, status });
    res.status(200).send(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating new todo' });
  }
});


// router.post('/api/todos', [
//   check('title', 'Title is required').trim().escape(),
//   check('status', 'Status is required').trim().escape(),
//   check('status', 'Status should be one of “to-do”, “in-progress”,” done”').isIn(allowedStatus).escape().trim()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { title, status } = req.body;
//     if (!['to-do', 'in-progress', 'done'].includes(status)) {
//       throw new Error('Invalid status');
//     }
//     const newTodo = new Todo({
//       title,
//       status
//     });
//     await newTodo.save();
//     res.json(newTodo);
//   } catch (error) {
//     console.error(error);
//    res.status(500).send({ message: 'Error creating todo' });
//   }
// });


  router.patch('/api/todos/:id', [
    check('title', 'Title is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty(),
    check('status', 'Status should be one of “to-do”, “in-progress”,” done”').isIn(['to-do', 'in-progress', 'done'])
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!todo) {
        res.status(404).send({ message: 'Todo not found' });
      } else {
        fs.writeFileSync('./todo.json', JSON.stringify(await Todo.find().exec(), null, 2));
        res.json(todo);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error updating todo' });
    }
  });

router.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndRemove(req.params.id).exec();
    if (!todo) {
      res.status(404).send({ message: 'Todo not found' });
    } else {
      res.json({ message: 'Todo deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting todo' });
  }
});

module.exports = router;


