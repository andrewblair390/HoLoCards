import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define an interface representing a document in MongoDB.
export interface ICard extends Document {
  series: string;
  name: string;
  'image-link': string; // Using quotes because it has a hyphen
  price: number;
}

// 2. Create a Schema corresponding to the document interface.
const CardSchema: Schema = new Schema({
  series: { type: String, required: true },
  name: { type: String, required: true },
  'image-link': { type: String, required: true }, // Matches your "image-link" field
  price: { type: Number, required: true },
});

// 3. Export the model, pointing explicitly to your "Cards" collection.
const Card: Model<ICard> = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema, 'Cards');

export default Card;