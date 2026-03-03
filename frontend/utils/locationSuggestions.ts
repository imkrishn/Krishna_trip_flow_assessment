export const fetchSuggestions = async (
  value: string,
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  if (!value) return;

  const res = await fetch(`https://photon.komoot.io/api/?q=${value}&limit=5`);
  const data = await res.json();

  const places = data.features.map(
    (f: any) =>
      `${f.properties.name || ""} ${f.properties.city || ""}, ${
        f.properties.country || ""
      }`,
  );

  setSuggestions(places);
};
