#!/bin/sh

lftp -u $FTP_USER,$FTP_PASSWORD -e "set ftp:ssl-allow no; mirror -R -e . web_bazaars ; exit" ftp://$FTP_HOST/
