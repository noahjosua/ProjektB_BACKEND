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
    PORT=<gewünschterPort> 
    TOKEN_SECRET=<tokenSecret>
    ```

    **Der Port muss mit dem im [Frontend](https://github.com/noahjosua/ProjektB_FRONTEND) verwendeten Port übereinstimmen!**

3. Installation und Konfiguarion MongoDB unter Windows
    - Installiere die [MongoDB Community Edition](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows)
        - Lade dir dazu den MongoDB Community `.msi` installer herunter
        - Stelle im Installationsprozess zur einfacheren Handhabung sicher, dass der Haken bei "Install MongoDB Compass" gesetzt ist (GUI)
    - Installiere die MongoDB Shell [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) 
        - Stelle sicher, dass du diese von einem `.zip` File installierst
        - Extrahiere den `.zip` File und füge ihn in den `ProgramFiles/MongoDB` folder ein 
        - Füge den `ProgramFiles/MongoDB/mongosh-x.xx.x.../bin` folder als `PATH` Variable hinzu
        - Füge den `ProgramFiles/MongoDB/Server/x.x/bin folder` als `PATH` Variable hinzu
    - Öffne MongoDB Compass und füge eine neue Verbindung hinzu
        - Klicke dafür einfach auf Save&Connect und gib anschließend einen Namen für deine Verbindung ein 
        - Klicke oben links neben dem Namen deiner Verbindung  auf die drei Punkte und kopiere den connection string
    - Gehe zu `ProgramFiles/MongoDB/mongosh-x.xx.x.../bin` und mache einen Doppelklick auf `mongosh.exe`, um die MongoDB Shell zu starten
        - Füge den eben kopierten connection string in die Shell ein und drücke enter
        - Kopiere den String hinter "Connecting to:" und füge diesen im `.env` File als DATABASE_URL ein
    - Gehe zurück zum MongoDB Compass und füge deiner Verbindung eine Datenbank hinzu
        - Gib ihr einen Namen, z.B. "myDatabase"
        - Die Datenbank sollte zwei Collections mit den Namen **users** und **projects** haben
    - Gehe zurück in den `.env` File und modifiziere die DATABASE_URL wie folgt, um eine Verbindung herstellen zu können 
        - Ersetze localhost durch 127.0.0.1
        - Füge den Namen deiner Datenbank zwischen mongodb://**127.0.0.1**:27017/ und ?directConnection ein 
    - Das Ergebnis sollte ungefähr so aussehen: mongodb://**127.0.0.1**:27017/**myDatabase**?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1
    - Starte den Server mit `server.js` um sicherzustellen, dass die Verbindung funktioniert
4. Generiere das Token Secret:
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
- Anwendung: 
    - MongoDB ist erfolgreich installiert und mit dem Backend verbunden 
    - Alle beschriebenen Konfigurationsschritte für Backend und Frontend wurden berücksichtigt 

    - Backend starten mit `server.js`
    - Frontend starten mit `ng serve`
    - Die Anwendung ist unter http://localhost:4200 erreichbar. 
- Die API-Dokumentation wurde mit [Swagger](https://swagger-autogen.github.io/docs/) erstellt und ist unter folgendem Link zu finden: http://localhost:3000/doc/

