import messageModel from '../Models/messageModel.js';
//import { nextApiRequest, nextApiResponse } from 'next'
import bcrypt from 'bcrypt'

export const addMessage = async (req , res) => {
    const {chatId, senderId, text} = req.body
    const message = new messageModel({
        chatId,
        senderId,
        text
    })

try {
    const result = await message.save();
    res.status(200).json(result)
} catch (error) {
    res.status(500).json({error})
}
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
      const result = await messageModel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const findChat = async (req , res) => {
    try {
        const chat = await chatModel.findOne({members: {$all: [req.params.firstId, req.params.secondId]}});
        res.status(200).json(chat)
       
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

