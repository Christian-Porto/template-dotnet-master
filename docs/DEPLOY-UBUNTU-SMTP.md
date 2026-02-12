# Deploy no Ubuntu + SMTP (Extension Events Manager)

Este guia explica como hospedar a API (.NET 8) e o Frontend (Angular) em um servidor Ubuntu e como configurar SMTP para cadastro, recuperação de senha e notificações por e‑mail.

## Pré‑requisitos

- Ubuntu 22.04 LTS ou 24.04 LTS com acesso `sudo`.
- Domínio(s) configurado(s) no DNS (ex.: `api.seudominio.com` e `app.seudominio.com`).
- Banco MySQL 8 ou compatível (MariaDB 10.6+), usuário e base criados.
- Runtime .NET 8 (ASP.NET Core) instalado no servidor.
- Nginx instalado para atuar como reverse proxy e servir arquivos estáticos.

## Instalar dependências no Ubuntu

1) ASP.NET Core Runtime 8:

```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg
curl -fsSL https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -o packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y aspnetcore-runtime-8.0
```

2) Nginx e UFW (firewall):

```bash
sudo apt install -y nginx
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

3) MySQL (se necessário):

```bash
sudo apt install -y mysql-server
# Crie base e usuário (exemplo)
sudo mysql -e "CREATE DATABASE eem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'eem'@'%' IDENTIFIED BY 'SUA_SENHA_FORTE';"
sudo mysql -e "GRANT ALL PRIVILEGES ON eem.* TO 'eem'@'%'; FLUSH PRIVILEGES;"
```

## Publicar a API (.NET 8)

Execute estes comandos na sua máquina de build/CI ou no servidor (caso tenha o SDK instalado). Abaixo, publicando Release e copiando para `/var/www/extension-events-manager/api`:

```bash
# Na raiz do repositório
cd backend/src/WebAPI
# Publicar (Release)
dotnet publish -c Release -o ./out

# Preparar diretório de deploy
sudo mkdir -p /var/www/extension-events-manager/api
sudo rsync -ah --delete ./out/ /var/www/extension-events-manager/api/

# Permissões
sudo chown -R www-data:www-data /var/www/extension-events-manager
```

Defina a URL de escuta do Kestrel via variável de ambiente (veremos no systemd): `ASPNETCORE_URLS=http://127.0.0.1:5000`.

### Connection string (MySQL)

Formato típico:

```
server=127.0.0.1;port=3306;database=eem;user=eem;password=SUA_SENHA;SslMode=None
```

### Rodar migrações de banco

Em produção, as migrações automáticas só rodam quando o ambiente está `Development/Staging`. Para garantir o schema em produção, rode as migrações antes do deploy (local/CI) ou a partir do servidor com o código fonte disponível:

```bash
# A partir da raiz do repositório
# Instale a ferramenta se necessário
 dotnet tool install --global dotnet-ef
 export PATH="$PATH:$HOME/.dotnet/tools"

# Atualize o banco usando o projeto de infraestrutura e a WebAPI como startup
 dotnet ef database update \
   --project backend/src/Infrastructure \
   --startup-project backend/src/WebAPI \
   --context ApplicationDbContext
```

## Serviço systemd da API

Crie o serviço em `/etc/systemd/system/extension-events-api.service`:

```
[Unit]
Description=Extension Events Manager API (.NET 8)
After=network.target

[Service]
WorkingDirectory=/var/www/extension-events-manager/api
ExecStart=/usr/bin/dotnet WebAPI.dll
Restart=always
RestartSec=5
User=www-data
Group=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
# Connection string
Environment=ConnectionStrings__DefaultConnection=server=127.0.0.1;port=3306;database=eem;user=eem;password=SUA_SENHA;SslMode=None
# SMTP
Environment=SmtpSettings__Host=localhost
Environment=SmtpSettings__Port=1025
Environment=SmtpSettings__User=
Environment=SmtpSettings__Password=
Environment=SmtpSettings__From=notification@example.com

[Install]
WantedBy=multi-user.target
```

Ative e inicie:

```bash
sudo systemctl daemon-reload
sudo systemctl enable extension-events-api
sudo systemctl start extension-events-api
sudo systemctl status extension-events-api
```

## Nginx (reverse proxy da API)

Crie o host `api.seudominio.com` em `/etc/nginx/sites-available/extension-events-api`:

```
server {
    server_name api.seudominio.com;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        include            proxy_params;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilite e recarregue:

```bash
sudo ln -s /etc/nginx/sites-available/extension-events-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> Observação de CORS: hoje a API permite origem `http://localhost:4200` por padrão em `Program.cs`. Para produção, ajuste as origens permitidas no código para incluir seu domínio do frontend.

## Frontend (Angular)

