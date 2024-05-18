#!/bin/bash

# Caminho para o interpretador PHP
PHP_BIN="/usr/bin/php8.1"

# Caminho para o script PHP
PHP_SCRIPT="/home/rdpuser/projects/token/loja/prd.php"

# Executar o script PHP
$PHP_BIN $PHP_SCRIPT

# Opcional: redirecionar a saída para um arquivo de log
$PHP_BIN $PHP_SCRIPT >> /home/rdpuser/projects/logs/prd.log 2>&1
