# Hook: new-api-route

**Trigger:** When a developer adds a new API route.

**Purpose:** Ensure consistent structure across all endpoints.

## Checklist

1. Create `server/src/routes/myFeature.ts` with an Express Router.
2. Create `server/src/controllers/myFeatureController.ts` for handler functions.
3. Create `server/src/services/myFeatureService.ts` for business logic.
4. Add Zod validation schema for all request bodies and params.
5. Mount the router in `server/src/index.ts` under `/api/my-feature`.
6. Add the route to `docs/api.md` (or update `README.md`).
7. Apply `authMiddleware` to any protected route.

## Controller Template

```ts
import { NextFunction, Request, Response } from 'express';
import { myFeatureService } from '../services/myFeatureService';
import { mySchema } from '../validators/myFeature';

export const doSomething = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = mySchema.parse(req.body);
    const result = await myFeatureService.doSomething(validated, req.user!);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};
```

## Route Template

```ts
import { Router } from 'express';
import { doSomething } from '../controllers/myFeatureController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, doSomething);

export default router;
```
