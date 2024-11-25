import type { FC } from "react";
import { graphql, useMutation } from "react-relay";
import { CustomButton } from "../../components/CustomButton";
import { Spinner } from "../../components/Spinner";
import { useTranslation } from "../../utils";
import type { AddFundsButtonMutation } from "./__generated__/AddFundsButtonMutation.graphql";

export const RetireFundsButton: FC<{ quantity: string }> = ({ quantity }) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddFundsButtonMutation>(graphql`
    mutation RetireFundsButtonMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
      }
    }
  `);
  return isInFlight ? (
    <Spinner />
  ) : (
    <CustomButton
      text={t("Retirar")}
      onClick={() => {
        commit({
          variables: {
            input: {
              quantity: `-${quantity}`,
            },
          },
        });
      }}
    />
  );
};
