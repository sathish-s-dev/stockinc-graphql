export function GraphQLResponse<T>({
  status,
  data,
  error,
  message,
}: {
  status: number;
  data: T;
  error: string;
  message: string;
}) {
  return {
    status,
    data,
    error,
    message,
  };
}
