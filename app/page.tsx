"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const TEST_QUERY = gql`
  query GetUsers {
    users {
      id
    }
  }
`;

export default function TestPage() {
  const { loading: isLoading, error, data } = useQuery(TEST_QUERY);

  if (isLoading) {
    return (
      <div className="p-5 font-medium text-gray-600">
        Loading data from Backend...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-red-600 font-semibold">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Apollo Client Connection Success! 🎉
      </h1>
      <pre className="bg-gray-100 p-4 rounded font-mono text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
