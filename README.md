# Installer NestJS CLI
npm i -g @nestjs/cli

# Créer un nouveau projet
nest new document-service

# Accéder au répertoire du projet
cd document-service

# Installer les dépendances nécessaires
npm install --save @nestjs/platform-express
npm install --save multer
npm install --save @types/multer
npm install --save class-validator class-transformer

bash# Installer TypeORM, le driver PostgreSQL et les utilitaires NestJS pour TypeORM
npm install --save @nestjs/typeorm typeorm pg
