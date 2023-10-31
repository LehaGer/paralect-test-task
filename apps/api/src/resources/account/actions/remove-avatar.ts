import { AppKoaContext, Next, AppRouter } from 'types';
import { userService } from 'resources/user';
import firebaseStorageService from '../../../services/firebase-storage/firebase-storage.service';

async function validator(ctx: AppKoaContext, next: Next) {
  const { user } = ctx.state;

  ctx.assertClientError(user.avatarUrl, { global: 'You don\'t have avatar' });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { user } = ctx.state;

  const filePath = await firebaseStorageService.getFilePath(user.avatarUrl || '');

  const [updatedUser] = await Promise.all([
    userService.updateOne({ _id: user._id }, () => ({ avatarUrl: null })),
    firebaseStorageService.removeObject(filePath ?? ''),
  ]);

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.delete('/avatar', validator, handler);
};
