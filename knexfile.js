module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/ideas_by_nature'
  },


  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
