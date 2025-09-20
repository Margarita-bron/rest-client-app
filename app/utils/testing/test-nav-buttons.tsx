import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routing } from '~/lib/routing/routes-path';
import { renderWithProviders } from '~/utils/testing/test-render';

type ButtonTestConfig = {
  component: React.ComponentType;
  testId: string;
  route: string;
};

export function testNavButtons({
  component: Component,
  testId,
  route,
}: ButtonTestConfig) {
  describe(`${testId} button`, () => {
    it('renders and has correct href', () => {
      renderWithProviders(<Component />);
      const button = screen.getByTestId(testId);

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute(
        'href',
        `/${routing.defaultLocale}/${route}`
      );
    });

    it('clicking navigates to the correct route', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Component />);
      const button = screen.getByTestId(testId);

      await user.click(button);

      expect(button).toHaveAttribute(
        'href',
        `/${routing.defaultLocale}/${route}`
      );
    });
  });
}
