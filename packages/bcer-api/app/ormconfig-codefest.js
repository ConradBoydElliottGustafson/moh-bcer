module.exports = [
  {
    'name': 'default',
    'type': 'postgres',
    'host': 'localhost',
    'port': 5432,
    'username': 'bcer',
    'database': 'bcer',
    'synchronize': false,
    'dropSchema': false,
    'migrations': ['dist/migrations/*{.ts,.js}'],
    'cli': {
      'migrationsDir':'src/migrations'
    }
  }
]