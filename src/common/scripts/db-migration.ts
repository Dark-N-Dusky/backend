// import { AppDataSource } from '../config/pg.config';

// async function runMigrations() {
//   console.log('Initializing database...');
//   await AppDataSource.initialize();

//   try {
//     console.log('Running pending migrations...');
//     const migrations = await AppDataSource.runMigrations();

//     if (migrations.length === 0) {
//       console.log('Database already up to date');
//     } else {
//       console.log(`Applied ${migrations.length} migration(s)`);
//     }
//   } finally {
//     await AppDataSource.destroy();
//   }

//   process.exit(0);
// }

// runMigrations().catch((err) => {
//   console.error('Migration error:', err);
//   process.exit(1);
// });
