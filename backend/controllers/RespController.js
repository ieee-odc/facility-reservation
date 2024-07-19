import Responsible from "../models/responsibleModel.js";

export const createResponsible = async (req, res) => {
  const { firstName, lastName, contactEmail, contactPhoneNumber, position } = req.body;
console.log(req.body);
  try {
    const existingResponsible = await Responsible.findOne({ contactEmail });
    if (existingResponsible) {
      return res.status(400).json({ message: 'Responsible already exists' });
    }

    const newResponsible = await Responsible.create({
      firstName,
      lastName,
      contactEmail,
      contactPhoneNumber,
      position
    });

    //const savedResponsible = await newResponsible.save();
    return res.status(201).json(newResponsible);
  } catch (error) {
    res.status(500).json({ message: 'Error creating responsible', error });
  }
};


export const getAllResponsibles = async (req, res) => {
  try {
    const responsibles = await Responsible.find();
    res.status(200).json(responsibles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responsibles', error });
  }
};


export const getResponsibleById = async (req, res) => {
  const { id } = req.params;

  try {
    const responsible = await Responsible.findById(id);
    if (!responsible) {
      return res.status(404).json({ message: 'Responsible not found' });
    }
    res.status(200).json(responsible);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responsible', error });
  }
};


export const updateResponsible = async (req, res) => {
  const { id } = req.params;
  const { fullname, contactEmail, contactPhoneNumber } = req.body;

  try {
    const responsible = await Responsible.findById(id);
    if (!responsible) {
      return res.status(404).json({ message: 'Responsible not found' });
    }

    if (fullname) responsible.fullname = fullname;
    if (contactEmail) responsible.contactEmail = contactEmail;
    if (contactPhoneNumber) responsible.contactPhoneNumber = contactPhoneNumber;

    const updatedResponsible = await responsible.save();
    res.status(200).json(updatedResponsible);
  } catch (error) {
    res.status(500).json({ message: 'Error updating responsible', error });
  }
};


export const deleteResponsible = async (req, res) => {
  const { id } = req.params;

  try {
    const responsible = await Responsible.findById(id);
    if (!responsible) {
      return res.status(404).json({ message: 'Responsible not found' });
    }

    await responsible.remove();
    res.status(200).json({ message: 'Responsible deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting responsible', error });
  }
};
