import Feedback from '../models/feedbackModel.js';
import nodemailer from 'nodemailer';
import ReservationInitiator from '../models/reservationInitiatorModel.js';

const sendEmail = async (userEmail, feedbackType, message) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
  const { email, feedbackType, message } = req.body;

  console.log('Received feedback submission:', { email, feedbackType, message });

  try {
 

    if (feedbackType === 'bug') {
      await sendEmail(email, feedbackType, message);
      return res.status(200).json({ message: 'Bug report sent to developers.' });
    } else {
      const feedback = new Feedback({
        email,
        feedbackType,
        message,
      });
      await feedback.save();
      return res.status(200).json({ message: 'Feedback stored successfully.' });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ message: 'An error  occurred while submitting your feedback.' });
  }
};
