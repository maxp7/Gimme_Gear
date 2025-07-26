# Installationsanleitung für Gimme Gear

Diese Anleitung beschreibt die lokale Einrichtung der Webanwendung **Gimme Gear**, einem Buchungssystem für VR-Geräte an der HTW Berlin.

## Voraussetzungen

Bevor Sie starten, stellen Sie bitte sicher, dass folgende Tools installiert sind:

- **Node.js** (Version 12 oder höher):  
  Eine JavaScript-Laufzeitumgebung. Download unter: [https://nodejs.org/](https://nodejs.org/)
- **Git**:  
  Auf macOS in der Regel vorinstalliert. Andernfalls über die Xcode Command Line Tools oder [git-scm.com](https://git-scm.com/) installierbar.

---

## Schritt-für-Schritt-Anleitung

1. Öffnen Sie die GitHub-Projektseite von Gimme Gear unter:  
   [https://github.com/maxp7/Gimme_Gear](https://github.com/maxp7/Gimme_Gear)

2. Klicken Sie auf den grünen **„Code“**-Button und kopieren Sie den angezeigten **HTTPS-Link** zum Repository.

3. Öffnen Sie das **Terminal** auf Ihrem Mac (z. B. über Spotlight oder im Ordner „Programme > Dienstprogramme“).

4. Geben Sie im Terminal den Befehl `git clone` ein, gefolgt vom kopierten Repository-Link. Drücken Sie Enter. Dadurch wird das Projektverzeichnis **Gimme_Gear** auf Ihren Computer geladen.

5. Navigieren Sie im Finder zu dem neu erstellten Ordner **Gimme_Gear**. Öffnen Sie diesen Ordner in einer IDE wie z. B. **Visual Studio Code**.

6. Aus Datenschutzgründen sind die benötigten **.env-Dateien** nicht öffentlich im Repository enthalten. Sie erhalten diese über das Moodle-Abgabefeld.

7. Platzieren Sie die Umgebungsvariablen wie folgt:
   - Die Datei `client.env` kommt in den Ordner `client` und wird dort in `.env` umbenannt.
   - Die Datei `server.env` kommt in den Ordner `server/src` und wird dort ebenfalls in `.env` umbenannt.

8. Öffnen Sie in Ihrer IDE (z. B. Visual Studio Code) **zwei Terminal-Fenster**.

9. In der IDE installieren Sie nun alle notwendigen Packages mit **npm**.

10. Im ersten Terminal navigieren Sie in den Ordner **Gimme_Gear** und führen den Befehl `npm install` aus, um die Abhängigkeiten im Hauptverzeichnis zu installieren.

11. Anschließend wechseln Sie im gleichen Terminal mit `cd client` in den Ordner `client` und führen erneut `npm install` aus.

12. Im zweiten Terminal wechseln Sie mit `cd server` in den Ordner `server` und führen dort ebenfalls `npm install` aus.

13. In diesem zweiten Terminalfenster (Backend) starten Sie nun den Server mit dem Befehl `npm run dev`.

14. Kehren Sie zum ersten (Client-)Terminal zurück und starten dort ebenfalls mit `npm run dev` den Client.

15. Sobald beide Server laufen, wird im Client-Terminal eine **lokale URL** angezeigt – in der Regel `http://localhost:5173`.  
    Über diese Adresse kann die Anwendung im Browser aufgerufen werden.

---

## Hinweis

Bitte achten Sie darauf, dass die `.env`-Dateien korrekt benannt und in den richtigen Verzeichnissen abgelegt sind, da sie für den Start der Anwendung erforderlich sind.  
Bei Problemen wenden Sie sich gern an das Entwicklerteam oder konsultieren die Projektunterlagen im Moodle-Kurs.

---
## Admin Panel 

Login: Admin 
Passwort: 666

---
