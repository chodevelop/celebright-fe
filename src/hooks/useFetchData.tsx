import { useEffect, useState } from "react";

export const useFetchData = (fetchFunction: (id: string) => Promise<any[]>, userId: string | undefined) => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const result = await fetchFunction(userId);
          setData(result);
        }
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, [fetchFunction, userId]);

  return { data, error };
};
