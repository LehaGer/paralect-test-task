import multer from '@koa/multer';

import { Next, AppKoaContext, AppRouter } from 'types';
import { userService } from 'resources/user';
import firebaseStorageService from '../../../services/firebase-storage/firebase-storage.service';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, { global: 'File cannot be empty' });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;
  const { file } = ctx.request;

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;

  const Location = await firebaseStorageService.uploadPublic(
    `avatar-images/${fileName}`,
    file,
  );

  const updatedUser = await userService.updateOne(
    { _id: user._id },
    () => ({ avatarUrl: Location }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.post('/avatar', upload.single('file'), validator, handler);
};
