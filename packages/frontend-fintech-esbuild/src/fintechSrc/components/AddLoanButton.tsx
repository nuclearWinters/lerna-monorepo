import type { FC } from "react";
import { graphql, useMutation } from "react-relay";
import { CustomButton } from "../../components/CustomButton";
import { Spinner } from "../../components/Spinner";
import { useTranslation } from "../../utils";
import type { AddLoanButtonMutation } from "./__generated__/AddLoanButtonMutation.graphql";

export const AddLoanButton: FC<{ goal: string; term: number }> = ({ goal, term }) => {
  const { t } = useTranslation();
  const [commit, isInFlight] = useMutation<AddLoanButtonMutation>(graphql`
    mutation AddLoanButtonMutation($input: AddLoanInput!) {
      addLoan(input: $input) {
        error
      }
    }
  `);
  return isInFlight ? (
    <Spinner />
  ) : (
    <CustomButton
      text={t("Enviar solicitud")}
      onClick={() => {
        commit({
          variables: {
            input: {
              goal,
              term,
            },
          },
        });
      }}
    />
  );
};
