const Event = require('../models/Event');

// Get all events for user
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ date: 1, startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get events', error: error.message });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, type } = req.body;
    
    const newEvent = new Event({
      userId: req.user._id,
      title,
      description,
      date,
      startTime,
      endTime,
      type: type || 'event'
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOne({ _id: id, userId: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
