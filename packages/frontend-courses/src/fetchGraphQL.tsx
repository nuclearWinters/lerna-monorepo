const fetchGraphQL = async (text: string, variables: Record<any, any>) => {
  const response = await fetch("http://0.0.0.0:4001/relay/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken") || "",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
    credentials: "include",
  });
  return await response.json();
};

export default fetchGraphQL;
