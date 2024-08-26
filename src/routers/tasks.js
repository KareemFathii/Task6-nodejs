const express = require('express');
const auth = require('../../Middleware/auth');
const Task = require('../models/tasks');
const router = express.Router()



router.post('/tasks', auth ,async (req, res) => {
    try{
        const task = new Task({...req.body , ownerID : req.user.id}) ;
        await task.save();
        res.status(200).send(task);
    }
    catch(error){
        res.status(400).send(error.message);
    }  
})

router.get('/tasks', auth,async (req, res) => {
    try{

        const task = await Task.find({});
        res.status(200).send(task);
    }   
    catch(error){
        res.status(500).send(error.message);
    }

})
////////////////////////////////////////////////////////////////////
router.post('/tasks/:id', auth,async (req, res) => {
    try{
      const id = req.params.id;
      const task = Task.findOne({_id:id ,  ownerID : req.user._id });
      res.status(200).send(task);
    }
    catch(error){
        res.status(500).send(error.message);
    }  
})
router.patch('/tasks/:id', auth,async (req, res) => {
    try{
      const id = req.params.id;
      const task = Task.findOneAndUpdate({_id:id} , req.body, {
        new: true, 
        runValidators: true
      })
      res.status(200).send(task);
      }
    catch(error){
        res.status(500).send(error.message);
    }  
})
router.delete('/tasks/:id', auth,async (req, res) => {
    try{
      const id = req.params.id;
      const task = Task.findOneAndDelete({_id:id} )
      res.status(200).send(task);
      }
    catch(error){
        res.status(500).send(error.message);
    }  
})

///////////////////////////////////////////
module.exports = router;