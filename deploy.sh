#!/bin/sh

lftp -u $FTP_USER,$FTP_PASSWORD -e "set ftp:ssl-allow no; set ssl:verify-certificate no; mirror -Rev -x .git . web_bazaars/. ; exit" ftp://$FTP_HOST/
