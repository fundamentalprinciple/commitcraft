# Hook: new-model

**Trigger:** When a developer creates a new Mongoose model file in `server/src/models/`.

**Purpose:** Ensure every model follows the project conventions.

## Checklist

When creating a new model `server/src/models/MyModel.ts`:

1. Define and export a TypeScript `interface IMyModel extends Document`.
2. Create a `Schema` with explicit types for all fields.
3. Add indexes for all fields used in `find()` or `findOne()` queries.
4. Exclude sensitive fields in the schema's `toJSON` transform.
5. Export both the interface and the compiled model.
6. Register the model in `server/src/models/index.ts`.

## Template

```ts
import { Document, model, Schema } from 'mongoose';

export interface IMyModel extends Document {
  field: string;
  createdAt: Date;
}

const MyModelSchema = new Schema<IMyModel>(
  {
    field: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const MyModel = model<IMyModel>('MyModel', MyModelSchema);
```
