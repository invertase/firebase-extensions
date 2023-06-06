module.exports = async function () {
  process.env = Object.assign(process.env, {
    LOCATION: 'europe-west2',
  });
};
