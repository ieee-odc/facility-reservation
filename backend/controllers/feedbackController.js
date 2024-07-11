import Feedback from '../models/feedbackModel.js';
import nodemailer from 'nodemailer';
import ReservationInitiator from '../models/reservationInitiatorModel.js'; 

const sendEmail = async (userEmail, feedbackType, message) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', 
      pass: 'your-email-password', 
    },
  });

  let mailOptions = {
    from: userEmail, 
    to: 'lamia.belhadjsghaier@insat.ucar.tn',
    subject: `New Feedback: ${feedbackType}`, 
    text: message, 
  };

  return transporter.sendMail(mailOptions);
};

export const submitFeedback = async (req, res) => {
  const { userId, feedbackType, message } = req.body;

  try {
    
    const user = await ReservationInitiator.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (feedbackType === 'bug') {
      await sendEmail(user.email, feedbackType, message);
      return res.status(200).send('Bug report sent to developers.');
    } else {
      const feedback = new Feedback({
        userId,
        feedbackType,
        message,
      });
      await feedback.save();
      return res.status(200).send('Feedback stored successfully.');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).send('An error occurred while submitting your feedback.');
  }
};
