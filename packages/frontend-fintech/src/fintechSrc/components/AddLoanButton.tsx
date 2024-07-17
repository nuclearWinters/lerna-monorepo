import { FC } from "react";
import { useTranslation } from "../../utils";
import { graphql, useMutation } from "react-relay";
import { Spinner } from "../../components/Spinner";
import { CustomButton } from "../../components/CustomButton";
import { AddLoanButtonMutation } from "./__generated__/AddLoanButtonMutation.graphql";

export const AddLoanButton: FC<{ goal: string; term: number }> = ({
  goal,
  term,
}) => {
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
