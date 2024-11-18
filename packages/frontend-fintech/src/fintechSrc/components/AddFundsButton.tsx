import type { FC } from "react";
import { graphql, useMutation } from "react-relay";
import { CustomButton } from "../../components/CustomButton";
import { Space, customSpace } from "../../components/Space";
import { Spinner } from "../../components/Spinner";
import { useTranslation } from "../../utils";
import type { AddFundsButtonMutation } from "./__generated__/AddFundsButtonMutation.graphql";

export const AddFundsButton: FC<{ quantity: string }> = ({ quantity }) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddFundsButtonMutation>(graphql`
    mutation AddFundsButtonMutation($input: AddFundsInput!) {
      addFunds(input: $input) {
        error
      }
    }
  `);
  return isInFlight ? (
    <Spinner />
  ) : (
    <>
      <CustomButton
        text={t("Añadir")}
        onClick={() => {
          commit({
            variables: {
              input: {
                quantity,
              },
            },
          });
        }}
      />

      <Space styleX={customSpace.h30} />
    </>
  );
};
