const { NEXT_PUBLIC_BASE_DATA_SOURCE_URL: baseDataSourceUrl } = process.env;

const getDataUrl = (path: string): string => {
  return baseDataSourceUrl
    ? `${baseDataSourceUrl}${path}`
    : `http://localhost:3001${path}`;
};

export default getDataUrl;
