import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("=" * 60)
        print("[*] Good Morning Dashboard - Bus C13 & Meteo Lycee")
        print(f"[>] Serveur actif sur : {url}")
        print("=" * 60)
        print("Appuyez sur Ctrl+C pour arreter le serveur.")
        
        try:
            webbrowser.open(url)
        except Exception as e:
            print(f"Ouverture auto navigateur: {e}")
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArret du serveur. Bonne journee !")
            sys.exit(0)


if __name__ == "__main__":
    main()