Build de produção (Node 20, ver `.nvmrc`):

```bash
cd frontend
# Use Node 20 (ex.: nvm use)
npm ci
npm run build
```

O Angular (standalone) gera saída em algo como `dist/<nome-projeto>/browser`. Copie para o servidor:

```bash
sudo mkdir -p /var/www/extension-events-manager/frontend
sudo rsync -ah --delete dist/*/browser/ /var/www/extension-events-manager/frontend/
sudo chown -R www-data:www-data /var/www/extension-events-manager/frontend
```

Host no Nginx (SPA): crie `/etc/nginx/sites-available/extension-events-frontend`:

```
server {
    server_name app.seudominio.com;
    root /var/www/extension-events-manager/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Habilite e recarregue:

```bash
sudo ln -s /etc/nginx/sites-available/extension-events-frontend /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Configure o frontend para apontar a API (ex.: variável de ambiente ou arquivo de configuração) para `https://api.seudominio.com`.

## SMTP – Estrutura de configuração na aplicação

No `appsettings.Production.json` ou via variáveis de ambiente, utilize a seguinte estrutura (exemplo):

```json
"SmtpSettings": {
  "Host": "localhost",
  "Port": 1025,
  "User": "",
  "Password": "",
  "From": "notification@example.com"
}
```

Equivalente via variáveis de ambiente (como usamos no `systemd`):

```
SmtpSettings__Host
SmtpSettings__Port
SmtpSettings__User
SmtpSettings__Password
SmtpSettings__From
```

> Nota: O código atual possui um `NotificationService` de exemplo que ainda não envia e‑mails de fato. Após configurar SMTP, implemente o envio real (ex.: `SmtpClient`/MailKit) usando esses valores.

## Opção 1: SMTP de desenvolvimento com MailHog

MailHog captura e‑mails enviados pela aplicação e exibe em UI web (sem entrega externa). Ótimo para testes.

Via Docker:

```bash
sudo docker run -d --name mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog
```

- Configure a aplicação para `Host=localhost`, `Port=1025` e `From` adequado.
- Acesse a caixa de e‑mails em `http://SEU_SERVIDOR:8025`.

## Opção 2: Provedor SMTP externo (produção)

Use serviços como SendGrid, Mailgun, Amazon SES ou seu provedor de e‑mail. Exemplo (SendGrid):

- Host: `smtp.sendgrid.net`
- Porta: `587`
- User: `apikey` (conforme SendGrid)
- Password: `SG.xxxxx...`
- From: `notificacoes@seudominio.com` (domínio verificado)

Defina no serviço systemd (exemplo):

```
Environment=SmtpSettings__Host=smtp.sendgrid.net
Environment=SmtpSettings__Port=587
Environment=SmtpSettings__User=apikey
Environment=SmtpSettings__Password=SG.xxxxx
Environment=SmtpSettings__From=notificacoes@seudominio.com
```

## Opção 3: Postfix como relay local

Configure o Postfix no servidor para relé via um provedor SMTP. A aplicação aponta para `localhost:25` sem autenticação (o Postfix faz a autenticação no provedor).

```bash
sudo apt install -y postfix libsasl2-modules
# Edite /etc/postfix/main.cf e adicione/ajuste:
# relayhost = [smtp.sendgrid.net]:587
# smtp_sasl_auth_enable = yes
# smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
# smtp_sasl_security_options = noanonymous
# smtp_use_tls = yes
# smtp_tls_security_level = encrypt
# smtp_tls_note_starttls_offer = yes

echo "[smtp.sendgrid.net]:587 apikey:SG.xxxxx" | sudo tee /etc/postfix/sasl_passwd >/dev/null
sudo postmap /etc/postfix/sasl_passwd
sudo systemctl restart postfix
```

Então, configure a aplicação para:

```
SmtpSettings__Host=127.0.0.1
SmtpSettings__Port=25
SmtpSettings__User=
SmtpSettings__Password=
SmtpSettings__From=notificacoes@seudominio.com
```

## Testes e troubleshooting

- Verifique logs da API: `sudo journalctl -u extension-events-api -f`.
- Teste conectividade SMTP ao host/porta definidos (ex.: `telnet`, `nc`, `openssl s_client -starttls smtp -connect host:587`).
- Em MailHog: abra `http://SEU_SERVIDOR:8025` e confirme o recebimento.
- Em provedores externos: valide domínio/remetente e cheque bloqueios de firewall/ISP.

## Resumo

- API publicada como serviço systemd + Nginx reverse proxy.
- Frontend servido como arquivos estáticos pelo Nginx.
- SMTP configurado via `SmtpSettings` (MailHog para dev, provedor/relay para produção).
- Rode migrações do EF antes/como parte do deploy.

