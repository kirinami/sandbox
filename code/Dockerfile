FROM codercom/code-server:latest

RUN code-server --install-extension vscode-icons-team.vscode-icons
RUN code-server --install-extension esbenp.prettier-vscode
RUN code-server --install-extension dbaeumer.vscode-eslint

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN echo 'export NVM_DIR="/home/coder/.nvm"' >> /home/coder/.bashrc
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> /home/coder/.bashrc
RUN bash -c '. /home/coder/.nvm/nvm.sh && nvm install --lts && corepack enable'

WORKDIR /home/coder/workspace

COPY --chown=ubuntu:ubuntu ./workspace .

RUN bash -c '. /home/coder/.nvm/nvm.sh && yarn install --no-lockfile'

WORKDIR /home/coder

EXPOSE 5173
