async function fetchGraphQL(text: string, variables: Record<any, any>) {
  const response = await fetch("http://0.0.0.0:4000/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });
  return await response.json();
}

export default fetchGraphQL;
