export default () => ({
  refreshSecret: process.env.JWT_REFRESH_TOKEN,
  accessToken: process.env.JWT_ACCESS_TOKEN,
});
