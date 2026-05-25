import Quest from "../models/Quest.js";
import mongoose from "mongoose";


export const createQuest = async (req, res) => {
	try {
		const { title } = req.body;

		if (!title) {
			return res.status(400).json({
				message: "Title is required",
			});
		}
		const existingQuest = await Quest.findOne({
			userId: req.user.userId,
			title: { $regex: `^${title}$`, $options:"i"},
		});

		if (existingQuest) {
			return res.status(400).json({
				message: "Quest already exists",
			});
		}
		const quest = await Quest.create({
			userId: req.user.userId,
			title,
		});

		res.status(201).json(quest);
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};


export const getQuests = async (req, res) => {
	try{
		const quests = await Quest.find({
			userId: req.user.userId,
		}).sort({ createdAt: -1 });

		res.status(200).json(quests);
	} catch(error){
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};


export const renameQuest = async (req, res) => {
	try{
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: "Invalid quest id",
			});
		}

		const {title} = req.body;
		if(!title) {
			return res.status(400).json({
				message: "Title is required",
			});
		}

		const quest = await Quest.findOne({
			_id: req.params.id,
			userId: req.user.userId,
		});
		if(!quest){
			return res.status(404).json({
				message: "Quest not found",
			});
		}

		const existingQuest = await Quest.findOne({
			userId: req.user.userId,
			title: { $regex: `^${title}$`, $options: "i"},
			_id: {$ne: quest._id},
		});
		if(existingQuest){
			return res.status(400).json({
				message: "Quest already exists",
			});
		}

		quest.title = title;
		await quest.save();
		
		res.status(200).json(quest);

	}catch(error){
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};


export const deleteQuest = async (req, res) => {
	try{
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: "Invalid quest id",
			});
		}
		
		const quest = await Quest.findOneAndDelete({
			_id: req.params.id,
			userId: req.user.userId,
		});
		if(!quest){
			return res.status(404).json({
				message: "Quest not found",
			});
		}

		res.status(200).json({
			message: "Quest deleted successfully",
		});

	}catch(error){
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};