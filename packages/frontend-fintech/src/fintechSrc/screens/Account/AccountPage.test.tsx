import { loadQuery, RelayEnvironmentProvider } from "react-relay";
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils";
import { render } from "@testing-library/react";
import { accountFragment } from "./AccountQueries";
import { AccountPage } from "./AccountPage";
import { LanguageContext } from "../../../utils";
import { AccountQueriesQuery } from "./__generated__/AccountQueriesQuery.graphql";

test("AccountPage renders correctly", async () => {
  const environment = createMockEnvironment();

  environment.mock.queueOperationResolver((operation) => {
    return MockPayloadGenerator.generate(operation);
  });

  const variables = {};

  environment.mock.queuePendingOperation(accountFragment, variables);

  const preload = loadQuery<AccountQueriesQuery>(
    environment,
    accountFragment,
    variables
  );

  const { findByText } = render(
    <RelayEnvironmentProvider environment={environment}>
      <LanguageContext.Provider value={["EN", jest.fn()]}>
        <AccountPage data-testid="1234" fintechQuery={preload} />
      </LanguageContext.Provider>
    </RelayEnvironmentProvider>
  );

  await findByText("Account value");
  await findByText("To be paid");
  await findByText("Withheld");
  await findByText("Available");
  await findByText('<mock-value-for-field-"accountTotal">');
  await findByText('<mock-value-for-field-"accountToBePaid">');
  await findByText('<mock-value-for-field-"accountAvailable">');
  await findByText('<mock-value-for-field-"accountWithheld">');
});
