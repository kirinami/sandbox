FROM codercom/code-server:latest

COPY --chown=coder:coder ./config/config.yaml .config/code-server/config.yaml
COPY --chown=coder:coder ./config/share/user/settings.json .local/share/code-server/User/settings.json
COPY --chown=coder:coder ./config/share/coder.json .local/share/code-server/coder.json

RUN code-server --install-extension vscode-icons-team.vscode-icons
RUN code-server --install-extension esbenp.prettier-vscode
RUN code-server --install-extension dbaeumer.vscode-eslint

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN echo 'export NVM_DIR="/home/coder/.nvm"' >> /home/coder/.bashrc
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> /home/coder/.bashrc
RUN bash -c '. /home/coder/.nvm/nvm.sh && nvm install --lts && corepack enable'

WORKDIR /home/coder/workspace

COPY --chown=coder:coder ./workspace .

RUN bash -c '. /home/coder/.nvm/nvm.sh && yarn install --no-lockfile'

WORKDIR /home/coder

EXPOSE 5173
