import Quest from "../models/Quest.js";
import mongoose from "mongoose";
import QuestLog from "../models/QuestLog.js";
import calculateCurrentStreak from "../utils/calculateCurrentStreak.js";
import { startOfDay, toDateKey } from "../utils/dateUtils.js";


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
		}).lean();

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
		const {day} = req.query;
		if(!["today", "yesterday"].includes(day)){
			return res.status(400).json({
				message: "Invalid day",
			});
		}

		const timeZone = req.user.timeZone;
		const selectedDate = startOfDay(day, timeZone);

		const [quests, logs, completedLogs] = await Promise.all([
			Quest.find({
				userId: req.user.userId,
			})
			.sort({ createdAt: -1 })
			.lean(),

			QuestLog.find({
				userId: req.user.userId,
				date: selectedDate,
			}).lean(),

			QuestLog.find({
				userId: req.user.userId,
				completed: true,
			})
			.select("questId date")
			.lean(),
		]);

		const completedMap = new Map();

		logs.forEach((log) => {
			completedMap.set(
				log.questId.toString(),
				log.completed
			);
		});

		const completedDatesByQuest = new Map();
		completedLogs.forEach((log) => {
			const questId = log.questId.toString();
			if(!completedDatesByQuest.has(questId)){
				completedDatesByQuest.set(questId, new Set());
			}

			completedDatesByQuest
			.get(questId)
			.add(toDateKey(log.date, timeZone));
		});

		const result = quests.map((quest) => {
			const completedDates = 
				completedDatesByQuest.get(quest._id.toString()) || new Set();

			return {
				...quest,
				completed: completedMap.get(quest._id.toString()) || false,
				currentStreak: calculateCurrentStreak(completedDates, timeZone),
			};
		});

		res.status(200).json(result);
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
		}).lean();
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

		await QuestLog.deleteMany({
			questId: req.params.id,
			userId: req.user.userId,
		});

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


export const toggleQuest = async (req, res) => {
	try{
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message: "Invalid quest id",
			});
		}
		
		const {day} = req.body;
		if(!["today", "yesterday"].includes(day)){
			return res.status(400).json({
				message: "Invalid Day",
			});
		}

		const quest = await Quest.findOne({
			_id: req.params.id,
			userId: req.user.userId,
		});
		if(!quest){
			return res.status(400).json({
				message: "Quest not found",
			});
		}

		const selectedDate = startOfDay(day, req.user.timeZone);

		let log = await QuestLog.findOne({
			userId: req.user.userId,
			questId: quest._id,
			date: selectedDate,
		});
		if(!log){
			log = await QuestLog.create({
				userId: req.user.userId,
				questId: quest._id,
				date: selectedDate,
				completed: true,
			});
		}else{
			log.completed = !log.completed;
			await log.save();
		}

		res.status(200).json(log);

	}catch(error){
		console.error(error);
		res.status(500).json({
			message: "Server error",
		});
	}
};