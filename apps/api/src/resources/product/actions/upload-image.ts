import multer from '@koa/multer';
import { AppKoaContext, AppRouter, Next } from 'types';
import firebaseStorageService from '../../../services/firebase-storage/firebase-storage.service';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(!!file, {
    global: 'File cannot be empty',
  }, 400);

  await next();
}

async function handler(ctx: AppKoaContext) {
  const {
    state: { user },
    request: { file },
  } = ctx;

  const fileName = `${user._id}-${Date.now()}-${file.originalname}`;

  ctx.status = 201;
  ctx.body = await firebaseStorageService.uploadPublic(
    `product-images/${fileName}`,
    file,
  );
}

export default (router: AppRouter) => {
  router.post('/image', upload.single('file'), validator, handler);
};
