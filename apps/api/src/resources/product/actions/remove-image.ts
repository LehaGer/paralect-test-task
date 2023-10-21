import { AppKoaContext, Next, AppRouter } from 'types';
import { z } from 'zod';
import { validateMiddleware } from '../../../middlewares';
import firebaseStorageService from '../../../services/firebase-storage/firebase-storage.service';

const schema = z.object({
  imageUrl: z.string(),
});

interface ValidatedData extends z.infer<typeof schema> {
  filePath: string;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { imageUrl } = ctx.validatedData;

  const filePathFromStorage = await firebaseStorageService.getFilePath(imageUrl);

  ctx.assertClientError(!!filePathFromStorage, {
    global: 'File with provided url does not exist in storage',
  }, 404);

  ctx.validatedData.filePath = filePathFromStorage;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { filePath } = ctx.validatedData;

  await firebaseStorageService.removeObject(filePath);

  ctx.status = 204;
}

export default (router: AppRouter) => {
  router.delete('/image', validateMiddleware(schema), validator, handler);
};
