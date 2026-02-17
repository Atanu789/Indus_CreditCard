import mongoose from 'mongoose';

let messagesConnection: mongoose.Connection | null = null;

const connectMessagesDB = async (): Promise<mongoose.Connection | null> => {
  const uri =
    process.env.MONGODB_URI_MESSAGES ||
    'mongodb://localhost:27017/sms_messages';

  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      messagesConnection = mongoose.createConnection(uri);

      // Wait for the connection to be ready
      await new Promise<void>((resolve, reject) => {
        messagesConnection!.on('connected', () => {
          console.log(
            `Messages DB Connected: ${messagesConnection!.host}`,
          );
          resolve();
        });
        messagesConnection!.on('error', (err) => reject(err));
      });

      return messagesConnection;
    } catch (error: any) {
      console.error(
        `Messages DB connection attempt ${attempt}/${maxRetries} failed:`,
        error.message,
      );
      if (messagesConnection) {
        try {
          await messagesConnection.close();
        } catch {}
      }
      messagesConnection = null;
      if (attempt === maxRetries) {
        console.error(
          'All Messages DB connection attempts failed. SMS storage will be unavailable.',
        );
        return null;
      }
      console.log(`Retrying in ${attempt * 2} seconds...`);
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  }

  return null;
};

export const getMessagesConnection = (): mongoose.Connection | null =>
  messagesConnection;

export default connectMessagesDB;
