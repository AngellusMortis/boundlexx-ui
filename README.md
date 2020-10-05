# Boundlexx UI

## Requirements

This project is configured to work with Docker inside of VS Code using the
Remote Containers extension. It is recommend to use those. So make sure you have:

-   [Docker](https://docs.docker.com/get-docker/)
-   [VS Code](https://code.visualstudio.com/) with the [Remote Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

## Setup

1. Clone the repo.
2. Copy `docker-compose.override.example.yml` to `docker-compose.override.yml`
   and customize it if you want
3. Then open the `boundlexx-ui` folder in VS Code.
4. Ensure the extension "Remote - Containers" (`ms-vscode-remote.remote-containers`) is installed.
5. You should be prompted to "Reopen in Container". If you are not, run the
   "Remote-Containers: Reopen in Container" from the Command Palette
   (`View -> Command Palette...` or `Ctrl+Shift+P`)
6. VS Code will now build the Docker images and start them up. When it is
   done, you should see a normal VS Code Workspace
7. Go to http://127.0.0.1:4000 in your Web browser
