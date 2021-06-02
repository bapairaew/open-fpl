import diacritics from "diacritics";

const includeFilter = ({ players, filterValue, getFieldValue }) => {
  return players.filter((p) => {
    const fieldValue = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() === filterValue.toLowerCase()
      : filterValue.some(
          (value) => fieldValue.toLowerCase() === value.toLowerCase()
        );
  });
};

const excludeFilter = ({ players, filterValue, getFieldValue }) => {
  return players.filter((p) => {
    const fieldValue = getFieldValue?.(p);
    return typeof filterValue === "string"
      ? fieldValue.toLowerCase() !== filterValue.toLowerCase()
      : filterValue.every(
          (value) => fieldValue.toLowerCase() !== value.toLowerCase()
        );
  });
};

export const filterPlayers = (
  inputPlayers,
  freeTextFuse,
  filterQueryObject,
  filterOptions
) => {
  let players = [...inputPlayers];
  if (filterQueryObject.text) {
    players = freeTextFuse
      .search(diacritics.remove(filterQueryObject.text))
      .map((r) => r.item);
  }

  for (const keyword of filterOptions.keywords) {
    if (filterQueryObject[keyword.field]) {
      players = includeFilter({
        players,
        filterValue: filterQueryObject[keyword.field],
        getFieldValue: filterOptions.keywords.find(
          (o) => o.field === keyword.field
        )?.getFieldValue,
      });
    }
  }

  if (filterQueryObject.exclude) {
    for (const keyword of filterOptions.keywords) {
      if (filterQueryObject.exclude[keyword.field]) {
        players = excludeFilter({
          players,
          filterValue: filterQueryObject.exclude[keyword.field],
          getFieldValue: filterOptions.keywords.find(
            (o) => o.field === keyword.field
          )?.getFieldValue,
        });
      }
    }
  }

  // Range search does not support exclusion
  for (const range of filterOptions.ranges) {
    if (filterQueryObject[range.field]) {
      const getFieldValue = filterOptions.ranges.find(
        (r) => r.field === range.field
      )?.getFieldValue;
      players = players.filter(
        (p) =>
          getFieldValue(p) >= +filterQueryObject[range.field].from &&
          (filterQueryObject.cost.to
            ? getFieldValue(p) <= filterQueryObject[range.field].to
            : true)
      );
    }
  }

  return players;
};
