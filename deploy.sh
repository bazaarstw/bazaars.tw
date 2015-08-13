#!/bin/sh

lftp -u $FTP_USER,$FTP_PASSWORD -e "set ssl:verify-certificate no; mirror -Rev -X .git . web_bazaars/. ; exit" ftp://$FTP_HOST/
