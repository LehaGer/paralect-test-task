import { z } from 'zod';

import config from 'config';
import { securityUtil } from 'utils';
import { analyticsService, emailService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter, Template } from 'types';
import { userService, User } from 'resources/user';

import { emailRegex, passwordRegex } from 'resources/account/account.constants';
import stripeService from 'services/stripe/stripe.service';
import { cartService } from '../../cart';

const schema = z.object({
  email: z.string().regex(emailRegex, 'Email format is incorrect.'),
  password: z.string().regex(passwordRegex, 'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    email,
    password,
  } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  const stripeCustomer = await stripeService.customers.create({
    email,
  });

  const user = await userService.insertOne({
    email,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
    stripe: {
      customerId: stripeCustomer.id,
    },
  });

  analyticsService.track('New user created', {
    email,
  });

  const cart = await cartService.insertOne({
    customerId: user._id,
  });

  analyticsService.track('New cart created', {
    cart,
  });

  await emailService.sendTemplate<Template.VERIFY_EMAIL>({
    to: user.email,
    subject: 'Please Confirm Your Email Address for Ship',
    template: Template.VERIFY_EMAIL,
    params: {
      email: user.email,
      href: `${config.API_URL}/account/verify-email?token=${signupToken}`,
    },
  });

  ctx.body = config.IS_DEV ? { signupToken } : {};
}

export default (router: AppRouter) => {
  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
