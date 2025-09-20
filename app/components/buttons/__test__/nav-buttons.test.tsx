import { HistoryButton } from '~/components/buttons/history/history-button';
import { MainPageButton } from '~/components/buttons/main-page-button/main-page-button';
import { RestClientButton } from '~/components/buttons/rest-client/rest-client-button';
import { SignInButton } from '~/components/buttons/sign-in-button/sign-in-button';
import { SignUpButton } from '~/components/buttons/sign-up-button/sign-up-button';
import { VariablesButton } from '~/components/buttons/variables/variables-button';
import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';
import { ROUTES } from '~/lib/routing/routes-path';
import { testNavButtons } from '~/utils/testing/test-nav-buttons';

testNavButtons({
  component: HistoryButton,
  testId: BUTTON_TEST_IDS.history,
  route: ROUTES.history,
});
testNavButtons({
  component: MainPageButton,
  testId: BUTTON_TEST_IDS.mainPage,
  route: ROUTES.main,
});
testNavButtons({
  component: RestClientButton,
  testId: BUTTON_TEST_IDS.restClient,
  route: ROUTES.restClient,
});
testNavButtons({
  component: SignInButton,
  testId: BUTTON_TEST_IDS.signIn,
  route: ROUTES.signIn,
});
testNavButtons({
  component: SignUpButton,
  testId: BUTTON_TEST_IDS.signUp,
  route: ROUTES.signUp,
});
testNavButtons({
  component: VariablesButton,
  testId: BUTTON_TEST_IDS.variables,
  route: ROUTES.variables,
});
