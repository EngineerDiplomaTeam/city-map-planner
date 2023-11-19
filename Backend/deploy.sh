#!/bin/bash

echo "Removing all files from /opt/city-planner-backend/publish"
rm -Rf /opt/city-planner-backend/publish/*

echo "Copying publish files to /opt/city-planner-backend/publish/"
cp WebApi/bin/production/net8.0/publish/* /opt/city-planner-backend/publish/

echo "Preparing SystemD service file"
rm -f /etc/systemd/system/city-planner-backend.service
cat <<EOT >> /etc/systemd/system/city-planner-backend.service
[Unit]
Description=City planner backend
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=ubuntu
ExecStart=/opt/city-planner-backend/publish/WebApi

[Install]
WantedBy=multi-user.target
EOT

echo "Enabling SystemD service file"
systemctl enable city-planner-backend
echo "Restarting SystemD service file"
systemctl restart city-planner-backend

echo "Backend deployment done"
