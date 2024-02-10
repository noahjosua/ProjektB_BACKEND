# HAW Hamburg: Studierendenprojekte 

Willkommen im Backend Repository! 
Hierbei handelt es sich um ein Node.js Backend mit Express.js und Mongo DB (>= v7.0.1). 

## Inhaltsverzeichnis
- [Installation](#installation)
- [Verwendung](#verwendung)

### Installation
1. Repo klonen und dependencies installieren
``` 
git clone https://github.com/noahjosua/ProjektB_BACKEND
Projekt öffnen in IDE, z.B. Visual Studio Code 
cd ProjektB_BACKEND
npm install
```
2. Erstelle eine `.env`-Datei auf der Root-Ebene mit den folgenden Variablen (case-sensitive!):
    ```
    DATABASE_URL=<dieUrlDeinerLokalenMongoDb>
    PORT=<gewünschterPort> **muss mit dem im [Frontend](https://github.com/noahjosua/ProjektB_FRONTEND) verwendeten Port übereinstimmen!**
    TOKEN_SECRET=<tokenSecret>
    ```
3. Generiere das Token Secret:
    - Füge in `app.js` vor `module.exports = app;` die folgende Zeile ein:
     ```javascript
     console.log(require('crypto').randomBytes(64).toString('hex'));
     ```
    - Starte die Anwendung mit `server.js`.
    - Kopiere das generierte Token-Secret und füge es in der `.env`-Datei ein.
    - Lösche die eingefügte Zeile in `app.js`.

### Initialen Benutzer hinzufügen
1. Kommentiere in `backend/routes/user.js` die Middleware "check-auth.js" für die `/signup`-Route aus:

    ```javascript
    router.post('/signup' /*, checkAuth*/, (req, res, next) => {
    ```
2. Kommentiere im **Frontend** in `src/app/app-routing.module.ts` die `canActivate`-Middleware für die `/signup`-Route aus:
    ```typescript
    { path: 'signup', component: SignupComponent /*, canActivate: [AuthGuard, AdminAuthGuard] */}
    ```

3. Starte die Angular Anwendung sowie das Backend und besuche http://localhost:4200/signup. Lege einen Benutzer an.

4. Stelle sicher, dass die oben genannten Änderungen in `backend/routes/user.js` und `src/app/app-routing.module.ts` rückgängig gemacht werden, um die Sicherheit wiederherzustellen.

### Verwendung
- Anwendung: Sofern MongoDB erfolgreich installiert und mit dem Backend verbunden wurde und alle weiteren Konfigurationsschritte sowohl im Backend als auch im Frontend berücksichtigt wurden, kann die Anwendung unter http://localhost:4200 verwendet werden. 
- Die API-Dokumentation wurde mit [Swagger](https://swagger-autogen.github.io/docs/) erstellt und ist unter folgendem Link zu finden: http://localhost:3000/doc/

